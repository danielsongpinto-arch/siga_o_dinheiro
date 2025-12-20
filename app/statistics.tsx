import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BarChart } from "@/components/bar-chart";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useReadingHistory } from "@/hooks/use-reading-history";
import { ARTICLES, THEMES } from "@/data/mock-data";

export default function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useReadingHistory();

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Calcular estatísticas
  const totalArticlesRead = history.length;
  const totalReadingTime = history.reduce((acc, h) => acc + (h.readingTime || 0), 0);
  const averageReadingTime = totalArticlesRead > 0 ? Math.round(totalReadingTime / totalArticlesRead) : 0;

  // Artigos por tema
  const themeColors: Record<string, string> = {
    ww2: "#8B4513",
    master: "#DC143C",
    covid19: "#4169E1",
    crise2008: "#FF8C00",
    privatizacoes: "#32CD32",
    farma: "#9370DB",
  };

  const articlesByTheme = THEMES.map((theme) => {
    const count = history.filter((h) => {
      const article = ARTICLES.find((a) => a.id === h.articleId);
      return article?.themeId === theme.id;
    }).length;

    return {
      label: theme.title,
      value: count,
      color: themeColors[theme.id] || tintColor,
    };
  }).filter((item) => item.value > 0);

  // Evolução mensal (últimos 6 meses)
  const monthlyData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthDate.toLocaleDateString("pt-BR", { month: "short" });
    const count = history.filter((h) => {
      const readDate = new Date(h.readAt);
      return (
        readDate.getMonth() === monthDate.getMonth() &&
        readDate.getFullYear() === monthDate.getFullYear()
      );
    }).length;

    monthlyData.push({
      label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      value: count,
    });
  }

  // Top 3 temas mais lidos
  const topThemes = [...articlesByTheme]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Estatísticas",
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
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Suas Estatísticas de Leitura
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Acompanhe seu progresso e hábitos de leitura
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsGrid}>
          <ThemedView style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              {totalArticlesRead}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Artigos Lidos</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              {Math.round(totalReadingTime / 60)}h
            </ThemedText>
            <ThemedText style={styles.statLabel}>Tempo Total</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              {averageReadingTime}min
            </ThemedText>
            <ThemedText style={styles.statLabel}>Média/Artigo</ThemedText>
          </ThemedView>
        </ThemedView>

        {topThemes.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Temas Favoritos
            </ThemedText>
            <ThemedView style={[styles.chartCard, { backgroundColor: cardBg, borderColor }]}>
              {topThemes.map((theme, index) => (
                <ThemedView key={index} style={styles.topThemeItem}>
                  <ThemedView style={styles.topThemeRank}>
                    <ThemedText type="defaultSemiBold" style={[styles.rankNumber, { color: tintColor }]}>
                      {index + 1}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.topThemeInfo}>
                    <ThemedText type="defaultSemiBold">{theme.label}</ThemedText>
                    <ThemedText style={[styles.topThemeCount, { color: textSecondary }]}>
                      {theme.value} {theme.value === 1 ? "artigo" : "artigos"}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView
                    style={[styles.themeBadge, { backgroundColor: theme.color }]}
                  />
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {articlesByTheme.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Artigos por Tema
            </ThemedText>
            <ThemedView style={[styles.chartCard, { backgroundColor: cardBg, borderColor }]}>
              <BarChart data={articlesByTheme} />
            </ThemedView>
          </ThemedView>
        )}

        {monthlyData.some((d) => d.value > 0) && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Evolução Mensal
            </ThemedText>
            <ThemedView style={[styles.chartCard, { backgroundColor: cardBg, borderColor }]}>
              <BarChart data={monthlyData} />
            </ThemedView>
          </ThemedView>
        )}

        {totalArticlesRead === 0 && (
          <ThemedView style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText style={styles.emptyText}>
              Comece a ler artigos para ver suas estatísticas!
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
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  chartCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  topThemeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  topThemeRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(212, 175, 55, 0.1)",
  },
  rankNumber: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "bold",
  },
  topThemeInfo: {
    flex: 1,
  },
  topThemeCount: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  themeBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.7,
  },
});
