import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useNotes } from "@/hooks/use-notes";
import { ARTICLES } from "@/data/mock-data";

export default function AllNotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notes, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const displayedNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const getArticleTitle = (articleId: string) => {
    return ARTICLES.find((a) => a.id === articleId)?.title || "Artigo desconhecido";
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Todas as Notas",
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <ThemedView style={[styles.searchBar, { backgroundColor: cardBg, borderColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar em notas..."
            placeholderTextColor={textSecondary}
            style={[styles.searchInput, { color: useThemeColor({}, "text") }]}
          />
          {searchQuery.length > 0 && (
            <WebClickable onPress={() => setSearchQuery("")}>
              <IconSymbol name="xmark.circle.fill" size={20} color={textSecondary} />
            </WebClickable>
          )}
        </ThemedView>

        {displayedNotes.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="doc.text.fill" size={64} color={textSecondary} />
            <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
              {searchQuery ? "Nenhuma nota encontrada" : "Nenhuma nota criada ainda"}
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: textSecondary }]}>
              {searchQuery
                ? "Tente buscar por outros termos"
                : "Crie notas nos artigos para vê-las aqui"}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.notesList}>
            {displayedNotes.map((note) => (
              <WebClickable
                key={note.id}
                onPress={() => router.push(`/notes/${note.articleId}` as any)}
                style={({ pressed }) => [
                  styles.noteCard,
                  { backgroundColor: cardBg, borderColor, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                  {note.title}
                </ThemedText>

                <ThemedText style={[styles.articleTitle, { color: tintColor }]} numberOfLines={1}>
                  📄 {getArticleTitle(note.articleId)}
                </ThemedText>

                <ThemedText style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </ThemedText>

                {note.tags.length > 0 && (
                  <ThemedView style={styles.noteTags}>
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <ThemedView key={index} style={[styles.tag, { backgroundColor: borderColor }]}>
                        <ThemedText style={[styles.tagText, { color: tintColor }]}>
                          {tag}
                        </ThemedText>
                      </ThemedView>
                    ))}
                    {note.tags.length > 3 && (
                      <ThemedText style={[styles.moreTagsText, { color: textSecondary }]}>
                        +{note.tags.length - 3}
                      </ThemedText>
                    )}
                  </ThemedView>
                )}

                <ThemedText style={[styles.noteDate, { color: textSecondary }]}>
                  {new Date(note.updatedAt).toLocaleDateString("pt-BR")}
                </ThemedText>
              </WebClickable>
            ))}
          </ThemedView>
        )}
      </ScrollView>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
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
  noteTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: "500",
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
    alignItems: "center",
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
  moreTagsText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  noteDate: {
    fontSize: 12,
    lineHeight: 18,
  },
});
