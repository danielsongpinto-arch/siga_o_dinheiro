import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ONBOARDING_KEY = "onboarding_completed";

const slides = [
  {
    icon: "book.fill" as const,
    title: "Bem-vindo ao Siga o Dinheiro",
    description:
      "Análise de fatos através da perspectiva financeira. Explore artigos profundos sobre economia, poder e história.",
  },
  {
    icon: "bookmark.fill" as const,
    title: "Destaques e Tags",
    description:
      "Salve trechos importantes, adicione notas pessoais e organize com tags coloridas (Importante, Revisar, Citar, Dúvida, Insight).",
  },
  {
    icon: "arrow.triangle.2.circlepath" as const,
    title: "Sincronização e Offline",
    description:
      "Ative a sincronização para manter seus destaques em todos os dispositivos. Baixe artigos para ler sem internet.",
  },
  {
    icon: "chart.bar.fill" as const,
    title: "Metas e Estatísticas",
    description:
      "Defina metas semanais ou mensais de leitura. Acompanhe seu progresso, conquistas e padrões de leitura no heatmap.",
  },
  {
    icon: "speaker.wave.2.fill" as const,
    title: "TTS e Modo Noturno",
    description:
      "Ouça artigos narrados com controles de velocidade. Modo noturno automático reduz luz azul após 20h para leitura confortável.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
  };

  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)");
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      {/* Skip Button */}
      <View style={styles.header}>
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <ThemedText style={[styles.skipText, { color: colors.tint }]}>Pular Tour</ThemedText>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
          <IconSymbol name={currentSlide.icon} size={80} color={colors.tint} />
        </View>

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          {currentSlide.title}
        </ThemedText>

        {/* Description */}
        <ThemedText style={[styles.description, { color: colors.icon }]}>
          {currentSlide.description}
        </ThemedText>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.tint : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: colors.tint }]}
        >
          <ThemedText style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
          </ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#fff" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "flex-end",
    marginBottom: 40,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    gap: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nextText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
