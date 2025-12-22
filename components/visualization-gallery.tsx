import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal, ScrollView, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

interface Visualization {
  id: string;
  title: string;
  description: string;
  image: any; // require() result
}

interface VisualizationGalleryProps {
  visualizations: Visualization[];
}

export function VisualizationGallery({ visualizations }: VisualizationGalleryProps) {
  const [selectedViz, setSelectedViz] = useState<Visualization | null>(null);
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  const { width: screenWidth } = Dimensions.get("window");

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        📊 Visualizações e Gráficos
      </ThemedText>
      <ThemedText style={styles.sectionDescription}>
        Toque em qualquer visualização para ampliar e ver em detalhes
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visualizations.map((viz) => (
          <Pressable
            key={viz.id}
            onPress={() => setSelectedViz(viz)}
            style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          >
            <Image
              source={viz.image}
              style={styles.thumbnail}
              contentFit="cover"
            />
            <ThemedView style={styles.cardContent}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                {viz.title}
              </ThemedText>
              <ThemedText style={styles.cardDescription} numberOfLines={2}>
                {viz.description}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal para visualização ampliada */}
      <Modal
        visible={selectedViz !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedViz(null)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                {selectedViz?.title}
              </ThemedText>
              <Pressable
                onPress={() => setSelectedViz(null)}
                style={[styles.closeButton, { backgroundColor: tintColor }]}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
            >
              {selectedViz && (
                <>
                  <Image
                    source={selectedViz.image}
                    style={[styles.fullImage, { width: screenWidth - 40 }]}
                    contentFit="contain"
                  />
                  <ThemedText style={styles.modalDescription}>
                    {selectedViz.description}
                  </ThemedText>
                </>
              )}
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.7,
  },
  scrollContent: {
    paddingRight: 16,
  },
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxHeight: "90%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  fullImage: {
    height: 400,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});
