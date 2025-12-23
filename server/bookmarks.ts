import { eq, and } from "drizzle-orm";
import { bookmarks, InsertBookmark } from "../drizzle/schema";
import { getDb } from "./db";

export async function getUserBookmarks(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bookmarks: database not available");
    return [];
  }

  try {
    const result = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
    return result.map((bookmark) => ({
      ...bookmark,
      tags: bookmark.tags ? JSON.parse(bookmark.tags) : [],
    }));
  } catch (error) {
    console.error("[Database] Failed to get bookmarks:", error);
    return [];
  }
}

export async function upsertBookmark(bookmark: any) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert bookmark: database not available");
    return;
  }

  try {
    const values: InsertBookmark = {
      id: bookmark.id,
      userId: bookmark.userId,
      articleId: bookmark.articleId,
      articleTitle: bookmark.articleTitle,
      partTitle: bookmark.partTitle,
      excerpt: bookmark.excerpt,
      note: bookmark.note ?? null,
      tags: bookmark.tags ? JSON.stringify(bookmark.tags) : null,
      createdAt: bookmark.createdAt ? new Date(bookmark.createdAt) : new Date(),
      updatedAt: new Date(),
    };

    await db
      .insert(bookmarks)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          articleTitle: values.articleTitle,
          partTitle: values.partTitle,
          excerpt: values.excerpt,
          note: values.note,
          tags: values.tags,
          updatedAt: values.updatedAt,
        },
      });
  } catch (error) {
    console.error("[Database] Failed to upsert bookmark:", error);
    throw error;
  }
}

export async function deleteBookmark(bookmarkId: string, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete bookmark: database not available");
    return;
  }

  try {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.userId, userId)));
  } catch (error) {
    console.error("[Database] Failed to delete bookmark:", error);
    throw error;
  }
}

export async function syncBookmarks(
  userId: number,
  clientBookmarks: Array<any>,
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot sync bookmarks: database not available");
    return { synced: 0, serverBookmarks: [] };
  }

  try {
    // Obter bookmarks do servidor
    const serverBookmarks = await getUserBookmarks(userId);

    // Criar map de bookmarks do servidor por ID
    const serverMap = new Map(serverBookmarks.map((b) => [b.id, b]));

    // Sincronizar cada bookmark do cliente
    let synced = 0;
    for (const clientBookmark of clientBookmarks) {
      const serverBookmark = serverMap.get(clientBookmark.id);

      // Se não existe no servidor ou cliente é mais recente, fazer upsert
      const clientDate = clientBookmark.updatedAt || clientBookmark.createdAt;
      if (
        !serverBookmark ||
        (clientDate && new Date(clientDate) > new Date(serverBookmark.updatedAt))
      ) {
        await upsertBookmark({ ...clientBookmark, userId });
        synced++;
      }
    }

    // Retornar bookmarks atualizados do servidor
    const updatedServerBookmarks = await getUserBookmarks(userId);

    return {
      synced,
      serverBookmarks: updatedServerBookmarks,
    };
  } catch (error) {
    console.error("[Database] Failed to sync bookmarks:", error);
    throw error;
  }
}
