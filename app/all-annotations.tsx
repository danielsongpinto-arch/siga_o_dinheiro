import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { Paths, File } from "expo-file-system";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useNotes } from "@/hooks/use-notes";
import { ARTICLES } from "@/data/mock-data";

type FilterType = "all" | "recent" | "tagged";

export default function AllAnnotationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    cardBg: useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background"),
    border: useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text"),
  };

  const { notes: allNotes } = useNotes();
  const [filter, setFilter] = useState<FilterType>("all");
  const [exporting, setExporting] = useState(false);

  // Agrupar notas por artigo
  const notesByArticle = allNotes.reduce((acc, note) => {
    if (!acc[note.articleId]) {
      acc[note.articleId] = [];
    }
    acc[note.articleId].push(note);
    return acc;
  }, {} as Record<string, typeof allNotes>);

  // Filtrar notas
  const filteredNotes =
    filter === "recent"
      ? allNotes.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
      : filter === "tagged"
      ? allNotes.filter((n) => n.tags.length > 0)
      : allNotes;

  const handleExport = async () => {
    try {
      setExporting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Gerar texto formatado
      let exportText = "# Minhas Anotações - Siga o Dinheiro\n\n";
      exportText += `Exportado em: ${new Date().toLocaleString("pt-BR")}\n`;
      exportText += `Total de notas: ${allNotes.length}\n\n`;
      exportText += "---\n\n";

      for (const [articleId, notes] of Object.entries(notesByArticle)) {
        const article = ARTICLES.find((a) => a.id === articleId);
        if (!article) continue;

        exportText += `## ${article.title}\n\n`;
        exportText += `**Autor:** ${article.articleAuthor || "DGP"}\n`;
        exportText += `**Data:** ${new Date(article.date).toLocaleDateString("pt-BR")}\n\n`;

        notes.forEach((note, index) => {
          exportText += `### Nota ${index + 1}: ${note.title}\n\n`;
          exportText += `${note.content}\n\n`;
          if (note.tags.length > 0) {
            exportText += `**Tags:** ${note.tags.join(", ")}\n`;
          }
          exportText += `**Criado em:** ${new Date(note.createdAt).toLocaleString("pt-BR")}\n\n`;
          exportText += "---\n\n";
        });
      }

      // Salvar em arquivo
      const fileName = `anotacoes_${Date.now()}.txt`;
      const file = new File(Paths.cache, fileName);
      await file.write(exportText);

      // Compartilhar
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/plain",
          dialogTitle: "Exportar Anotações",
        });
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("[AllAnnotations] Export failed:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Falha ao exportar anotações. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <WebClickable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.tint} />
        </WebClickable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Todas as Anotações
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            {allNotes.length} {allNotes.length === 1 ? "nota" : "notas"}
          </ThemedText>
        </View>
        <WebClickable
          onPress={handleExport}
          disabled={exporting || allNotes.length === 0}
          style={styles.exportButton}
        >
          <IconSymbol
            name="square.and.arrow.up"
            size={24}
            color={allNotes.length === 0 ? colors.icon : colors.tint}
          />
        </WebClickable>
      </View>

      {/* Filters */}
      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        <WebClickable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFilter("all");
          }}
          style={[
            styles.filterButton,
            filter === "all" && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "all" && { color: "#fff", fontWeight: "600" },
            ]}
          >
            Todas
          </ThemedText>
        </WebClickable>
        <WebClickable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFilter("recent");
          }}
          style={[
            styles.filterButton,
            filter === "recent" && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "recent" && { color: "#fff", fontWeight: "600" },
            ]}
          >
            Recentes
          </ThemedText>
        </WebClickable>
        <WebClickable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFilter("tagged");
          }}
          style={[
            styles.filterButton,
            filter === "tagged" && { backgroundColor: colors.tint },
          ]}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === "tagged" && { color: "#fff", fontWeight: "600" },
            ]}
          >
            Com Tags
          </ThemedText>
        </WebClickable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text" size={64} color={colors.icon} />
            <ThemedText type="subtitle" style={[styles.emptyTitle, { marginTop: 16 }]}>
              Nenhuma anotação
            </ThemedText>
            <ThemedText style={[styles.emptyDescription, { color: colors.icon }]}>
              {filter === "all"
                ? "Comece a fazer anotações nos artigos"
                : filter === "recent"
                ? "Nenhuma anotação recente"
                : "Nenhuma anotação com tags"}
            </ThemedText>
          </View>
        ) : (
          Object.entries(notesByArticle).map(([articleId, notes]) => {
            const article = ARTICLES.find((a) => a.id === articleId);
            if (!article) return null;

            // Filtrar notas do artigo
            const articleNotes = notes.filter((n) => filteredNotes.includes(n));
            if (articleNotes.length === 0) return null;

            return (
              <View
                key={articleId}
                style={[styles.articleGroup, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              >
                <WebClickable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/article/${articleId}` as any);
                  }}
                  style={styles.articleHeader}
                >
                  <View style={styles.articleInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.articleTitle}>
                      {article.title}
                    </ThemedText>
                    <ThemedText style={[styles.articleMeta, { color: colors.icon }]}>
                      {article.articleAuthor || "DGP"} • {formatDate(article.date)}
                    </ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </WebClickable>

                {articleNotes.map((note) => (
                  <WebClickable
                    key={note.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(`/notes/${articleId}` as any);
                    }}
                    style={[styles.noteItem, { borderTopColor: colors.border }]}
                  >
                    <View style={styles.noteContent}>
                      <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                        {note.title}
                      </ThemedText>
                      <ThemedText
                        style={[styles.noteText, { color: colors.icon }]}
                        numberOfLines={2}
                      >
                        {note.content}
                      </ThemedText>
                      {note.tags.length > 0 && (
                        <View style={styles.tags}>
                          {note.tags.map((tag, index) => (
                            <View
                              key={index}
                              style={[styles.tag, { backgroundColor: colors.tint + "20", borderColor: colors.tint }]}
                            >
                              <ThemedText style={[styles.tagText, { color: colors.tint }]}>
                                {tag}
                              </ThemedText>
                            </View>
                          ))}
                        </View>
                      )}
                      <ThemedText style={[styles.noteDate, { color: colors.icon }]}>
                        {formatDate(note.createdAt)}
                      </ThemedText>
                    </View>
                    <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                  </WebClickable>
                ))}
              </View>
            );
          })
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  exportButton: {
    padding: 8,
  },
  filters: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  filterText: {
    fontSize: 14,
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
  emptyTitle: {
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  articleGroup: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  articleMeta: {
    fontSize: 13,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  noteDate: {
    fontSize: 12,
  },
});
