import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export interface Bookmark {
  id: string;
  articleId: string;
  articleTitle: string;
  partTitle: string;
  excerpt: string;
  note?: string;
  tags?: string[];
  createdAt: string;
}

export const PREDEFINED_TAGS = [
  { id: "importante", label: "Importante", color: "#FF3B30" },
  { id: "revisar", label: "Revisar", color: "#FF9500" },
  { id: "citar", label: "Citar", color: "#007AFF" },
  { id: "duvida", label: "Dúvida", color: "#5856D6" },
  { id: "insight", label: "Insight", color: "#34C759" },
];

interface ArticleBookmarksProps {
  articleId: string;
  articleTitle: string;
  onClose: () => void;
}

const STORAGE_KEY = "article_bookmarks";

export function ArticleBookmarks({ articleId, articleTitle, onClose }: ArticleBookmarksProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allBookmarks: Bookmark[] = JSON.parse(stored);
        const articleBookmarks = allBookmarks.filter((b) => b.articleId === articleId);
        setBookmarks(articleBookmarks);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allBookmarks: Bookmark[] = JSON.parse(stored);
        const updated = allBookmarks.filter((b) => b.id !== bookmarkId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const saveNote = async (bookmarkId: string, note: string, tags: string[]) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allBookmarks: Bookmark[] = JSON.parse(stored);
        const updated = allBookmarks.map((b) =>
          b.id === bookmarkId ? { ...b, note, tags } : b
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBookmarks(bookmarks.map((b) => (b.id === bookmarkId ? { ...b, note, tags } : b)));
      }
      
      setEditingId(null);
      setEditNote("");
      setEditTags([]);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditNote(bookmark.note || "");
    setEditTags(bookmark.tags || []);
  };

  const toggleTag = (tagId: string) => {
    setEditTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.icon + "30" }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Destaques
        </ThemedText>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
            Fechar
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {bookmarks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              Nenhum destaque neste artigo ainda.
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
              Toque e segure em qualquer parágrafo para criar um destaque.
            </ThemedText>
          </ThemedView>
        ) : (
          bookmarks.map((bookmark) => (
            <ThemedView
              key={bookmark.id}
              style={[styles.bookmarkCard, { borderColor: colors.icon + "30" }]}
            >
              <ThemedText type="defaultSemiBold" style={styles.partTitle}>
                {bookmark.partTitle}
              </ThemedText>
              
              <ThemedText style={[styles.excerpt, { color: colors.icon }]}>
                "{bookmark.excerpt}"
              </ThemedText>

              {bookmark.tags && bookmark.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {bookmark.tags.map((tagId) => {
                    const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <View
                        key={tagId}
                        style={[styles.tagChip, { backgroundColor: tag.color + "20" }]}
                      >
                        <Text style={[styles.tagText, { color: tag.color }]}>
                          {tag.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {editingId === bookmark.id ? (
                <View style={styles.noteEditContainer}>
                  <TextInput
                    style={[
                      styles.noteInput,
                      {
                        color: colors.text,
                        borderColor: colors.tint,
                        backgroundColor: colors.background,
                      },
                    ]}
                    value={editNote}
                    onChangeText={setEditNote}
                    placeholder="Adicione uma nota..."
                    placeholderTextColor={colors.icon}
                    multiline
                    autoFocus
                  />
                  
                  <View style={styles.tagsSection}>
                    <ThemedText type="defaultSemiBold" style={styles.tagsSectionTitle}>
                      Tags:
                    </ThemedText>
                    <View style={styles.tagsGrid}>
                      {PREDEFINED_TAGS.map((tag) => {
                        const isSelected = editTags.includes(tag.id);
                        return (
                          <Pressable
                            key={tag.id}
                            onPress={() => toggleTag(tag.id)}
                            style={[
                              styles.tagSelector,
                              {
                                backgroundColor: isSelected ? tag.color : tag.color + "20",
                                borderColor: tag.color,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tagSelectorText,
                                { color: isSelected ? "#fff" : tag.color },
                              ]}
                            >
                              {tag.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  
                  <View style={styles.noteActions}>
                    <Pressable
                      onPress={() => {
                        setEditingId(null);
                        setEditNote("");
                        setEditTags([]);
                      }}
                      style={styles.noteActionButton}
                    >
                      <ThemedText style={{ color: colors.icon }}>Cancelar</ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => saveNote(bookmark.id, editNote, editTags)}
                      style={[styles.noteActionButton, { backgroundColor: colors.tint }]}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>Salvar</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  {bookmark.note && (
                    <ThemedText style={styles.note}>💭 {bookmark.note}</ThemedText>
                  )}
                  
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => startEditing(bookmark)}
                      style={styles.actionButton}
                    >
                      <ThemedText style={{ color: colors.tint, fontSize: 14 }}>
                        {bookmark.note ? "Editar nota" : "Adicionar nota"}
                      </ThemedText>
                    </Pressable>
                    
                    <Pressable
                      onPress={() => deleteBookmark(bookmark.id)}
                      style={styles.actionButton}
                    >
                      <ThemedText style={{ color: "#FF3B30", fontSize: 14 }}>
                        Excluir
                      </ThemedText>
                    </Pressable>
                  </View>
                </>
              )}

              <ThemedText style={[styles.timestamp, { color: colors.icon }]}>
                {new Date(bookmark.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            </ThemedView>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  bookmarkCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  partTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  noteEditContainer: {
    marginTop: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  noteActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tagsSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  tagsSectionTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagSelector: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  tagSelectorText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

// Helper function to create a bookmark (to be called from article screen)
export async function createBookmark(
  articleId: string,
  articleTitle: string,
  partTitle: string,
  excerpt: string
): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const bookmark: Bookmark = {
      id: `${articleId}-${Date.now()}`,
      articleId,
      articleTitle,
      partTitle,
      excerpt: excerpt.substring(0, 200), // Limit excerpt length
      createdAt: new Date().toISOString(),
    };

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const bookmarks: Bookmark[] = stored ? JSON.parse(stored) : [];
    bookmarks.push(bookmark);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error creating bookmark:", error);
  }
}

// Helper function to get all bookmarks (for a global bookmarks screen)
export async function getAllBookmarks(): Promise<Bookmark[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting bookmarks:", error);
    return [];
  }
}
