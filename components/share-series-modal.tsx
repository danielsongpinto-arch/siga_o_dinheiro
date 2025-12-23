import { Modal, View, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSeriesExport } from "@/hooks/use-series-export";
import QRCode from "react-native-qrcode-svg";
import { useState, useEffect } from "react";

interface ShareSeriesModalProps {
  visible: boolean;
  seriesId: string;
  seriesName: string;
  onClose: () => void;
}

export function ShareSeriesModal({ visible, seriesId, seriesName, onClose }: ShareSeriesModalProps) {
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    cardBg: useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background"),
    border: useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text"),
  };

  const { exporting, progress, exportSeries, generateQRCodeData } = useSeriesExport();
  const [qrData, setQrData] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (visible) {
      loadQRData();
    }
  }, [visible]);

  const loadQRData = async () => {
    const data = await generateQRCodeData(seriesId, seriesName);
    setQrData(data);
  };

  const handleExport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await exportSeries(seriesId, seriesName);

    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Não foi possível exportar a série. Verifique se há artigos em cache.");
    }
  };

  const handleShowQR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowQR(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modal,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, 20) + 20,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText type="subtitle">Compartilhar Série</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ThemedText style={[styles.seriesName, { color: colors.text }]}>
              {seriesName}
            </ThemedText>
            <ThemedText style={[styles.description, { color: colors.icon }]}>
              Exporte todos os artigos desta série em cache para compartilhar com outros usuários
            </ThemedText>

            {exporting && (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
                <ThemedText style={[styles.progressText, { color: colors.icon }]}>
                  Exportando... {Math.round(progress)}%
                </ThemedText>
              </View>
            )}

            {showQR && qrData ? (
              <View style={styles.qrContainer}>
                <QRCode value={qrData} size={200} />
                <ThemedText style={[styles.qrCaption, { color: colors.icon }]}>
                  Escaneie este QR code para baixar a série
                </ThemedText>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Pressable
                  onPress={handleExport}
                  disabled={exporting}
                  style={({ pressed }) => [
                    styles.button,
                    styles.primaryButton,
                    { backgroundColor: colors.tint },
                    pressed && styles.buttonPressed,
                    exporting && styles.buttonDisabled,
                  ]}
                >
                  <IconSymbol name="square.and.arrow.up" size={20} color="#fff" />
                  <ThemedText style={styles.buttonText}>Exportar Arquivo</ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleShowQR}
                  disabled={exporting || !qrData}
                  style={({ pressed }) => [
                    styles.button,
                    styles.secondaryButton,
                    { borderColor: colors.border },
                    pressed && styles.buttonPressed,
                    (exporting || !qrData) && styles.buttonDisabled,
                  ]}
                >
                  <IconSymbol name="qrcode" size={20} color={colors.text} />
                  <ThemedText style={[styles.buttonTextSecondary, { color: colors.text }]}>
                    Gerar QR Code
                  </ThemedText>
                </Pressable>
              </View>
            )}
          </View>

          {/* Cancel Button */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: colors.border },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={{ color: colors.text }}>
              {showQR ? "Voltar" : "Cancelar"}
            </ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  seriesName: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  progressText: {
    fontSize: 14,
  },
  qrContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 16,
  },
  qrCaption: {
    fontSize: 13,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
});
