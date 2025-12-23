import { Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOfflineCache } from "@/hooks/use-offline-cache";
import { ARTICLES, THEMES } from "@/data/mock-data";
import { Article } from "@/types";

interface SeriesPreviewModalProps {
  visible: boolean;
  themeId: string;
  onClose: () => void;
  onConfirm: () => void;
  onSchedule: () => void;
}

export function SeriesPreviewModal({
  visible,
  themeId,
  onClose,
  onConfirm,
  onSchedule,
}: SeriesPreviewModalProps) {
  const cardBg = useThemeColor({}, "cardBackground");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");
  const { isArticleCached } = useOfflineCache();

  const theme = THEMES.find((t) => t.id === themeId);
  const seriesArticles = ARTICLES.filter((a) => a.themeId === themeId);
  
  const estimateArticleSize = (article: Article): number => {
    // Estimativa simples: ~1KB por 500 caracteres
    const contentSize = article.content.length / 500;
    return Math.ceil(contentSize);
  };

  const totalSize = seriesArticles.reduce((acc, article) => acc + estimateArticleSize(article), 0);
  const cachedCount = seriesArticles.filter((a) => isArticleCached(a.id)).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: cardBg }]} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
            <ThemedView style={styles.headerLeft}>
              <IconSymbol name="arrow.down.to.line" size={24} color={tintColor} />
              <ThemedView>
                <ThemedText type="subtitle">Baixar Série</ThemedText>
                <ThemedText style={[styles.themeName, { color: secondaryText }]}>
                  {theme?.title || "Série"}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={secondaryText} />
            </Pressable>
          </ThemedView>

          {/* Summary */}
          <ThemedView style={[styles.summary, { borderBottomColor: borderColor }]}>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={{ color: secondaryText }}>Total de artigos:</ThemedText>
              <ThemedText type="defaultSemiBold">{seriesArticles.length}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={{ color: secondaryText }}>Já em cache:</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: "#34C759" }}>
                {cachedCount}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText style={{ color: secondaryText }}>Tamanho estimado:</ThemedText>
              <ThemedText type="defaultSemiBold">{totalSize} KB</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Article List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {seriesArticles.map((article, index) => {
              const isCached = isArticleCached(article.id);
              const size = estimateArticleSize(article);

              return (
                <ThemedView
                  key={article.id}
                  style={[styles.articleItem, { borderBottomColor: borderColor }]}
                >
                  <ThemedView style={styles.articleLeft}>
                    <ThemedText style={[styles.articleNumber, { color: secondaryText }]}>
                      {index + 1}
                    </ThemedText>
                    <ThemedView style={styles.articleInfo}>
                      <ThemedText numberOfLines={2}>{article.title}</ThemedText>
                      <ThemedText style={[styles.articleSize, { color: secondaryText }]}>
                        {size} KB
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {isCached && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
                  )}
                </ThemedView>
              );
            })}
          </ScrollView>

          {/* Actions */}
          <ThemedView style={[styles.actions, { borderTopColor: borderColor }]}>
            <Pressable
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={onClose}
            >
              <ThemedText style={{ color: secondaryText }}>Cancelar</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.scheduleButton, { borderColor: tintColor }]}
              onPress={() => {
                onSchedule();
              }}
            >
              <IconSymbol name="clock" size={18} color={tintColor} />
              <ThemedText style={{ color: tintColor, fontWeight: "600" }}>Agendar</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton, { backgroundColor: tintColor }]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <ThemedText style={styles.confirmText}>
                Baixar Agora
              </ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  themeName: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  summary: {
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  list: {
    maxHeight: 300,
  },
  articleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  articleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  articleNumber: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 24,
  },
  articleInfo: {
    flex: 1,
    gap: 4,
  },
  articleSize: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  scheduleButton: {
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
