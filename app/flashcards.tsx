import { Stack, useRouter } from "expo-router";
import { StyleSheet, Pressable, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFlashcards } from "@/hooks/use-flashcards";

export default function FlashcardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dueFlashcards, recordAnswer, getStats } = useFlashcards();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const stats = getStats();
  const currentCard = dueFlashcards[currentIndex];

  const flipCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async (correct: boolean) => {
    if (!currentCard) return;

    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    );

    await recordAnswer(currentCard.id, correct);

    if (currentIndex < dueFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } else {
      setShowStats(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowStats(false);
    flipAnim.setValue(0);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  if (showStats || dueFlashcards.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Modo de Estudo" }} />
        
        <ThemedView style={[styles.statsContainer, { paddingBottom: insets.bottom + 20 }]}>
          <IconSymbol name="checkmark.seal.fill" size={80} color={tintColor} />
          
          <ThemedText type="title" style={styles.statsTitle}>
            {dueFlashcards.length === 0 ? "Tudo em dia!" : "Sessão concluída!"}
          </ThemedText>

          <ThemedText style={[styles.statsSubtitle, { color: textSecondary }]}>
            {dueFlashcards.length === 0
              ? "Você revisou todos os flashcards disponíveis"
              : "Ótimo trabalho! Continue assim"}
          </ThemedText>

          <ThemedView style={[styles.statsGrid, { backgroundColor: cardBg, borderColor }]}>
            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={{ color: tintColor }}>
                {stats.totalCards}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Total de Cards
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.statDivider, { backgroundColor: borderColor }]} />

            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={{ color: tintColor }}>
                {stats.accuracy}%
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Precisão
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.statDivider, { backgroundColor: borderColor }]} />

            <ThemedView style={styles.statItem}>
              <ThemedText type="title" style={{ color: tintColor }}>
                {stats.dueCards}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Para Revisar
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <WebClickable
            onPress={() => router.back()}
            style={[styles.button, { backgroundColor: tintColor }]}
          >
            <ThemedText style={styles.buttonText}>Voltar</ThemedText>
          </WebClickable>

          {dueFlashcards.length > 0 && (
            <WebClickable onPress={restart} style={[styles.button, styles.secondaryButton, { borderColor }]}>
              <ThemedText style={styles.secondaryButtonText}>Revisar Novamente</ThemedText>
            </WebClickable>
          )}
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Modo de Estudo",
          headerRight: () => (
            <ThemedText style={{ color: textSecondary }}>
              {currentIndex + 1} / {dueFlashcards.length}
            </ThemedText>
          ),
        }}
      />

      <ThemedView style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <ThemedView style={styles.progressBar}>
          <ThemedView
            style={[
              styles.progressFill,
              {
                backgroundColor: tintColor,
                width: `${((currentIndex + 1) / dueFlashcards.length) * 100}%`,
              },
            ]}
          />
        </ThemedView>

        <WebClickable onPress={flipCard} style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              { backgroundColor: cardBg, borderColor },
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <ThemedText style={styles.cardLabel}>Pergunta</ThemedText>
            <ThemedText type="subtitle" style={styles.cardText}>
              {currentCard?.front}
            </ThemedText>
            <ThemedView style={[styles.categoryBadge, { backgroundColor: borderColor }]}>
              <ThemedText style={[styles.categoryText, { color: tintColor }]}>
                {currentCard?.category.toUpperCase()}
              </ThemedText>
            </ThemedView>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { backgroundColor: tintColor },
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <ThemedText style={[styles.cardLabel, { color: "rgba(255,255,255,0.8)" }]}>
              Resposta
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.cardText, { color: "#fff" }]}>
              {currentCard?.back}
            </ThemedText>
          </Animated.View>
        </WebClickable>

        <ThemedText style={[styles.hint, { color: textSecondary }]}>
          Toque no card para virar
        </ThemedText>

        {isFlipped && (
          <ThemedView style={styles.actions}>
            <WebClickable
              onPress={() => handleAnswer(false)}
              style={[styles.actionButton, styles.incorrectButton]}
            >
              <IconSymbol name="xmark.circle.fill" size={32} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Errei</ThemedText>
            </WebClickable>

            <WebClickable
              onPress={() => handleAnswer(true)}
              style={[styles.actionButton, styles.correctButton]}
            >
              <IconSymbol name="checkmark.circle.fill" size={32} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Acertei</ThemedText>
            </WebClickable>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  cardContainer: {
    height: 400,
    marginBottom: 16,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    padding: 32,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardFront: {},
  cardBack: {},
  cardLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 16,
    opacity: 0.7,
  },
  cardText: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: 32,
  },
  categoryBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
  hint: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  incorrectButton: {
    backgroundColor: "#FF3B30",
  },
  correctButton: {
    backgroundColor: "#34C759",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
  statsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statsTitle: {
    marginTop: 24,
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    width: "100%",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
  },
});
