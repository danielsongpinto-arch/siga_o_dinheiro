import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const PENDING_SYNC_KEY = "pending_offline_sync";

export interface PendingSyncItem {
  id: string;
  type: "bookmark" | "comment" | "progress";
  data: any;
  timestamp: string;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingItems, setPendingItems] = useState<PendingSyncItem[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    loadPendingItems();
    setupNetworkListener();
  }, []);

  const setupNetworkListener = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const wasOffline = !isOnline;
      const isNowOnline = state.isConnected ?? true;
      
      setIsOnline(isNowOnline);

      // Se voltou online, sincronizar automaticamente
      if (wasOffline && isNowOnline) {
        console.log("[OfflineSync] Connection restored, syncing...");
        syncPendingItems();
      }
    });

    return unsubscribe;
  };

  const loadPendingItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(PENDING_SYNC_KEY);
      if (stored) {
        setPendingItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading pending sync items:", error);
    }
  };

  const savePendingItems = async (items: PendingSyncItem[]) => {
    try {
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(items));
      setPendingItems(items);
    } catch (error) {
      console.error("Error saving pending sync items:", error);
    }
  };

  const addPendingItem = async (item: Omit<PendingSyncItem, "id" | "timestamp">) => {
    const newItem: PendingSyncItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    const updatedItems = [...pendingItems, newItem];
    await savePendingItems(updatedItems);

    // Se estiver online, tentar sincronizar imediatamente
    if (isOnline) {
      await syncPendingItems();
    }
  };

  const syncPendingItems = async () => {
    if (isSyncing || pendingItems.length === 0) {
      return;
    }

    setIsSyncing(true);

    try {
      // Simular sincronização (em produção, fazer chamadas reais à API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Por enquanto, apenas limpar itens pendentes
      // Em produção, processar cada item e remover apenas os que foram sincronizados com sucesso
      await savePendingItems([]);
      setLastSyncTime(new Date().toISOString());

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log("[OfflineSync] Sync completed successfully");
    } catch (error) {
      console.error("Error syncing pending items:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearPendingItems = async () => {
    await savePendingItems([]);
  };

  const getPendingCount = (): number => {
    return pendingItems.length;
  };

  const getLastSyncFormatted = (): string | null => {
    if (!lastSyncTime) return null;

    const date = new Date(lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    isOnline,
    isSyncing,
    pendingItems,
    lastSyncTime,
    addPendingItem,
    syncPendingItems,
    clearPendingItems,
    getPendingCount,
    getLastSyncFormatted,
  };
}
