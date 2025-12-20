import { useRef } from "react";
import { StyleSheet, View, Alert, Share as RNShare, Platform } from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ShareQuoteCardProps {
  quote: string;
  articleTitle: string;
  onShare?: () => void;
}

export function ShareQuoteCard({ quote, articleTitle, onShare }: ShareQuoteCardProps) {
  const viewShotRef = useRef<ViewShot>(null);
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");

  const captureAndShare = async () => {
    try {
      if (!viewShotRef.current) return;

      // Capturar a view como imagem
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;

      if (Platform.OS === "web") {
        // No web, usar Share API nativa se disponível
        if (navigator.share) {
          await navigator.share({
            title: articleTitle,
            text: quote,
          });
        } else {
          Alert.alert("Compartilhar", "Compartilhamento não suportado no navegador");
        }
      } else {
        // No mobile, compartilhar a imagem
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Compartilhar citação",
          });
        } else {
          // Fallback para Share API nativa
          await RNShare.share({
            url: uri,
            message: `"${quote}"\n\n${articleTitle}\n\nSiga o Dinheiro`,
          });
        }
      }

      onShare?.();
    } catch (error) {
      console.error("Error sharing quote:", error);
      Alert.alert("Erro", "Não foi possível compartilhar a citação");
    }
  };

  return (
    <ViewShot
      ref={viewShotRef}
      options={{
        format: "png",
        quality: 1.0,
      }}
      style={styles.container}
    >
      <ThemedView style={[styles.card, { backgroundColor: tintColor }]}>
        <View style={styles.quoteContainer}>
          <ThemedText style={styles.quoteText}>"{quote}"</ThemedText>
        </View>
        <View style={styles.footer}>
          <ThemedText style={styles.articleTitle}>{articleTitle}</ThemedText>
          <ThemedText style={styles.appName}>Siga o Dinheiro</ThemedText>
        </View>
      </ThemedView>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    padding: 32,
    borderRadius: 16,
    minHeight: 300,
    justifyContent: "space-between",
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#fff",
    fontWeight: "600",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  articleTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 4,
  },
  appName: {
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
    fontWeight: "bold",
  },
});
