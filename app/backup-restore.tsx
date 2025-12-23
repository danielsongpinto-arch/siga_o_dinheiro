import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useBackupRestore } from "@/hooks/use-backup-restore";

export default function BackupRestoreScreen() {
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

  const { exporting, importing, progress, exportBackup, importBackup, getBackupSize } =
    useBackupRestore();
  const [backupSize, setBackupSize] = useState(0);

  useEffect(() => {
    loadBackupSize();
  }, []);

  const loadBackupSize = async () => {
    const size = await getBackupSize();
    setBackupSize(size);
  };

  const handleExport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Exportar Backup",
      "Deseja exportar todos os seus dados? Isso inclui cache, configurações, histórico e anotações.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Exportar",
          onPress: async () => {
            const success = await exportBackup();
            if (success) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Sucesso", "Backup exportado com sucesso!");
            } else {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Erro", "Falha ao exportar backup. Tente novamente.");
            }
          },
        },
      ]
    );
  };

  const handleImport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Importar Backup",
      "Atenção: Isso substituirá todos os seus dados atuais. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Importar",
          style: "destructive",
          onPress: async () => {
            const success = await importBackup();
            if (success) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                "Sucesso",
                "Backup importado com sucesso! Reinicie o app para aplicar as mudanças.",
                [{ text: "OK", onPress: () => router.back() }]
              );
            } else {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Erro", "Falha ao importar backup. Verifique o arquivo e tente novamente.");
            }
          },
        },
      ]
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
            Backup e Restauração
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            Proteja seus dados
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
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.tint} />
          <View style={styles.infoContent}>
            <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
              O que é incluído no backup?
            </ThemedText>
            <ThemedText style={[styles.infoText, { color: colors.icon }]}>
              • Artigos salvos offline{"\n"}
              • Histórico de leitura{"\n"}
              • Favoritos e destaques{"\n"}
              • Anotações e comentários{"\n"}
              • Configurações do app{"\n"}
              • Estatísticas de leitura
            </ThemedText>
          </View>
        </View>

        {/* Backup Size */}
        <View style={[styles.sizeCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.sizeInfo}>
            <ThemedText type="subtitle">Tamanho dos Dados</ThemedText>
            <ThemedText style={[styles.sizeValue, { color: colors.tint }]}>
              {backupSize.toFixed(2)} MB
            </ThemedText>
          </View>
          <ThemedText style={[styles.sizeDescription, { color: colors.icon }]}>
            Tamanho estimado do arquivo de backup
          </ThemedText>
        </View>

        {/* Export Button */}
        <WebClickable
          onPress={handleExport}
          disabled={exporting}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.tint, borderColor: colors.tint },
            (exporting || pressed) && styles.pressed,
          ]}
        >
          <IconSymbol name="square.and.arrow.up" size={24} color="#fff" />
          <View style={styles.actionContent}>
            <ThemedText style={styles.actionTitle}>
              {exporting ? "Exportando..." : "Exportar Backup"}
            </ThemedText>
            <ThemedText style={styles.actionDescription}>
              Salvar todos os dados em arquivo
            </ThemedText>
          </View>
          {exporting && (
            <ThemedText style={styles.progressText}>{Math.round(progress)}%</ThemedText>
          )}
        </WebClickable>

        {/* Import Button */}
        <WebClickable
          onPress={handleImport}
          disabled={importing}
          style={({ pressed }) => [
            styles.actionButton,
            styles.importButton,
            { borderColor: colors.border },
            (importing || pressed) && styles.pressed,
          ]}
        >
          <IconSymbol name="square.and.arrow.down" size={24} color={colors.tint} />
          <View style={styles.actionContent}>
            <ThemedText style={[styles.actionTitle, { color: colors.text }]}>
              {importing ? "Importando..." : "Importar Backup"}
            </ThemedText>
            <ThemedText style={[styles.actionDescription, { color: colors.icon }]}>
              Restaurar dados de arquivo
            </ThemedText>
          </View>
          {importing && (
            <ThemedText style={[styles.progressText, { color: colors.tint }]}>
              {Math.round(progress)}%
            </ThemedText>
          )}
        </WebClickable>

        {/* Warning */}
        <View style={[styles.warningCard, { backgroundColor: "#FFF3CD", borderColor: "#FFC107" }]}>
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#856404" />
          <ThemedText style={[styles.warningText, { color: "#856404" }]}>
            Importante: Ao importar um backup, todos os dados atuais serão substituídos. Faça um backup antes de importar.
          </ThemedText>
        </View>
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
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sizeCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  sizeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sizeValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sizeDescription: {
    fontSize: 13,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 16,
  },
  importButton: {
    backgroundColor: "transparent",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  warningCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.6,
  },
});
