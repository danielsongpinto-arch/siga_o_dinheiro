import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "@/types/notes";

const NOTES_KEY = "siga_o_dinheiro_notes";

export function useNotes(articleId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (data) {
        const allNotes = JSON.parse(data) as Note[];
        setNotes(articleId ? allNotes.filter((n) => n.articleId === articleId) : allNotes);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
      setLoading(false);
    }
  };

  const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      const allNotes = data ? (JSON.parse(data) as Note[]) : [];

      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = [...allNotes, newNote];
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      await loadNotes();
      return newNote;
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (!data) return;

      const allNotes = JSON.parse(data) as Note[];
      const updatedNotes = allNotes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      );

      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      await loadNotes();
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (!data) return;

      const allNotes = JSON.parse(data) as Note[];
      const updatedNotes = allNotes.filter((note) => note.id !== id);

      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      await loadNotes();
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
      throw error;
    }
  };

  const searchNotes = (query: string) => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getNotesByTheme = async (themeId: string) => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      if (!data) return [];

      const allNotes = JSON.parse(data) as Note[];
      const { ARTICLES } = await import("@/data/mock-data");
      
      const themeArticleIds = ARTICLES.filter((a) => a.themeId === themeId).map((a) => a.id);
      return allNotes.filter((note) => themeArticleIds.includes(note.articleId));
    } catch (error) {
      console.error("Erro ao buscar notas por tema:", error);
      return [];
    }
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNotesByTheme,
  };
}
