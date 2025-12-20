import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SeriesCard } from "@/components/series-card";
import { useSeriesProgress } from "@/hooks/use-series-progress";
import { SERIES } from "@/data/series-data";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SeriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getProgressPercentage, isSeriesCompleted } = useSeriesProgress();
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Séries Temáticas",
          headerStyle: {
            backgroundColor: tintColor,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Séries Temáticas</ThemedText>
          <ThemedText style={styles.subtitle}>
            Explore análises financeiras organizadas em séries sequenciais. Complete todas as
            partes para desbloquear badges especiais.
          </ThemedText>
        </ThemedView>

        {SERIES.map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            progress={getProgressPercentage(series.id)}
            isCompleted={isSeriesCompleted(series.id)}
            onPress={() => router.push(`/series/${series.id}` as any)}
          />
        ))}
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
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    marginTop: 8,
  },
});
