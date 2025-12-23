import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Bookmark } from "@/components/article-bookmarks";

const QUEUE_KEY = "offline_sync_queue";

export interface QueueOperation {
  id: string;
  type: "create" | "update" | "delete";
  bookmark?: Bookmark;
  bookmarkId?: string;
  timestamp: string;
}

export function useOfflineSyncQueue() {
  const [queue, setQueue] = useState<QueueOperation[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadQueue();
    
    // Monitorar conectividade
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsOnline(state.isConnected ?? false);
      
      // Se voltou online e tem itens na queue, sincronizar
      if (state.isConnected && queue.length > 0) {
        processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadQueue = async () => {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading sync queue:", error);
    }
  };

  const addToQueue = useCallback(
    async (operation: Omit<QueueOperation, "id" | "timestamp">) => {
      try {
        const newOperation: QueueOperation = {
          ...operation,
          id: `${operation.type}_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        const updated = [...queue, newOperation];
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
        setQueue(updated);

        // Se online, tentar processar imediatamente
        if (isOnline) {
          processQueue();
        }
      } catch (error) {
        console.error("Error adding to sync queue:", error);
      }
    },
    [queue, isOnline]
  );

  const processQueue = useCallback(
    async (syncCallback?: (operations: QueueOperation[]) => Promise<void>) => {
      if (isSyncing || queue.length === 0 || !isOnline) {
        return;
      }

      setIsSyncing(true);
      try {
        // Se callback fornecido, usar para sincronizar
        if (syncCallback) {
          await syncCallback(queue);
        }

        // Limpar queue após sucesso
        await AsyncStorage.removeItem(QUEUE_KEY);
        setQueue([]);
      } catch (error) {
        console.error("Error processing sync queue:", error);
        // Manter queue em caso de erro
      } finally {
        setIsSyncing(false);
      }
    },
    [queue, isOnline, isSyncing]
  );

  const clearQueue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
      setQueue([]);
    } catch (error) {
      console.error("Error clearing sync queue:", error);
    }
  }, []);

  return {
    queue,
    isOnline,
    isSyncing,
    addToQueue,
    processQueue,
    clearQueue,
    hasQueuedOperations: queue.length > 0,
  };
}
