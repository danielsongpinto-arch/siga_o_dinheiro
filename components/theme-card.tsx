import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Theme } from "@/types";

interface ThemeCardProps {
  theme: Theme;
  onPress: () => void;
}

export function ThemeCard({ theme, onPress }: ThemeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <ThemedView style={styles.card}>
        <LinearGradient
          colors={["rgba(212, 175, 55, 0.2)", "rgba(212, 175, 55, 0.05)"]}
          style={styles.gradient}
        >
          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              {theme.title}
            </ThemedText>
            <ThemedText style={styles.description} numberOfLines={2}>
              {theme.description}
            </ThemedText>
            <ThemedView style={styles.footer}>
              <ThemedText style={styles.articleCount}>
                {theme.articleCount} {theme.articleCount === 1 ? "artigo" : "artigos"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </LinearGradient>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 180,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  footer: {
    marginTop: 8,
  },
  articleCount: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});
