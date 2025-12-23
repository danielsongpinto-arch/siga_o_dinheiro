import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useFavorites } from "@/hooks/use-favorites";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ARTICLES, THEMES } from "@/data/mock-data";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Filtrar artigos por busca e tema
  const filteredArticles = ARTICLES.filter((article) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTheme = !selectedTheme || article.themeId === selectedTheme;

    return matchesSearch && matchesTheme;
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedTheme(null);
  };

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
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Buscar
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.searchContainer, { backgroundColor: cardBg, borderColor }]}>
        <IconSymbol name="magnifyingglass" size={20} color={textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Buscar artigos..."
          placeholderTextColor={textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <WebClickable onPress={() => setSearchQuery("")}>
            <IconSymbol name="xmark.circle.fill" size={20} color={textSecondary} />
          </WebClickable>
        )}
      </ThemedView>

      <ThemedView style={styles.filtersSection}>
        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
          Filtrar por tema:
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themeFilters}
        >
          <WebClickable
            onPress={() => setSelectedTheme(null)}
            style={[
              styles.themeChip,
              { borderColor },
              !selectedTheme && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
          >
            <ThemedText
              style={[
                styles.themeChipText,
                !selectedTheme && { color: "#fff" },
              ]}
            >
              Todos
            </ThemedText>
          </WebClickable>
          {THEMES.map((theme) => (
            <WebClickable
              key={theme.id}
              onPress={() => setSelectedTheme(theme.id)}
              style={[
                styles.themeChip,
                { borderColor },
                selectedTheme === theme.id && { backgroundColor: tintColor, borderColor: tintColor },
              ]}
            >
              <ThemedText
                style={[
                  styles.themeChipText,
                  selectedTheme === theme.id && { color: "#fff" },
                ]}
              >
                {theme.title}
              </ThemedText>
            </WebClickable>
          ))}
        </ScrollView>
      </ThemedView>

      {(searchQuery.length > 0 || selectedTheme) && (
        <ThemedView style={styles.resultsHeader}>
          <ThemedText style={styles.resultsCount}>
            {filteredArticles.length} {filteredArticles.length === 1 ? "resultado" : "resultados"}
          </ThemedText>
          {(searchQuery.length > 0 || selectedTheme) && (
            <WebClickable onPress={clearSearch}>
              <ThemedText style={[styles.clearButton, { color: tintColor }]}>
                Limpar filtros
              </ThemedText>
            </WebClickable>
          )}
        </ThemedView>
      )}

      <ThemedView style={styles.resultsList}>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={isFavorite(article.id)}
              onPress={() => router.push(`/article/${article.id}` as any)}
            />
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={48} color={textSecondary} />
            <ThemedText style={styles.emptyText}>
              {searchQuery.length > 0
                ? "Nenhum artigo encontrado"
                : "Digite algo para buscar"}
            </ThemedText>
            <ThemedText style={[styles.emptyHint, { color: textSecondary }]}>
              {searchQuery.length > 0
                ? "Tente usar outras palavras-chave"
                : "Busque por título, tema ou conteúdo"}
            </ThemedText>
          </ThemedView>
        )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  filtersSection: {
    marginBottom: 20,
  },
  filterLabel: {
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  themeFilters: {
    gap: 8,
    paddingRight: 16,
  },
  themeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeChipPressed: {
    opacity: 0.7,
  },
  themeChipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  clearButton: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  resultsList: {
    marginBottom: 16,
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
});
