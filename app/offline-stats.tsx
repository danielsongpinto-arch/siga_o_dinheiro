import { View, ScrollView, Pressable, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOfflineStats } from "@/hooks/use-offline-stats";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function OfflineStatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    cardBg: useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background"),
    border: useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text"),
  };

  const {
    stats,
    loading,
    getTotalTimeFormatted,
    getAverageReadingTime,
    getCacheUsageTrend,
  } = useOfflineStats();

  const trend = getCacheUsageTrend();
  const trendIcon = trend === "up" ? "arrow.up" : trend === "down" ? "arrow.down" : "minus";
  const trendColor = trend === "up" ? "#34C759" : trend === "down" ? "#FF3B30" : colors.icon;

  // Preparar dados para o gráfico
  const chartData = {
    labels: stats.cacheUsageHistory
      .slice(0, 7)
      .reverse()
      .map((h) => {
        const date = new Date(h.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
    datasets: [
      {
        data: stats.cacheUsageHistory
          .slice(0, 7)
          .reverse()
          .map((h) => h.articlesCount),
      },
    ],
  };

  // Garantir que sempre há pelo menos 2 pontos no gráfico
  if (chartData.labels.length < 2) {
    chartData.labels = ["Hoje", "Amanhã"];
    chartData.datasets[0].data = [0, 0];
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <WebClickable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.tint} />
        </WebClickable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Estatísticas Offline
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Seu uso sem internet
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
          </View>
        ) : (
          <>
            {/* Cards de Resumo */}
            <View style={styles.summaryGrid}>
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name="book.fill" size={24} color={colors.tint} />
                <ThemedText style={styles.summaryValue}>{stats.totalReadingsOffline}</ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Leituras Offline
                </ThemedText>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name="clock" size={24} color={colors.tint} />
                <ThemedText style={styles.summaryValue}>{getTotalTimeFormatted()}</ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Tempo Total
                </ThemedText>
              </View>
            </View>

            <View style={styles.summaryGrid}>
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.tint} />
                <ThemedText style={styles.summaryValue}>{getAverageReadingTime()}</ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Tempo Médio
                </ThemedText>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name={trendIcon as any} size={24} color={trendColor} />
                <ThemedText style={[styles.summaryValue, { color: trendColor }]}>
                  {trend === "up" ? "Crescendo" : trend === "down" ? "Caindo" : "Estável"}
                </ThemedText>
                <ThemedText style={[styles.summaryLabel, { color: colors.icon }]}>
                  Tendência
                </ThemedText>
              </View>
            </View>

            {/* Gráfico de Uso do Cache */}
            {stats.cacheUsageHistory.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Uso do Cache (Últimos 7 Dias)
                </ThemedText>
                <View
                  style={[
                    styles.chartCard,
                    { backgroundColor: colors.cardBg, borderColor: colors.border },
                  ]}
                >
                  <LineChart
                    data={chartData}
                    width={screenWidth - 72}
                    height={220}
                    chartConfig={{
                      backgroundColor: colors.cardBg,
                      backgroundGradientFrom: colors.cardBg,
                      backgroundGradientTo: colors.cardBg,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
                      labelColor: (opacity = 1) => colors.icon,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: colors.tint,
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                  <ThemedText style={[styles.chartCaption, { color: colors.icon }]}>
                    Número de artigos em cache por dia
                  </ThemedText>
                </View>
              </View>
            )}

            {/* Top Artigos Lidos Offline */}
            {stats.topArticlesOffline.length > 0 && (
              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Mais Lidos Offline
                </ThemedText>
                {stats.topArticlesOffline.map((article, index) => (
                  <View
                    key={article.articleId}
                    style={[
                      styles.topArticleCard,
                      { backgroundColor: colors.cardBg, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.rankBadge, { backgroundColor: colors.tint }]}>
                      <ThemedText style={styles.rankText}>{index + 1}</ThemedText>
                    </View>
                    <View style={styles.topArticleInfo}>
                      <ThemedText numberOfLines={2} style={styles.topArticleTitle}>
                        {article.title}
                      </ThemedText>
                      <ThemedText style={[styles.topArticleCount, { color: colors.icon }]}>
                        {article.count} {article.count === 1 ? "leitura" : "leituras"}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Estado Vazio */}
            {stats.totalReadingsOffline === 0 && (
              <View style={styles.emptyContainer}>
                <IconSymbol name="wifi.slash" size={48} color={colors.icon} />
                <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                  Nenhuma leitura offline ainda
                </ThemedText>
                <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
                  Baixe artigos e leia sem internet para ver suas estatísticas aqui
                </ThemedText>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartCaption: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  topArticleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  topArticleInfo: {
    flex: 1,
    gap: 4,
  },
  topArticleTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  topArticleCount: {
    fontSize: 12,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
