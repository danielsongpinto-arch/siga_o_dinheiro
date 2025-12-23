import { Modal, View, Pressable, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ScheduleDownloadModalProps {
  visible: boolean;
  themeName: string;
  onClose: () => void;
  onSchedule: (time: Date, wifiOnly: boolean) => void;
}

export function ScheduleDownloadModal({
  visible,
  themeName,
  onClose,
  onSchedule,
}: ScheduleDownloadModalProps) {
  const insets = useSafeAreaInsets();
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    cardBg: useThemeColor({ light: "#fff", dark: "#1C1C1E" }, "background"),
    border: useThemeColor({ light: "#E5E5EA", dark: "#38383A" }, "text"),
  };

  const [selectedTime, setSelectedTime] = useState(new Date(Date.now() + 3600000)); // 1 hora a partir de agora
  const [wifiOnly, setWifiOnly] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSchedule = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSchedule(selectedTime, wifiOnly);
    onClose();
  };

  const formattedTime = selectedTime.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <ThemedView
          style={[
            styles.modalContent,
            {
              paddingBottom: Math.max(insets.bottom, 20),
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle">Agendar Download</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </Pressable>
          </View>

          {/* Série */}
          <View style={[styles.seriesInfo, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <IconSymbol name="book.fill" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
              {themeName}
            </ThemedText>
          </View>

          {/* Horário */}
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 12 }}>
              Horário
            </ThemedText>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowTimePicker(true);
              }}
              style={({ pressed }) => [
                styles.timeButton,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <IconSymbol name="clock" size={20} color={colors.icon} />
              <ThemedText type="defaultSemiBold">{formattedTime}</ThemedText>
              <IconSymbol name="chevron.right" size={16} color={colors.icon} />
            </Pressable>
          </View>

          {/* Wi-Fi Only */}
          <View style={styles.section}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setWifiOnly(!wifiOnly);
              }}
              style={({ pressed }) => [
                styles.wifiToggle,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                <IconSymbol name="wifi" size={20} color={colors.icon} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">Apenas Wi-Fi</ThemedText>
                  <ThemedText style={[styles.description, { color: colors.icon }]}>
                    Baixar apenas quando conectado ao Wi-Fi
                  </ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: wifiOnly ? colors.tint : "transparent",
                    borderColor: wifiOnly ? colors.tint : colors.border,
                  },
                ]}
              >
                {wifiOnly && <IconSymbol name="checkmark" size={16} color="#fff" />}
              </View>
            </Pressable>
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={{ color: colors.text }}>Cancelar</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSchedule}
              style={({ pressed }) => [
                styles.button,
                styles.scheduleButton,
                { backgroundColor: colors.tint },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "600" }}>Agendar</ThemedText>
            </Pressable>
          </View>

          {/* Date Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event: any, date?: Date) => {
                setShowTimePicker(Platform.OS === "ios");
                if (date) setSelectedTime(date);
              }}
              minimumDate={new Date()}
            />
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  seriesInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  wifiToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  scheduleButton: {},
  pressed: {
    opacity: 0.7,
  },
});
