import { useState } from "react";
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
import { useReadingReminders } from "@/hooks/use-reading-reminders";
import { useReadingGoals } from "@/hooks/use-reading-goals";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useReviewReminders } from "@/hooks/use-review-reminders";
import { useAutoTheme } from "@/hooks/use-auto-theme";
import { useOfflineCache } from "@/hooks/use-offline-cache";
import { useDataSaver } from "@/hooks/use-data-saver";
import { useScheduledDownloads } from "@/hooks/use-scheduled-downloads";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
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

  const { preference: themePreference, updatePreference } = useThemePreference();
  const { syncEnabled, isSyncing, lastSyncTime, toggleSync, performSync } = useBookmarkSync();
  const { user, isAuthenticated } = useAuth();
  const { isNightMode, autoModeEnabled, hasManualOverride, toggleAutoMode, setManualMode, clearManualOverride } = useNightMode();
  const { config: remindersConfig, toggleEnabled: toggleReminders, setTime: setReminderTime } = useReadingReminders();
  const { goal, createGoal, deleteGoal } = useReadingGoals();
  const { resetOnboarding } = useOnboarding();
  const { settings: reviewSettings, loading: reviewLoading, enableReminders, disableReminders, updateFrequency, updateIntervals } = useReviewReminders();
  const { autoThemeEnabled, sunTimes, toggleAutoTheme } = useAutoTheme();
  const { cacheIndex, clearCache, getCacheSizeFormatted } = useOfflineCache();
  const { settings: dataSaverSettings, isOnCellular, toggleDataSaver, toggleImages, toggleAudio } = useDataSaver();
  const { scheduledDownloads, cancelScheduledDownload } = useScheduledDownloads();
  const [showTimePicker, setShowTimePicker] = useState(false);

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

        {/* Seção de Notificações */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Lembretes de Leitura
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
            Receba notificações para continuar suas leituras
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            {/* Toggle Ativar Notificações */}
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await toggleReminders();
              }}
              style={({ pressed }) => [
                styles.toggleItem,
                { borderBottomColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.toggleLeft}>
                <IconSymbol name="bell.fill" size={24} color={colors.tint} />
                <View style={styles.toggleText}>
                  <ThemedText type="defaultSemiBold">Ativar Lembretes</ThemedText>
                  <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                    {remindersConfig.enabled
                      ? `Todos os dias às ${remindersConfig.hour.toString().padStart(2, "0")}:${remindersConfig.minute.toString().padStart(2, "0")}`
                      : "Desativado"}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={remindersConfig.enabled}
                onValueChange={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await toggleReminders();
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </Pressable>

            {/* Configurar Horário */}
            {remindersConfig.enabled && (
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.prompt(
                    "Configurar Horário",
                    "Digite o horário no formato HH:MM (ex: 19:00)",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Salvar",
                        onPress: async (text?: string) => {
                          if (text) {
                            const [hourStr, minuteStr] = text.split(":");
                            const hour = parseInt(hourStr, 10);
                            const minute = parseInt(minuteStr, 10);
                            
                            if (
                              !isNaN(hour) &&
                              !isNaN(minute) &&
                              hour >= 0 &&
                              hour <= 23 &&
                              minute >= 0 &&
                              minute <= 59
                            ) {
                              await setReminderTime(hour, minute);
                              await Haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Success
                              );
                            } else {
                              Alert.alert("Erro", "Horário inválido. Use o formato HH:MM (ex: 19:00)");
                            }
                          }
                        },
                      },
                    ],
                    "plain-text",
                    `${remindersConfig.hour.toString().padStart(2, "0")}:${remindersConfig.minute.toString().padStart(2, "0")}`
                  );
                }}
                style={({ pressed }) => [
                  styles.toggleItem,
                  styles.toggleItemLast,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.toggleLeft}>
                  <IconSymbol name="clock.fill" size={24} color="#FF9500" />
                  <View style={styles.toggleText}>
                    <ThemedText type="defaultSemiBold">Horário</ThemedText>
                    <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                      {`${remindersConfig.hour.toString().padStart(2, "0")}:${remindersConfig.minute.toString().padStart(2, "0")}`}
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.icon} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Seção de Lembretes de Revisão */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Lembretes de Revisão
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
            Receba lembretes para revisar seus destaques antigos
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            {/* Toggle Ativar Lembretes de Revisão */}
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (reviewSettings.enabled) {
                  await disableReminders();
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } else {
                  await enableReminders(reviewSettings.frequency);
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
              }}
              style={({ pressed }) => [
                styles.toggleItem,
                { borderBottomColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.toggleLeft}>
                <IconSymbol name="clock.fill" size={24} color="#0284c7" />
                <View style={styles.toggleText}>
                  <ThemedText type="defaultSemiBold">Ativar Lembretes de Revisão</ThemedText>
                  <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                    {reviewSettings.enabled
                      ? `Lembrete ${
                          reviewSettings.frequency === "weekly"
                            ? "semanal"
                            : reviewSettings.frequency === "biweekly"
                              ? "quinzenal"
                              : "mensal"
                        }`
                      : "Desativado"}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={reviewSettings.enabled}
                onValueChange={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (reviewSettings.enabled) {
                    await disableReminders();
                  } else {
                    await enableReminders(reviewSettings.frequency);
                  }
                  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                trackColor={{ false: colors.border, true: "#0284c7" }}
              />
            </Pressable>

            {/* Configurar Frequência */}
            {reviewSettings.enabled && (
              <>
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert(
                      "Frequência dos Lembretes",
                      "Com que frequência deseja receber lembretes?",
                      [
                        {
                          text: "Semanal",
                          onPress: async () => {
                            await updateFrequency("weekly");
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          },
                        },
                        {
                          text: "Quinzenal",
                          onPress: async () => {
                            await updateFrequency("biweekly");
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          },
                        },
                        {
                          text: "Mensal",
                          onPress: async () => {
                            await updateFrequency("monthly");
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          },
                        },
                        { text: "Cancelar", style: "cancel" },
                      ]
                    );
                  }}
                  style={({ pressed }) => [
                    styles.toggleItem,
                    { borderBottomColor: colors.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.toggleLeft}>
                    <IconSymbol name="calendar" size={24} color={colors.icon} />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold">Frequência</ThemedText>
                      <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                        {reviewSettings.frequency === "weekly"
                          ? "Semanal"
                          : reviewSettings.frequency === "biweekly"
                            ? "Quinzenal"
                            : "Mensal"}
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </Pressable>

                {/* Configurar Intervalos */}
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    
                    const availableIntervals = [30, 60, 90, 120];
                    const currentIntervals = reviewSettings.intervals;
                    
                    Alert.alert(
                      "Intervalos de Revisão",
                      "Selecione os intervalos para receber lembretes (pode escolher múltiplos)",
                      [
                        ...availableIntervals.map((interval) => ({
                          text: `${interval} dias ${currentIntervals.includes(interval) ? "✓" : ""}`,
                          onPress: async () => {
                            let newIntervals: number[];
                            if (currentIntervals.includes(interval)) {
                              // Remover intervalo
                              newIntervals = currentIntervals.filter((i) => i !== interval);
                              // Garantir que sempre tenha pelo menos um intervalo
                              if (newIntervals.length === 0) {
                                Alert.alert("Erro", "Você precisa ter pelo menos um intervalo ativo");
                                return;
                              }
                            } else {
                              // Adicionar intervalo
                              newIntervals = [...currentIntervals, interval].sort((a, b) => a - b);
                            }
                            await updateIntervals(newIntervals);
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          },
                        })),
                        { text: "Fechar", style: "cancel" },
                      ]
                    );
                  }}
                  style={({ pressed }) => [
                    styles.toggleItem,
                    styles.toggleItemLast,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.toggleLeft}>
                    <IconSymbol name="clock.fill" size={24} color={colors.icon} />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold">Intervalos</ThemedText>
                      <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                        {reviewSettings.intervals.join(", ")} dias
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Seção de Metas */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Metas de Leitura
          </ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: colors.icon }]}>
            Defina metas para manter sua constância
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
            {goal ? (
              <>
                <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.toggleLeft}>
                    <IconSymbol name="target" size={24} color={colors.tint} />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold">
                        Meta {goal.type === "weekly" ? "Semanal" : "Mensal"}
                      </ThemedText>
                      <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                        {goal.current} de {goal.target} artigos
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert(
                      "Excluir Meta",
                      "Tem certeza que deseja excluir esta meta?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: async () => {
                            await deleteGoal();
                            await Haptics.notificationAsync(
                              Haptics.NotificationFeedbackType.Success
                            );
                          },
                        },
                      ]
                    );
                  }}
                  style={({ pressed }) => [
                    styles.toggleItem,
                    styles.toggleItemLast,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.toggleLeft}>
                    <IconSymbol name="trash.fill" size={24} color="#FF3B30" />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold" style={{ color: "#FF3B30" }}>
                        Excluir Meta
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.icon} />
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    "Criar Meta",
                    "Escolha o tipo de meta e a quantidade de artigos:",
                    [
                      {
                        text: "Semanal (7 artigos)",
                        onPress: async () => {
                          await createGoal("weekly", 7);
                          await Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success
                          );
                        },
                      },
                      {
                        text: "Mensal (30 artigos)",
                        onPress: async () => {
                          await createGoal("monthly", 30);
                          await Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success
                          );
                        },
                      },
                      { text: "Cancelar", style: "cancel" },
                    ]
                  );
                }}
                style={({ pressed }) => [
                  styles.toggleItem,
                  styles.toggleItemLast,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.toggleLeft}>
                  <IconSymbol name="plus.circle.fill" size={24} color={colors.tint} />
                  <View style={styles.toggleText}>
                    <ThemedText type="defaultSemiBold">Criar Nova Meta</ThemedText>
                    <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                      Defina uma meta semanal ou mensal
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.icon} />
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
              const isSelected = themePreference === option.value;
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

          {/* Tema Automático por Nascer/Pôr do Sol */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, marginTop: 16, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold">Tema Automático (Nascer/Pôr do Sol)</ThemedText>
                <ThemedText style={[styles.settingDescription, { color: colors.icon }]}>
                  Alterna automaticamente entre claro e escuro baseado no horário do nascer e pôr do sol da sua localização
                </ThemedText>
                {autoThemeEnabled && sunTimes && (
                  <ThemedText style={[styles.sunTimesInfo, { color: colors.tint }]}>
                    Nascer: {sunTimes.sunrise.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} | Pôr: {sunTimes.sunset.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </ThemedText>
                )}
              </View>
              <Switch
                value={autoThemeEnabled}
                onValueChange={async (value) => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleAutoTheme(value);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Gerenciamento de Cache Offline */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Modo Offline
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold">Cache de Artigos</ThemedText>
                <ThemedText style={[styles.settingDescription, { color: colors.icon }]}>
                  Artigos visualizados são salvos automaticamente para leitura offline.
                </ThemedText>
                <ThemedText style={[styles.sunTimesInfo, { color: colors.tint }]}>
                  {cacheIndex.articleIds.length} artigos em cache ({getCacheSizeFormatted()})
                </ThemedText>
              </View>
            </View>

            <View style={[styles.toggleItem, { borderTopColor: colors.border }]}>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    "Limpar Cache",
                    "Deseja remover todos os artigos salvos offline? Esta ação não pode ser desfeita.",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Limpar",
                        style: "destructive",
                        onPress: async () => {
                          await clearCache();
                          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        },
                      },
                    ]
                  );
                }}
                style={({ pressed }) => [
                  styles.toggleLeft,
                  pressed && styles.pressed,
                ]}
              >
                <IconSymbol name="trash.fill" size={20} color="#FF3B30" />
                <View style={styles.toggleText}>
                  <ThemedText type="defaultSemiBold" style={{ color: "#FF3B30" }}>
                    Limpar Cache
                  </ThemedText>
                  <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                    Remover todos os artigos salvos
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Economia de Dados */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Economia de Dados
          </ThemedText>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.toggleItem}>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await toggleDataSaver();
                }}
                style={({ pressed }) => [
                  styles.toggleLeft,
                  pressed && styles.pressed,
                ]}
              >
                <IconSymbol name="antenna.radiowaves.left.and.right" size={20} color={colors.icon} />
                <View style={styles.toggleText}>
                  <ThemedText type="defaultSemiBold">Modo Economia</ThemedText>
                  <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                    Reduzir consumo de dados móveis
                  </ThemedText>
                  {isOnCellular && (
                    <ThemedText style={[styles.sunTimesInfo, { color: colors.tint }]}>
                      Conexão: Dados Móveis
                    </ThemedText>
                  )}
                  {!isOnCellular && (
                    <ThemedText style={[styles.sunTimesInfo, { color: "#34C759" }]}>
                      Conexão: Wi-Fi
                    </ThemedText>
                  )}
                </View>
              </Pressable>
              <Switch
                value={dataSaverSettings.enabled}
                onValueChange={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await toggleDataSaver();
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </View>

            {dataSaverSettings.enabled && (
              <>
                <View style={[styles.toggleItem, { borderTopColor: colors.border }]}>
                  <Pressable
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await toggleImages();
                    }}
                    style={({ pressed }) => [
                      styles.toggleLeft,
                      pressed && styles.pressed,
                    ]}
                  >
                    <IconSymbol name="photo" size={20} color={colors.icon} />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold">Desabilitar Imagens</ThemedText>
                      <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                        Não carregar imagens automaticamente em dados móveis
                      </ThemedText>
                    </View>
                  </Pressable>
                  <Switch
                    value={dataSaverSettings.disableImages}
                    onValueChange={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await toggleImages();
                    }}
                    trackColor={{ false: colors.border, true: colors.tint }}
                  />
                </View>

                <View style={[styles.toggleItem, { borderTopColor: colors.border }]}>
                  <Pressable
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await toggleAudio();
                    }}
                    style={({ pressed }) => [
                      styles.toggleLeft,
                      pressed && styles.pressed,
                    ]}
                  >
                    <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.icon} />
                    <View style={styles.toggleText}>
                      <ThemedText type="defaultSemiBold">Desabilitar Áudios</ThemedText>
                      <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                        Não carregar áudios automaticamente em dados móveis
                      </ThemedText>
                    </View>
                  </Pressable>
                  <Switch
                    value={dataSaverSettings.disableAudio}
                    onValueChange={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await toggleAudio();
                    }}
                    trackColor={{ false: colors.border, true: colors.tint }}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Downloads Agendados */}
        {scheduledDownloads.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Downloads Agendados
            </ThemedText>

            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              {scheduledDownloads.map((download, index) => {
                const scheduledDate = new Date(download.scheduledTime);
                const formattedDate = scheduledDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <View
                    key={download.id}
                    style={[
                      styles.toggleItem,
                      index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                    ]}
                  >
                    <View style={styles.toggleLeft}>
                      <IconSymbol name="clock" size={20} color={colors.icon} />
                      <View style={styles.toggleText}>
                        <ThemedText type="defaultSemiBold">{download.themeName}</ThemedText>
                        <ThemedText style={[styles.toggleDescription, { color: colors.icon }]}>
                          {formattedDate}
                        </ThemedText>
                        {download.wifiOnly && (
                          <ThemedText style={[styles.sunTimesInfo, { color: colors.tint }]}>
                            Apenas Wi-Fi
                          </ThemedText>
                        )}
                      </View>
                    </View>
                    <Pressable
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        Alert.alert(
                          "Cancelar Download",
                          `Deseja cancelar o download de "${download.themeName}"?`,
                          [
                            { text: "Não", style: "cancel" },
                            {
                              text: "Sim",
                              style: "destructive",
                              onPress: () => cancelScheduledDownload(download.id),
                            },
                          ]
                        );
                      }}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <IconSymbol name="trash" size={20} color="#FF3B30" />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}

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

          {/* Botão Rever Tour */}
          <Pressable
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                "Rever Tour",
                "Deseja rever o tour de boas-vindas?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
                  {
                    text: "Rever",
                    onPress: async () => {
                      await resetOnboarding();
                      router.push("/onboarding");
                    },
                  },
                ]
              );
            }}
            style={({ pressed }) => [
              styles.reviewTourButton,
              { backgroundColor: colors.cardBg, borderColor: colors.tint },
              pressed && styles.pressed,
            ]}
          >
            <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
            <ThemedText style={{ color: colors.tint, fontWeight: "600" }}>
              Rever Tour de Boas-Vindas
            </ThemedText>
          </Pressable>
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
  reviewTourButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sunTimesInfo: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
  },
});
