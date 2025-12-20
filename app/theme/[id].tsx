import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ArticleCard } from "@/components/article-card";
import { useFavorites } from "@/hooks/use-favorites";
import { ARTICLES, THEMES } from "@/data/mock-data";

export default function ThemeArticlesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();

  const theme = THEMES.find((t) => t.id === id);
  const articles = ARTICLES.filter((a) => a.themeId === id);

  if (!theme) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Tema não encontrado</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: theme.title,
          headerBackTitle: "Temas",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.description}>
            {theme.description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.articlesList}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={isFavorite(article.id)}
              onPress={() => router.push(`/article/${article.id}` as any)}
            />
          ))}
        </ThemedView>

        {articles.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              Nenhum artigo disponível neste tema ainda.
            </ThemedText>
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
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
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.6,
  },
});
