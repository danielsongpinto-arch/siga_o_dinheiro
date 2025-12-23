import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const STORAGE_KEY = "article_comments";

export interface ArticleComment {
  id: string;
  articleId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export function useArticleComments(articleId: string) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allComments: ArticleComment[] = JSON.parse(stored);
        const articleComments = allComments.filter((c) => c.articleId === articleId);
        // Ordenar por data de criação (mais recente primeiro)
        articleComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(articleComments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (text: string) => {
    try {
      const newComment: ArticleComment = {
        id: Date.now().toString(),
        articleId,
        text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const allComments: ArticleComment[] = stored ? JSON.parse(stored) : [];
      allComments.push(newComment);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));

      setComments([newComment, ...comments]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error adding comment:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const updateComment = async (commentId: string, text: string) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allComments: ArticleComment[] = JSON.parse(stored);
      const commentIndex = allComments.findIndex((c) => c.id === commentId);
      if (commentIndex === -1) return;

      allComments[commentIndex].text = text;
      allComments[commentIndex].updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));

      const updatedComments = comments.map((c) =>
        c.id === commentId ? { ...c, text, updatedAt: new Date().toISOString() } : c
      );
      setComments(updatedComments);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error("Error updating comment:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const allComments: ArticleComment[] = JSON.parse(stored);
      const filtered = allComments.filter((c) => c.id !== commentId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      setComments(comments.filter((c) => c.id !== commentId));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error deleting comment:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const getCommentsCount = (): number => {
    return comments.length;
  };

  return {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getCommentsCount,
  };
}
