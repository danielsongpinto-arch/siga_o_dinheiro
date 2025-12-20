import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useNotes } from "@/hooks/use-notes";
import { ARTICLES } from "@/data/mock-data";

export default function ArticleNotesScreen() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notes, addNote, updateNote, deleteNote } = useNotes(articleId);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const article = ARTICLES.find((a) => a.id === articleId);

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Erro", "Título e conteúdo são obrigatórios");
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingId) {
        await updateNote(editingId, { title, content, tags: tagArray });
      } else {
        await addNote({
          articleId: articleId || "",
          title,
          content,
          tags: tagArray,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsCreating(false);
      setEditingId(null);
      setTitle("");
      setContent("");
      setTags("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a nota");
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditingId(noteId);
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(", "));
      setIsCreating(true);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert("Excluir Nota", "Tem certeza que deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteNote(noteId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Notas - ${article?.title || "Artigo"}`,
          headerRight: () => (
            <Pressable
              onPress={() => setIsCreating(true)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <IconSymbol name="plus" size={24} color={tintColor} />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {isCreating && (
            <ThemedView style={[styles.noteForm, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                {editingId ? "Editar Nota" : "Nova Nota"}
              </ThemedText>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Título da nota"
                placeholderTextColor={textSecondary}
                style={[styles.input, { borderColor, color: useThemeColor({}, "text") }]}
              />

              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Conteúdo da nota..."
                placeholderTextColor={textSecondary}
                multiline
                numberOfLines={6}
                style={[
                  styles.input,
                  styles.textArea,
                  { borderColor, color: useThemeColor({}, "text") },
                ]}
              />

              <TextInput
                value={tags}
                onChangeText={setTags}
                placeholder="Tags (separadas por vírgula)"
                placeholderTextColor={textSecondary}
                style={[styles.input, { borderColor, color: useThemeColor({}, "text") }]}
              />

              <ThemedView style={styles.formActions}>
                <Pressable
                  onPress={handleCancel}
                  style={[styles.button, styles.cancelButton, { borderColor }]}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleSaveNote}
                  style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
                >
                  <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          )}

          {notes.length === 0 && !isCreating ? (
            <ThemedView style={styles.emptyState}>
              <IconSymbol name="doc.text.fill" size={64} color={textSecondary} />
              <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
                Nenhuma nota criada ainda
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textSecondary }]}>
                Toque no + para criar sua primeira nota
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={styles.notesList}>
              {notes.map((note) => (
                <ThemedView
                  key={note.id}
                  style={[styles.noteCard, { backgroundColor: cardBg, borderColor }]}
                >
                  <ThemedView style={styles.noteHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                      {note.title}
                    </ThemedText>
                    <ThemedView style={styles.noteActions}>
                      <Pressable
                        onPress={() => handleEditNote(note.id)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginRight: 12 }]}
                      >
                        <IconSymbol name="pencil" size={20} color={tintColor} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteNote(note.id)}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <IconSymbol name="trash.fill" size={20} color="#FF3B30" />
                      </Pressable>
                    </ThemedView>
                  </ThemedView>

                  <ThemedText style={styles.noteContent}>{note.content}</ThemedText>

                  {note.tags.length > 0 && (
                    <ThemedView style={styles.noteTags}>
                      {note.tags.map((tag, index) => (
                        <ThemedView
                          key={index}
                          style={[styles.tag, { backgroundColor: borderColor }]}
                        >
                          <ThemedText style={[styles.tagText, { color: tintColor }]}>
                            {tag}
                          </ThemedText>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}

                  <ThemedText style={[styles.noteDate, { color: textSecondary }]}>
                    Atualizado em {new Date(note.updatedAt).toLocaleDateString("pt-BR")}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  noteForm: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  saveButton: {},
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  notesList: {
    gap: 16,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
  },
  noteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  noteTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  noteDate: {
    fontSize: 12,
    lineHeight: 18,
  },
});
