import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useThemePreference, ThemePreference } from "@/hooks/use-theme-preference";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
    cardBg: useThemeColor({ light: "#F9F9F9", dark: "#1C1C1E" }, "background"),
  };

  const { preference, updatePreference } = useThemePreference();

  const themeOptions: { value: ThemePreference; label: string; icon: string; description: string }[] =
    [
      {
        value: "light",
        label: "Claro",
        icon: "sun.max.fill",
        description: "Sempre modo claro",
      },
      {
        value: "dark",
        label: "Escuro",
        icon: "moon.fill",
        description: "Sempre modo escuro",
      },
      {
        value: "auto",
        label: "Automático",
        icon: "circle.lefthalf.filled",
        description: "Seguir sistema",
      },
    ];

  const handleThemeChange = async (newTheme: ThemePreference) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updatePreference(newTheme);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 40,
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Configurações
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Personalize sua experiência
          </ThemedText>
        </View>

        {/* Seção de Tema */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Aparência
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
            Escolha o tema que melhor se adapta à sua visão
          </ThemedText>

          <View style={[styles.optionsContainer, { backgroundColor: colors.cardBg }]}>
            {themeOptions.map((option, index) => {
              const isSelected = preference === option.value;
              const isFirst = index === 0;
              const isLast = index === themeOptions.length - 1;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleThemeChange(option.value)}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    isFirst && styles.optionFirst,
                    isLast && styles.optionLast,
                  ]}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: isSelected
                            ? colors.tint + "20"
                            : colors.border,
                        },
                      ]}
                    >
                      <IconSymbol
                        name={option.icon as any}
                        size={24}
                        color={isSelected ? colors.tint : colors.icon}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={[
                          styles.optionLabel,
                          isSelected && { color: colors.tint },
                        ]}
                      >
                        {option.label}
                      </ThemedText>
                      <ThemedText style={[styles.optionDescription, { color: colors.icon }]}>
                        {option.description}
                      </ThemedText>
                    </View>
                  </View>

                  {isSelected && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.tint} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Informações do App */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Sobre
          </ThemedText>

          <View style={[styles.infoCard, { backgroundColor: colors.cardBg }]}>
            <View style={styles.infoRow}>
              <ThemedText style={{ color: colors.icon }}>Versão</ThemedText>
              <ThemedText type="defaultSemiBold">1.0.0</ThemedText>
            </View>
            <View style={[styles.infoRow, { borderTopColor: colors.border }]}>
              <ThemedText style={{ color: colors.icon }}>Artigos</ThemedText>
              <ThemedText type="defaultSemiBold">6 séries</ThemedText>
            </View>
            <View style={[styles.infoRow, { borderTopColor: colors.border }]}>
              <ThemedText style={{ color: colors.icon }}>Conteúdo</ThemedText>
              <ThemedText type="defaultSemiBold">~50.000 palavras</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 34,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  optionsContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  optionFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
  },
});
