import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  maxValue?: number;
}

export function BarChart({ data, maxValue }: BarChartProps) {
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <ThemedView style={styles.container}>
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        const barColor = item.color || tintColor;

        return (
          <ThemedView key={index} style={styles.barContainer}>
            <ThemedView style={styles.labelContainer}>
              <ThemedText style={styles.label} numberOfLines={1}>
                {item.label}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.value}>
                {item.value}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.barTrack, { backgroundColor: borderColor }]}>
              <ThemedView
                style={[
                  styles.barFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  barContainer: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
