import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useHighlights } from "@/hooks/use-highlights";

export default function HighlightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { highlights, removeHighlight } = useHighlights();

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  const handleDelete = (highlightId: string) => {
    Alert.alert(
      "Remover Marcador",
      "Tem certeza que deseja remover este marcador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            await removeHighlight(highlightId);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Marcadores",
          headerBackTitle: "Voltar",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        {highlights.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="bookmark" size={48} color={textSecondary} />
            <ThemedText style={styles.emptyText}>Nenhum marcador ainda</ThemedText>
            <ThemedText style={[styles.emptyHint, { color: textSecondary }]}>
              Selecione trechos dos artigos para salvá-los aqui
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.highlightsList}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Seus Marcadores ({highlights.length})
            </ThemedText>
            {highlights.map((highlight) => (
              <ThemedView
                key={highlight.id}
                style={[styles.highlightCard, { backgroundColor: cardBg, borderColor }]}
              >
                <Pressable
                  onPress={() => router.push(`/article/${highlight.articleId}` as any)}
                  style={styles.highlightContent}
                >
                  <ThemedView style={[styles.highlightQuote, { borderColor: tintColor }]}>
                    <ThemedText style={styles.highlightText}>
                      "{highlight.text}"
                    </ThemedText>
                  </ThemedView>
                  {highlight.note && (
                    <ThemedView style={[styles.noteContainer, { backgroundColor: borderColor }]}>
                      <ThemedText style={styles.noteText}>{highlight.note}</ThemedText>
                    </ThemedView>
                  )}
                  <ThemedView style={styles.highlightMeta}>
                    <ThemedView style={styles.highlightInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.highlightArticle}
                        numberOfLines={1}
                      >
                        {highlight.articleTitle}
                      </ThemedText>
                      <ThemedText style={[styles.highlightDate, { color: textSecondary }]}>
                        {formatDate(highlight.createdAt)}
                      </ThemedText>
                    </ThemedView>
                    <IconSymbol name="chevron.right" size={20} color={textSecondary} />
                  </ThemedView>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(highlight.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed,
                  ]}
                >
                  <IconSymbol name="trash.fill" size={20} color="#FF3B30" />
                </Pressable>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  highlightsList: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  highlightCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  highlightContent: {
    padding: 16,
  },
  highlightQuote: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  noteContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  highlightMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  highlightInfo: {
    flex: 1,
  },
  highlightArticle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  highlightDate: {
    fontSize: 12,
    lineHeight: 18,
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
  deleteButtonPressed: {
    opacity: 0.5,
  },
});
