import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useQuiz } from "@/hooks/use-quiz";
import { ARTICLES } from "@/data/mock-data";
import { QuizResult } from "@/types/quiz";

export default function QuizScreen() {
  const router = useRouter();
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const insets = useSafeAreaInsets();
  const { getQuizForArticle, saveQuizResult } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");

  const article = ARTICLES.find((a) => a.id === articleId);
  const questions = getQuizForArticle(articleId || "");

  if (!article || questions.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Quiz",
            headerStyle: { backgroundColor: tintColor },
            headerTintColor: "#fff",
          }}
        />
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>Quiz não disponível para este artigo</ThemedText>
        </ThemedView>
      </>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === undefined) {
      Alert.alert("Atenção", "Por favor, selecione uma resposta antes de continuar.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = async () => {
    const answers = questions.map((q, index) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[index],
      correct: selectedAnswers[index] === q.correctAnswer,
    }));

    const score = answers.filter((a) => a.correct).length;

    const result: QuizResult = {
      articleId: articleId || "",
      score,
      totalQuestions: questions.length,
      answers,
      completedAt: new Date().toISOString(),
    };

    await saveQuizResult(result);
    setShowResults(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleExit = () => {
    router.back();
  };

  if (showResults) {
    const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;

    return (
      <>
        <Stack.Screen
          options={{
            title: "Resultado do Quiz",
            headerStyle: { backgroundColor: tintColor },
            headerTintColor: "#fff",
            headerLeft: () => null,
          }}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
        >
          <ThemedView style={[styles.resultCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedView style={[styles.scoreCircle, { borderColor: tintColor }]}>
              <ThemedText style={[styles.scoreText, { color: tintColor }]}>
                {percentage}%
              </ThemedText>
            </ThemedView>

            <ThemedText type="title" style={styles.resultTitle}>
              {isPerfect ? "Perfeito!" : percentage >= 70 ? "Muito Bem!" : "Continue Praticando!"}
            </ThemedText>

            <ThemedText style={[styles.resultSubtitle, { color: secondaryText }]}>
              Você acertou {score} de {questions.length} questões
            </ThemedText>

            {isPerfect && (
              <ThemedView style={[styles.badge, { backgroundColor: tintColor }]}>
                <IconSymbol name="trophy.fill" size={20} color="#fff" />
                <ThemedText style={styles.badgeText}>Quiz Perfeito!</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView style={styles.reviewSection}>
            <ThemedText type="subtitle" style={styles.reviewTitle}>
              Revisão das Respostas
            </ThemedText>

            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <ThemedView
                  key={q.id}
                  style={[styles.reviewCard, { backgroundColor: cardBg, borderColor }]}
                >
                  <ThemedView style={styles.reviewHeader}>
                    <ThemedText type="defaultSemiBold">Questão {index + 1}</ThemedText>
                    {isCorrect ? (
                      <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                    ) : (
                      <IconSymbol name="xmark.circle.fill" size={24} color="#F44336" />
                    )}
                  </ThemedView>

                  <ThemedText style={styles.reviewQuestion}>{q.question}</ThemedText>

                  {q.options.map((option, optIndex) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = q.correctAnswer === optIndex;

                    return (
                      <ThemedView
                        key={optIndex}
                        style={[
                          styles.reviewOption,
                          { borderColor },
                          isCorrectAnswer && styles.correctOption,
                          isUserAnswer && !isCorrect && styles.wrongOption,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.reviewOptionText,
                            (isCorrectAnswer || (isUserAnswer && !isCorrect)) && styles.reviewOptionTextBold,
                          ]}
                        >
                          {option}
                        </ThemedText>
                        {isCorrectAnswer && (
                          <IconSymbol name="checkmark" size={18} color="#4CAF50" />
                        )}
                        {isUserAnswer && !isCorrect && (
                          <IconSymbol name="xmark" size={18} color="#F44336" />
                        )}
                      </ThemedView>
                    );
                  })}

                  <ThemedView style={[styles.explanation, { backgroundColor: borderColor }]}>
                    <ThemedText type="defaultSemiBold" style={styles.explanationTitle}>
                      Explicação:
                    </ThemedText>
                    <ThemedText style={styles.explanationText}>{q.explanation}</ThemedText>
                  </ThemedView>
                </ThemedView>
              );
            })}
          </ThemedView>

          <ThemedView style={styles.actions}>
            <WebClickable
              onPress={handleRetry}
              style={[styles.actionButton, styles.retryButton, { borderColor }]}
            >
              <IconSymbol name="arrow.clockwise" size={20} color={tintColor} />
              <ThemedText style={[styles.actionButtonText, { color: tintColor }]}>
                Tentar Novamente
              </ThemedText>
            </WebClickable>

            <WebClickable
              onPress={handleExit}
              style={[styles.actionButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={[styles.actionButtonText, { color: "#fff" }]}>
                Voltar ao Artigo
              </ThemedText>
            </WebClickable>
          </ThemedView>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Quiz: ${article.title}`,
          headerStyle: { backgroundColor: tintColor },
          headerTintColor: "#fff",
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.progressContainer}>
          <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
            <ThemedView
              style={[styles.progressFill, { backgroundColor: tintColor, width: `${progress}%` }]}
            />
          </ThemedView>
          <ThemedText style={[styles.progressText, { color: secondaryText }]}>
            Questão {currentQuestion + 1} de {questions.length}
          </ThemedText>
        </ThemedView>

        <ScrollView
          style={styles.questionContainer}
          contentContainerStyle={[
            styles.questionContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 100 },
          ]}
        >
          <ThemedText type="subtitle" style={styles.question}>
            {question.question}
          </ThemedText>

          <ThemedView style={styles.options}>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;

              return (
                <WebClickable
                  key={index}
                  onPress={() => handleSelectAnswer(index)}
                  style={[
                    styles.option,
                    { backgroundColor: cardBg, borderColor },
                    isSelected && { borderColor: tintColor, borderWidth: 2 },
                  ]}
                >
                  <ThemedView style={[styles.optionRadio, { borderColor }]}>
                    {isSelected && (
                      <ThemedView style={[styles.optionRadioFill, { backgroundColor: tintColor }]} />
                    )}
                  </ThemedView>
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                </WebClickable>
              );
            })}
          </ThemedView>
        </ScrollView>

        <ThemedView
          style={[
            styles.navigation,
            {
              paddingBottom: Math.max(insets.bottom, 20),
              borderTopColor: borderColor,
            },
          ]}
        >
          <WebClickable
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
            style={[
              styles.navButton,
              { borderColor },
              currentQuestion === 0 && styles.navButtonDisabled,
            ]}
          >
            <IconSymbol
              name="chevron.left"
              size={20}
              color={currentQuestion === 0 ? borderColor : tintColor}
            />
            <ThemedText
              style={[
                styles.navButtonText,
                { color: currentQuestion === 0 ? borderColor : tintColor },
              ]}
            >
              Anterior
            </ThemedText>
          </WebClickable>

          <WebClickable
            onPress={handleNext}
            style={[styles.navButton, styles.nextButton, { backgroundColor: tintColor }]}
          >
            <ThemedText style={[styles.navButtonText, { color: "#fff" }]}>
              {currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
            </ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#fff" />
          </WebClickable>
        </ThemedView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    paddingHorizontal: 16,
  },
  question: {
    marginBottom: 24,
    fontSize: 20,
    lineHeight: 28,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  nextButton: {
    borderWidth: 0,
  },
  navButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  resultCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "bold",
  },
  resultTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  resultSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewTitle: {
    marginBottom: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewQuestion: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontWeight: "500",
  },
  reviewOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  correctOption: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: "#4CAF50",
  },
  wrongOption: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderColor: "#F44336",
  },
  reviewOptionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  reviewOptionTextBold: {
    fontWeight: "600",
  },
  explanation: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  explanationTitle: {
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
});
