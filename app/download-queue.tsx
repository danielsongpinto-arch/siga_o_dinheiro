import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOfflineCache, DownloadProgress } from "@/hooks/use-offline-cache";

export default function DownloadQueueScreen() {
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

  const { downloadProgress } = useOfflineCache();
  const [selectedPriority, setSelectedPriority] = useState<Record<string, number>>({});

  const downloads = Object.values(downloadProgress);
  const activeDownloads = downloads.filter((d) => d.status === "downloading" || d.status === "paused" || d.status === "queued");
  const completedDownloads = downloads.filter((d) => d.status === "completed");
  const failedDownloads = downloads.filter((d) => d.status === "error");

  // Ordenar por prioridade (maior primeiro) e depois por data de início
  const sortedActive = [...activeDownloads].sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return (a.startedAt || 0) - (b.startedAt || 0);
  });

  const getStatusIcon = (status: DownloadProgress["status"]) => {
    switch (status) {
      case "downloading":
        return "arrow.down.circle.fill";
      case "paused":
        return "pause.circle.fill";
      case "queued":
        return "clock";
      case "completed":
        return "checkmark.circle.fill";
      case "error":
        return "xmark.circle.fill";
    }
  };

  const getStatusColor = (status: DownloadProgress["status"]) => {
    switch (status) {
      case "downloading":
        return colors.tint;
      case "paused":
        return "#FF9500";
      case "queued":
        return colors.icon;
      case "completed":
        return "#34C759";
      case "error":
        return "#FF3B30";
    }
  };

  const getStatusLabel = (status: DownloadProgress["status"]) => {
    switch (status) {
      case "downloading":
        return "Baixando";
      case "paused":
        return "Pausado";
      case "queued":
        return "Na fila";
      case "completed":
        return "Concluído";
      case "error":
        return "Erro";
    }
  };

  const handlePauseResume = (download: DownloadProgress) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implementar pausa/retomada
    Alert.alert("Em Desenvolvimento", "Funcionalidade de pausa/retomada será implementada em breve");
  };

  const handleCancel = (download: DownloadProgress) => {
    Alert.alert(
      "Cancelar Download",
      `Deseja cancelar o download de "${download.articleTitle}"?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // TODO: Implementar cancelamento
          },
        },
      ]
    );
  };

  const handleChangePriority = (download: DownloadProgress, newPriority: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPriority({ ...selectedPriority, [download.articleId]: newPriority });
    // TODO: Implementar mudança de prioridade
  };

  const handleClearCompleted = () => {
    Alert.alert(
      "Limpar Concluídos",
      "Deseja remover todos os downloads concluídos do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // TODO: Implementar limpeza
          },
        },
      ]
    );
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
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
            Fila de Downloads
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            {activeDownloads.length} ativos • {completedDownloads.length} concluídos
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
        {/* Downloads Ativos */}
        {sortedActive.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Ativos
            </ThemedText>
            {sortedActive.map((download) => (
              <View
                key={download.articleId}
                style={[
                  styles.downloadCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <View style={styles.downloadHeader}>
                  <View style={styles.downloadInfo}>
                    <IconSymbol
                      name={getStatusIcon(download.status) as any}
                      size={20}
                      color={getStatusColor(download.status)}
                    />
                    <View style={styles.downloadTitleContainer}>
                      <ThemedText type="defaultSemiBold" numberOfLines={1}>
                        {download.articleTitle || "Artigo"}
                      </ThemedText>
                      <ThemedText style={[styles.downloadStatus, { color: getStatusColor(download.status) }]}>
                        {getStatusLabel(download.status)} • Prioridade {download.priority}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.downloadActions}>
                    {download.status === "downloading" && (
                      <Pressable
                        onPress={() => handlePauseResume(download)}
                        style={styles.actionButton}
                      >
                        <IconSymbol name="pause" size={20} color={colors.icon} />
                      </Pressable>
                    )}
                    {download.status === "paused" && (
                      <Pressable
                        onPress={() => handlePauseResume(download)}
                        style={styles.actionButton}
                      >
                        <IconSymbol name="play" size={20} color={colors.icon} />
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => handleCancel(download)}
                      style={styles.actionButton}
                    >
                      <IconSymbol name="xmark" size={20} color="#FF3B30" />
                    </Pressable>
                  </View>
                </View>

                {/* Barra de Progresso */}
                {download.status === "downloading" && (
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: colors.tint,
                            width: `${download.progress}%`,
                          },
                        ]}
                      />
                    </View>
                    <ThemedText style={[styles.progressText, { color: colors.icon }]}>
                      {download.progress}%
                    </ThemedText>
                  </View>
                )}

                {/* Seletor de Prioridade */}
                <View style={styles.prioritySelector}>
                  <ThemedText style={[styles.priorityLabel, { color: colors.icon }]}>
                    Prioridade:
                  </ThemedText>
                  <View style={styles.priorityButtons}>
                    {[1, 2, 3, 4, 5].map((priority) => (
                      <Pressable
                        key={priority}
                        onPress={() => handleChangePriority(download, priority)}
                        style={[
                          styles.priorityButton,
                          {
                            backgroundColor:
                              download.priority === priority ? colors.tint : colors.cardBg,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.priorityButtonText,
                            { color: download.priority === priority ? "#fff" : colors.text },
                          ]}
                        >
                          {priority}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Downloads Concluídos */}
        {completedDownloads.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Concluídos
              </ThemedText>
              <Pressable
                onPress={handleClearCompleted}
                style={[styles.clearButton, { borderColor: colors.border }]}
              >
                <IconSymbol name="trash" size={16} color={colors.icon} />
                <ThemedText style={[styles.clearButtonText, { color: colors.icon }]}>
                  Limpar
                </ThemedText>
              </Pressable>
            </View>
            {completedDownloads.map((download) => (
              <View
                key={download.articleId}
                style={[
                  styles.completedCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name="checkmark.circle.fill" size={20} color="#34C759" />
                <View style={styles.completedInfo}>
                  <ThemedText numberOfLines={1}>{download.articleTitle || "Artigo"}</ThemedText>
                  {download.startedAt && download.completedAt && (
                    <ThemedText style={[styles.completedTime, { color: colors.icon }]}>
                      {formatDuration(download.completedAt - download.startedAt)}
                    </ThemedText>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Downloads com Erro */}
        {failedDownloads.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Falhas
            </ThemedText>
            {failedDownloads.map((download) => (
              <View
                key={download.articleId}
                style={[
                  styles.completedCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
              >
                <IconSymbol name="xmark.circle.fill" size={20} color="#FF3B30" />
                <View style={styles.completedInfo}>
                  <ThemedText numberOfLines={1}>{download.articleTitle || "Artigo"}</ThemedText>
                  <ThemedText style={[styles.completedTime, { color: "#FF3B30" }]}>
                    Erro no download
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // TODO: Tentar novamente
                  }}
                  style={styles.retryButton}
                >
                  <IconSymbol name="arrow.clockwise" size={16} color={colors.tint} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Estado Vazio */}
        {downloads.length === 0 && (
          <View style={styles.emptyContainer}>
            <IconSymbol name="tray" size={48} color={colors.icon} />
            <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
              Nenhum download na fila
            </ThemedText>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  downloadCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  downloadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  downloadInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginRight: 12,
  },
  downloadTitleContainer: {
    flex: 1,
    gap: 4,
  },
  downloadStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  downloadActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
  prioritySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 6,
  },
  priorityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  completedInfo: {
    flex: 1,
    gap: 2,
  },
  completedTime: {
    fontSize: 12,
  },
  retryButton: {
    padding: 4,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
