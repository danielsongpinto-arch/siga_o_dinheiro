import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { useFavorites } from "@/hooks/use-favorites";
import { ARTICLES } from "@/data/mock-data";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, loading, isFavorite } = useFavorites();
  const tintColor = useThemeColor({}, "tint");

  const favoriteArticles = ARTICLES.filter((article) => favorites.includes(article.id));

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

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
          Favoritos
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {favoriteArticles.length === 0
            ? "Nenhum artigo favoritado ainda"
            : `${favoriteArticles.length} ${favoriteArticles.length === 1 ? "artigo salvo" : "artigos salvos"}`}
        </ThemedText>
      </ThemedView>

      {favoriteArticles.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            Você ainda não favoritou nenhum artigo.
          </ThemedText>
          <ThemedText style={styles.emptyHint}>
            Toque no ícone de coração em qualquer artigo para salvá-lo aqui.
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.articlesList}>
          {favoriteArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={isFavorite(article.id)}
              onPress={() => router.push(`/article/${article.id}` as any)}
            />
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  articlesList: {
    marginBottom: 16,
  },
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 12,
  },
  emptyHint: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.6,
  },
});
