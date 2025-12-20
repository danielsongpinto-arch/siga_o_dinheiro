import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Discussion, Reply } from "@/types/discussion";

const DISCUSSIONS_KEY = "@siga_o_dinheiro:discussions";
const LIKES_KEY = "@siga_o_dinheiro:discussion_likes";

export function useDiscussions(articleId?: string) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscussions();
    loadLikes();
  }, []);

  const loadDiscussions = async () => {
    try {
      const stored = await AsyncStorage.getItem(DISCUSSIONS_KEY);
      if (stored) {
        const allDiscussions = JSON.parse(stored) as Discussion[];
        if (articleId) {
          setDiscussions(allDiscussions.filter((d) => d.articleId === articleId));
        } else {
          setDiscussions(allDiscussions);
        }
      }
    } catch (error) {
      console.error("Error loading discussions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikes = async () => {
    try {
      const stored = await AsyncStorage.getItem(LIKES_KEY);
      if (stored) {
        setLikedItems(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error("Error loading likes:", error);
    }
  };

  const createDiscussion = async (
    title: string,
    content: string,
    userId: string,
    userName: string
  ): Promise<void> => {
    if (!articleId) return;

    try {
      const stored = await AsyncStorage.getItem(DISCUSSIONS_KEY);
      const allDiscussions = stored ? JSON.parse(stored) : [];

      const newDiscussion: Discussion = {
        id: Date.now().toString(),
        articleId,
        userId,
        userName,
        title,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      const updated = [newDiscussion, ...allDiscussions];
      await AsyncStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(updated));
      setDiscussions([newDiscussion, ...discussions]);
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  };

  const addReply = async (
    discussionId: string,
    content: string,
    userId: string,
    userName: string
  ): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(DISCUSSIONS_KEY);
      if (!stored) return;

      const allDiscussions = JSON.parse(stored) as Discussion[];
      const discussionIndex = allDiscussions.findIndex((d) => d.id === discussionId);
      if (discussionIndex === -1) return;

      const newReply: Reply = {
        id: Date.now().toString(),
        discussionId,
        userId,
        userName,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      allDiscussions[discussionIndex].replies.push(newReply);
      await AsyncStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(allDiscussions));
      await loadDiscussions();
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };

  const toggleLike = async (itemId: string, isReply: boolean = false): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(DISCUSSIONS_KEY);
      if (!stored) return;

      const allDiscussions = JSON.parse(stored) as Discussion[];
      let updated = false;

      if (isReply) {
        // Like em resposta
        for (const discussion of allDiscussions) {
          const replyIndex = discussion.replies.findIndex((r) => r.id === itemId);
          if (replyIndex !== -1) {
            if (likedItems.has(itemId)) {
              discussion.replies[replyIndex].likes--;
            } else {
              discussion.replies[replyIndex].likes++;
            }
            updated = true;
            break;
          }
        }
      } else {
        // Like em discussão
        const discussionIndex = allDiscussions.findIndex((d) => d.id === itemId);
        if (discussionIndex !== -1) {
          if (likedItems.has(itemId)) {
            allDiscussions[discussionIndex].likes--;
          } else {
            allDiscussions[discussionIndex].likes++;
          }
          updated = true;
        }
      }

      if (updated) {
        await AsyncStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(allDiscussions));

        const newLikedItems = new Set(likedItems);
        if (likedItems.has(itemId)) {
          newLikedItems.delete(itemId);
        } else {
          newLikedItems.add(itemId);
        }
        setLikedItems(newLikedItems);
        await AsyncStorage.setItem(LIKES_KEY, JSON.stringify([...newLikedItems]));

        await loadDiscussions();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isLiked = (itemId: string): boolean => {
    return likedItems.has(itemId);
  };

  return {
    discussions,
    loading,
    createDiscussion,
    addReply,
    toggleLike,
    isLiked,
  };
}
