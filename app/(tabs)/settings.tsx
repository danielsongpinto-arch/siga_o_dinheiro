import { View, ScrollView, Pressable, StyleSheet, Switch, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useThemePreference, ThemePreference } from "@/hooks/use-theme-preference";
import { useBookmarkSync } from "@/hooks/use-bookmark-sync";
import { useAuth } from "@/hooks/use-auth";
import { useNightMode } from "@/hooks/use-night-mode";

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
  const { isAuthenticated } = useAuth();
  const { syncEnabled, isSyncing, lastSyncTime, toggleSync, performSync } = useBookmarkSync();
  const { isNightMode, autoModeEnabled, hasManualOverride, toggleAutoMode, setManualMode, clearManualOverride } = useNightMode();

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

        {/* Seção de Sincronização */}
        {isAuthenticated && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sincronização
            </ThemedText>
            <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
              Mantenha seus destaques sincronizados entre dispositivos
            </ThemedText>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  await toggleSync();
                }}
                style={[styles.syncOption, { borderBottomColor: colors.border }]}
              >
                <View style={styles.syncOptionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.tint + "20" }]}>
                    <IconSymbol name="arrow.triangle.2.circlepath" size={24} color={colors.tint} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <ThemedText type="defaultSemiBold">Sincronizar Destaques</ThemedText>
                    <ThemedText style={[styles.optionDescription, { color: colors.icon }]}>
                      {syncEnabled ? "Ativado" : "Desativado"}
                    </ThemedText>
                  </View>
                </View>
                <Switch
                  value={syncEnabled}
                  onValueChange={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    await toggleSync();
                  }}
                  trackColor={{ false: colors.border, true: colors.tint }}
                  thumbColor="#fff"
                />
              </Pressable>

              {syncEnabled && (
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    const result = await performSync();
                    if (result.success) {
                      Alert.alert("Sucesso", result.message);
                    } else {
                      Alert.alert("Erro", result.message);
                    }
                  }}
                  disabled={isSyncing}
                  style={styles.syncButton}
                >
                  <IconSymbol
                    name="arrow.clockwise"
                    size={20}
                    color={isSyncing ? colors.icon : colors.tint}
                  />
                  <ThemedText
                    type="defaultSemiBold"
                    style={[styles.syncButtonText, { color: isSyncing ? colors.icon : colors.tint }]}
                  >
                    {isSyncing ? "Sincronizando..." : "Sincronizar Agora"}
                  </ThemedText>
                </Pressable>
              )}

              {syncEnabled && lastSyncTime && (
                <View style={styles.lastSyncContainer}>
                  <ThemedText style={[styles.lastSyncText, { color: colors.icon }]}>
                    Última sincronização:{" "}
                    {lastSyncTime.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Seção de Modo Noturno */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Modo Leitura Noturna
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
            Reduz luz azul após 20h para leitura confortável
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            {/* Toggle Automático */}
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await toggleAutoMode();
              }}
              style={({ pressed }) => [
                styles.toggleItem,
                { borderBottomColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.toggleLeft}>
                <IconSymbol name="moon.stars.fill" size={24} color={colors.tint} />
                <View style={styles.toggleText}>
                  <ThemedText type="defaultSemiBold">Modo Automático</ThemedText>
                  <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                    Ativa entre 20h e 7h
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={autoModeEnabled}
                onValueChange={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await toggleAutoMode();
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </Pressable>

            {/* Override Manual */}
            {autoModeEnabled && (
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (hasManualOverride) {
                    await clearManualOverride();
                  } else {
                    await setManualMode(!isNightMode);
                  }
                }}
                style={({ pressed }) => [
                  styles.toggleItem,
                  styles.toggleItemLast,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.toggleLeft}>
                  <IconSymbol name="hand.raised.fill" size={24} color="#FF9500" />
                  <View style={styles.toggleText}>
                    <ThemedText type="defaultSemiBold">Forçar Agora</ThemedText>
                    <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                      {hasManualOverride
                        ? `Modo ${isNightMode ? "noturno" : "normal"} forçado`
                        : "Sobrescrever automático"}
                    </ThemedText>
                  </View>
                </View>
                <Switch
                  value={hasManualOverride}
                  onValueChange={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (hasManualOverride) {
                      await clearManualOverride();
                    } else {
                      await setManualMode(!isNightMode);
                    }
                  }}
                  trackColor={{ false: colors.border, true: "#FF9500" }}
                />
              </Pressable>
            )}
          </View>
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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
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
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  syncOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  syncOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  syncButtonText: {
    fontSize: 16,
  },
  lastSyncContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  lastSyncText: {
    fontSize: 12,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  toggleItemLast: {
    borderBottomWidth: 0,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.6,
  },
});
