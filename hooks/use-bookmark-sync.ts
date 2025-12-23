import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";
import { useAuth } from "./use-auth";
import { Bookmark } from "@/components/article-bookmarks";

const SYNC_ENABLED_KEY = "bookmark_sync_enabled";
const LAST_SYNC_KEY = "last_bookmark_sync";

export function useBookmarkSync() {
  const { isAuthenticated, user } = useAuth();
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncMutation = trpc.bookmarks.sync.useMutation();
  const upsertMutation = trpc.bookmarks.upsert.useMutation();
  const deleteMutation = trpc.bookmarks.delete.useMutation();

  // Carregar preferência de sync
  useEffect(() => {
    AsyncStorage.getItem(SYNC_ENABLED_KEY).then((value) => {
      setSyncEnabled(value === "true");
    });
    AsyncStorage.getItem(LAST_SYNC_KEY).then((value) => {
      if (value) {
        setLastSyncTime(new Date(value));
      }
    });
  }, []);

  // Habilitar/desabilitar sync
  const toggleSync = useCallback(async () => {
    const newValue = !syncEnabled;
    setSyncEnabled(newValue);
    await AsyncStorage.setItem(SYNC_ENABLED_KEY, String(newValue));

    // Se ativando sync, fazer upload imediato
    if (newValue && isAuthenticated) {
      await performSync();
    }
  }, [syncEnabled, isAuthenticated]);

  // Realizar sincronização completa
  const performSync = useCallback(async () => {
    if (!isAuthenticated || !syncEnabled) {
      return { success: false, message: "Sync não habilitado ou usuário não autenticado" };
    }

    setIsSyncing(true);
    try {
      // Obter todos os bookmarks locais
      const keys = await AsyncStorage.getAllKeys();
      const bookmarkKeys = keys.filter((key) => key.startsWith("bookmarks_"));
      const bookmarkData = await AsyncStorage.multiGet(bookmarkKeys);

      const localBookmarks: Bookmark[] = [];
      bookmarkData.forEach(([key, value]) => {
        if (value) {
          const parsed = JSON.parse(value);
          localBookmarks.push(...parsed);
        }
      });

      // Sincronizar com servidor
      const result = await syncMutation.mutateAsync(
        localBookmarks.map((b) => ({
          id: b.id,
          articleId: b.articleId,
          articleTitle: b.articleTitle,
          partTitle: b.partTitle,
          excerpt: b.excerpt,
          note: b.note,
          tags: b.tags,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
      );

      // Atualizar bookmarks locais com dados do servidor
      const groupedByArticle: Record<string, Bookmark[]> = {};
      result.serverBookmarks.forEach((bookmark: any) => {
        if (!groupedByArticle[bookmark.articleId]) {
          groupedByArticle[bookmark.articleId] = [];
        }
        groupedByArticle[bookmark.articleId].push(bookmark);
      });

      // Salvar no AsyncStorage
      for (const [articleId, bookmarks] of Object.entries(groupedByArticle)) {
        await AsyncStorage.setItem(`bookmarks_${articleId}`, JSON.stringify(bookmarks));
      }

      // Atualizar timestamp
      const now = new Date();
      setLastSyncTime(now);
      await AsyncStorage.setItem(LAST_SYNC_KEY, now.toISOString());

      setIsSyncing(false);
      return {
        success: true,
        message: `${result.synced} ${result.synced === 1 ? "destaque sincronizado" : "destaques sincronizados"}`,
      };
    } catch (error) {
      console.error("[Sync] Error syncing bookmarks:", error);
      setIsSyncing(false);
      return { success: false, message: "Erro ao sincronizar destaques" };
    }
  }, [isAuthenticated, syncEnabled, syncMutation]);

  // Sincronizar bookmark individual (ao criar/editar)
  const syncBookmark = useCallback(
    async (bookmark: Bookmark) => {
      if (!isAuthenticated || !syncEnabled) {
        return;
      }

      try {
        await upsertMutation.mutateAsync({
          id: bookmark.id,
          articleId: bookmark.articleId,
          articleTitle: bookmark.articleTitle,
          partTitle: bookmark.partTitle,
          excerpt: bookmark.excerpt,
          note: bookmark.note,
          tags: bookmark.tags,
          createdAt: bookmark.createdAt,
          updatedAt: bookmark.updatedAt || new Date().toISOString(),
        });
      } catch (error) {
        console.error("[Sync] Error syncing bookmark:", error);
      }
    },
    [isAuthenticated, syncEnabled, upsertMutation],
  );

  // Deletar bookmark no servidor
  const deleteBookmarkOnServer = useCallback(
    async (bookmarkId: string) => {
      if (!isAuthenticated || !syncEnabled) {
        return;
      }

      try {
        await deleteMutation.mutateAsync({ id: bookmarkId });
      } catch (error) {
        console.error("[Sync] Error deleting bookmark:", error);
      }
    },
    [isAuthenticated, syncEnabled, deleteMutation],
  );

  return {
    syncEnabled,
    isSyncing,
    lastSyncTime,
    toggleSync,
    performSync,
    syncBookmark,
    deleteBookmarkOnServer,
  };
}
