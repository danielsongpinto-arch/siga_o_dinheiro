import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Comment } from "@/types";

const COMMENTS_KEY = "@siga_o_dinheiro:comments";

export function useComments(articleId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const data = await AsyncStorage.getItem(COMMENTS_KEY);
      if (data) {
        const allComments: Comment[] = JSON.parse(data);
        const articleComments = allComments.filter((c) => c.articleId === articleId);
        setComments(articleComments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (text: string, userId: string, userName: string) => {
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        articleId,
        userId,
        userName,
        text,
        date: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem(COMMENTS_KEY);
      const allComments: Comment[] = data ? JSON.parse(data) : [];
      allComments.push(newComment);

      await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
      setComments([...comments, newComment]);

      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return {
    comments,
    loading,
    addComment,
  };
}
