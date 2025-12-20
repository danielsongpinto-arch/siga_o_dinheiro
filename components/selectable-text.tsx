import { useState } from "react";
import { StyleSheet, Pressable, Alert, TextInput, Modal } from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useHighlights } from "@/hooks/use-highlights";

interface SelectableTextProps {
  text: string;
  articleId: string;
  articleTitle: string;
  fontSize?: number;
}

export function SelectableText({ text, articleId, articleTitle, fontSize = 16 }: SelectableTextProps) {
  const [selectedText, setSelectedText] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const { addHighlight } = useHighlights();

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const handleTextSelection = () => {
    // Em um app real, isso seria implementado com seleção de texto nativa
    // Por enquanto, vamos simular com um pressable que permite marcar o parágrafo inteiro
    setSelectedText(text);
    setShowNoteModal(true);
  };

  const handleSaveHighlight = async () => {
    if (!selectedText) return;

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addHighlight(articleId, articleTitle, selectedText, note);
    
    setShowNoteModal(false);
    setNote("");
    setSelectedText("");
    
    Alert.alert("Sucesso", "Marcador salvo com sucesso!");
  };

  const handleCancel = () => {
    setShowNoteModal(false);
    setNote("");
    setSelectedText("");
  };

  return (
    <>
      <Pressable onLongPress={handleTextSelection} delayLongPress={500}>
        <ThemedText style={[styles.text, { fontSize }]}>{text}</ThemedText>
      </Pressable>

      <Modal
        visible={showNoteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancel}>
          <Pressable
            style={[styles.modalContent, { backgroundColor: cardBg }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle">Adicionar Marcador</ThemedText>
              <Pressable onPress={handleCancel}>
                <IconSymbol name="xmark.circle.fill" size={24} color={textSecondary} />
              </Pressable>
            </ThemedView>

            <ThemedView style={[styles.selectedTextPreview, { borderColor }]}>
              <ThemedText style={styles.previewText} numberOfLines={3}>
                "{selectedText}"
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.noteSection}>
              <ThemedText type="defaultSemiBold" style={styles.noteLabel}>
                Adicionar nota (opcional)
              </ThemedText>
              <TextInput
                style={[
                  styles.noteInput,
                  { backgroundColor: borderColor, color: useThemeColor({}, "text") },
                ]}
                placeholder="Escreva uma nota sobre este trecho..."
                placeholderTextColor={textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={200}
              />
            </ThemedView>

            <ThemedView style={styles.modalActions}>
              <Pressable
                onPress={handleCancel}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.cancelButton,
                  { borderColor },
                  pressed && styles.buttonPressed,
                ]}
              >
                <ThemedText>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleSaveHighlight}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.saveButton,
                  { backgroundColor: tintColor },
                  pressed && styles.buttonPressed,
                ]}
              >
                <ThemedText style={{ color: "#fff" }}>Salvar</ThemedText>
              </Pressable>
            </ThemedView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  selectedTextPreview: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  noteSection: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonPressed: {
    opacity: 0.7,
  },
});
