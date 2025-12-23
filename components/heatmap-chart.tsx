import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "./themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { type HeatmapData } from "@/hooks/use-reading-patterns";

interface HeatmapChartProps {
  data: HeatmapData[];
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS_LABELS = ["0h", "6h", "12h", "18h", "24h"];

export function HeatmapChart({ data }: HeatmapChartProps) {
  const colors = {
    text: useThemeColor({}, "text"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
  };

  // Encontrar valor máximo para normalizar cores
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Função para obter cor baseada na intensidade
  const getColor = (count: number): string => {
    if (count === 0) return colors.border;
    
    const intensity = count / maxCount;
    
    // Escala de azul: claro → escuro
    if (intensity < 0.2) return "#E3F2FD"; // Muito claro
    if (intensity < 0.4) return "#90CAF9"; // Claro
    if (intensity < 0.6) return "#42A5F5"; // Médio
    if (intensity < 0.8) return "#1E88E5"; // Escuro
    return "#1565C0"; // Muito escuro
  };

  // Agrupar dados por dia
  const dataByDay: { [day: number]: HeatmapData[] } = {};
  data.forEach((cell) => {
    if (!dataByDay[cell.day]) {
      dataByDay[cell.day] = [];
    }
    dataByDay[cell.day].push(cell);
  });

  return (
    <View style={styles.container}>
      {/* Labels de horas (topo) */}
      <View style={styles.hoursRow}>
        <View style={styles.dayLabelSpace} />
        {HOURS_LABELS.map((label, index) => (
          <View
            key={label}
            style={[
              styles.hourLabel,
              { left: `${(index / (HOURS_LABELS.length - 1)) * 100}%` as any },
            ]}
          >
            <ThemedText style={[styles.labelText, { color: colors.icon }]}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Grid do heatmap */}
      {DAYS.map((dayLabel, dayIndex) => (
        <View key={dayLabel} style={styles.row}>
          {/* Label do dia */}
          <View style={styles.dayLabel}>
            <ThemedText style={[styles.labelText, { color: colors.icon }]}>
              {dayLabel}
            </ThemedText>
          </View>

          {/* Células de horas */}
          <View style={styles.cellsRow}>
            {dataByDay[dayIndex]?.map((cell) => (
              <Pressable
                key={`${cell.day}-${cell.hour}`}
                style={[
                  styles.cell,
                  { backgroundColor: getColor(cell.count) },
                ]}
                onPress={() => {
                  if (cell.count > 0) {
                    // Feedback visual ao tocar
                  }
                }}
              >
                {/* Tooltip poderia ser adicionado aqui */}
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Legenda */}
      <View style={styles.legend}>
        <ThemedText style={[styles.legendText, { color: colors.icon }]}>
          Menos
        </ThemedText>
        <View style={styles.legendColors}>
          <View style={[styles.legendCell, { backgroundColor: colors.border }]} />
          <View style={[styles.legendCell, { backgroundColor: "#E3F2FD" }]} />
          <View style={[styles.legendCell, { backgroundColor: "#90CAF9" }]} />
          <View style={[styles.legendCell, { backgroundColor: "#42A5F5" }]} />
          <View style={[styles.legendCell, { backgroundColor: "#1E88E5" }]} />
          <View style={[styles.legendCell, { backgroundColor: "#1565C0" }]} />
        </View>
        <ThemedText style={[styles.legendText, { color: colors.icon }]}>
          Mais
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  hoursRow: {
    flexDirection: "row",
    position: "relative",
    height: 20,
    marginBottom: 8,
  },
  dayLabelSpace: {
    width: 40,
  },
  hourLabel: {
    position: "absolute",
    transform: [{ translateX: -10 }],
  },
  labelText: {
    fontSize: 11,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dayLabel: {
    width: 40,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  cellsRow: {
    flex: 1,
    flexDirection: "row",
    gap: 2,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  legendText: {
    fontSize: 11,
  },
  legendColors: {
    flexDirection: "row",
    gap: 4,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
