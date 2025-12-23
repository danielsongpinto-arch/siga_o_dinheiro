import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemeCard } from "@/components/theme-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useComparison } from "@/hooks/use-comparison";
import { useThemeColor } from "@/hooks/use-theme-color";
import { THEMES } from "@/data/mock-data";
import { Pressable } from "react-native";

export default function ThemesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedArticleIds } = useComparison();
  const tintColor = useThemeColor({}, "tint");

  return (
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
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Temas
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore análises financeiras de diferentes eventos históricos e atuais
        </ThemedText>
      </ThemedView>

      {selectedArticleIds.length > 0 && (
        <WebClickable
          onPress={() => router.push("/compare" as any)}
          style={[styles.compareButton, { backgroundColor: tintColor }]}
        >
          <IconSymbol name="doc.text.magnifyingglass" size={24} color="#fff" />
          <ThemedText style={styles.compareButtonText}>
            Comparar ({selectedArticleIds.length})
          </ThemedText>
        </WebClickable>
      )}

      <ThemedView style={styles.themesList}>
        {THEMES.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            onPress={() => router.push(`/theme/${theme.id}` as any)}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  compareButton: {
    position: "absolute",
    bottom: 32,
    right: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  compareButtonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
  },
  themesList: {
    marginBottom: 16,
  },
});
