import { View, ScrollView, Pressable, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useReadingSettings, FontSize, LineSpacing } from "@/hooks/use-reading-settings";

export default function ReadingSettingsScreen() {
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

  const { settings, setFontSize, setLineSpacing, resetToDefaults } = useReadingSettings();

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "xs", label: "Muito Pequeno" },
    { value: "s", label: "Pequeno" },
    { value: "m", label: "Médio" },
    { value: "l", label: "Grande" },
    { value: "xl", label: "Muito Grande" },
  ];

  const lineSpacings: { value: LineSpacing; label: string }[] = [
    { value: "compact", label: "Compacto" },
    { value: "normal", label: "Normal" },
    { value: "expanded", label: "Expandido" },
  ];

  // Componente wrapper para garantir cliques na web
  const WebClickable = ({ children, onPress, style }: any) => {
    if (Platform.OS === "web") {
      const flatStyle = StyleSheet.flatten(style);
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPress();
          }}
          style={{
            ...flatStyle,
            cursor: "pointer",
            userSelect: "none",
            border: "none",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            pointerEvents: "auto",
            touchAction: "manipulation",
          } as any}
        >
          {children}
        </button>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
        {children}
      </TouchableOpacity>
    );
  };



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
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.tint} />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Configurações de Leitura
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Personalize sua experiência
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
        {/* Tamanho da Fonte */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tamanho da Fonte
          </ThemedText>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {fontSizes.map((item, index) => (
              <WebClickable
                key={item.value}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await setFontSize(item.value);
                }}
                style={[
                  styles.optionItem,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <ThemedText style={styles.optionLabel}>{item.label}</ThemedText>
                {settings.fontSize === item.value && (
                  <IconSymbol name="checkmark" size={20} color={colors.tint} />
                )}
              </WebClickable>
            ))}
          </View>
        </View>

        {/* Espaçamento entre Linhas */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Espaçamento entre Linhas
          </ThemedText>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {lineSpacings.map((item, index) => (
              <WebClickable
                key={item.value}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await setLineSpacing(item.value);
                }}
                style={[
                  styles.optionItem,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <ThemedText style={styles.optionLabel}>{item.label}</ThemedText>
                {settings.lineSpacing === item.value && (
                  <IconSymbol name="checkmark" size={20} color={colors.tint} />
                )}
              </WebClickable>
            ))}
          </View>
        </View>



        {/* Botão Restaurar Padrões */}
        <WebClickable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await resetToDefaults();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={[
            styles.resetButton,
            { borderColor: colors.border },
          ]}
        >
          <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
          <ThemedText style={{ color: colors.tint, fontWeight: "600" }}>
            Restaurar Padrões
          </ThemedText>
        </WebClickable>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionLabel: {
    fontSize: 16,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  modeInfo: {
    flex: 1,
    marginRight: 12,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
