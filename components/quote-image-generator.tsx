import { useRef, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Paths, File } from "expo-file-system";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./themed-text";
import { type Bookmark, PREDEFINED_TAGS } from "./article-bookmarks";

interface QuoteImageGeneratorProps {
  bookmark: Bookmark;
  onGenerate: () => void;
  onComplete: () => void;
}

export function QuoteImageGenerator({ bookmark, onGenerate, onComplete }: QuoteImageGeneratorProps) {
  const viewRef = useRef<View>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndShare = async () => {
    try {
      setIsGenerating(true);
      onGenerate();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Aguardar um pouco para garantir que a view foi renderizada
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capturar a view como imagem
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
        width: 1080, // Largura ideal para redes sociais
        height: 1350, // Proporção 4:5 (Instagram)
      });

      // Compartilhar diretamente o URI capturado
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Compartilhar Citação",
        });
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo");
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error generating quote image:", error);
      Alert.alert("Erro", "Não foi possível gerar a imagem");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
      onComplete();
    }
  };

  const tagColors = PREDEFINED_TAGS.reduce(
    (acc, tag) => {
      acc[tag.id] = tag.color;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <>
      {/* View invisível para captura */}
      <View
        ref={viewRef}
        style={[
          styles.quoteCard,
          { position: "absolute", left: -9999, top: -9999 },
        ]}
        collapsable={false}
      >
        {/* Gradiente de fundo simulado com cores sólidas */}
        <View style={styles.gradientBg}>
          <View style={styles.gradientTop} />
          <View style={styles.gradientBottom} />
        </View>

        {/* Conteúdo */}
        <View style={styles.quoteContent}>
          {/* Aspas decorativas */}
          <ThemedText style={styles.quoteMarkTop}>"</ThemedText>

          {/* Excerpt */}
          <ThemedText style={styles.quoteText}>
            {bookmark.excerpt}
          </ThemedText>

          {/* Nota pessoal (se houver) */}
          {bookmark.note && (
            <View style={styles.noteContainer}>
              <ThemedText style={styles.noteLabel}>💭 Nota:</ThemedText>
              <ThemedText style={styles.noteText}>{bookmark.note}</ThemedText>
            </View>
          )}

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {bookmark.tags.map((tagId) => {
                const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <View
                    key={tagId}
                    style={[
                      styles.tagChip,
                      { backgroundColor: tagColors[tagId] + "20" },
                    ]}
                  >
                    <ThemedText
                      style={[styles.tagText, { color: tagColors[tagId] }]}
                    >
                      {tag.label}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          )}

          {/* Rodapé */}
          <View style={styles.footer}>
            <View style={styles.divider} />
            <ThemedText style={styles.articleTitle}>
              {bookmark.articleTitle}
            </ThemedText>
            {bookmark.partTitle && (
              <ThemedText style={styles.partTitle}>
                {bookmark.partTitle}
              </ThemedText>
            )}
            <ThemedText style={styles.appName}>
              Siga o Dinheiro
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Indicador de carregamento */}
      {isGenerating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>
            Gerando imagem...
          </ThemedText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  quoteCard: {
    width: 1080,
    height: 1350,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientTop: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: "#764ba2",
  },
  quoteContent: {
    flex: 1,
    padding: 60,
    justifyContent: "center",
  },
  quoteMarkTop: {
    fontSize: 120,
    color: "#fff",
    opacity: 0.3,
    lineHeight: 120,
    marginBottom: -40,
  },
  quoteText: {
    fontSize: 42,
    lineHeight: 58,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "left",
  },
  noteContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderLeftWidth: 4,
    borderLeftColor: "#FFD60A",
    padding: 24,
    borderRadius: 8,
    marginBottom: 40,
  },
  noteLabel: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
  },
  noteText: {
    fontSize: 32,
    lineHeight: 44,
    color: "#fff",
    fontStyle: "italic",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 40,
  },
  tagChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 24,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
  },
  divider: {
    height: 3,
    backgroundColor: "#fff",
    opacity: 0.3,
    marginBottom: 24,
    width: 100,
  },
  articleTitle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
  },
  partTitle: {
    fontSize: 26,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    color: "#fff",
    opacity: 0.6,
    fontWeight: "500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    zIndex: 9999,
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
