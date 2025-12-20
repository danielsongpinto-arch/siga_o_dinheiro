import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Share } from "react-native";
import * as Speech from "expo-speech";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SelectableText } from "@/components/selectable-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { useOfflineArticles } from "@/hooks/use-offline-articles";
import { useReadingHistory } from "@/hooks/use-reading-history";
import { ARTICLES } from "@/data/mock-data";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { comments, addComment } = useComments(id || "");
  const { isArticleOffline, saveArticleOffline, removeArticleOffline } = useOfflineArticles();
  const { markAsRead } = useReadingHistory();
  const [commentText, setCommentText] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Artigo não encontrado</ThemedText>
      </ThemedView>
    );
  }

  const handleFavorite = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleFavorite(article.id);
  };

  const handleOfflineToggle = async () => {
    if (!article) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isArticleOffline(article.id)) {
      await removeArticleOffline(article.id);
    } else {
      await saveArticleOffline(article);
    }
  };

  const handleShare = async () =>{
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}`,
        title: article.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (!isAuthenticated || !user) {
      Alert.alert("Login necessário", "Você precisa estar logado para comentar.");
      return;
    }

    try {
      await addComment(commentText.trim(), user.openId, user.name || user.email || "Usuário");
      setCommentText("");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o comentário.");
    }
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handlePlayAudio = async () => {
    if (!article) return;

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const textToSpeak = `${article.title}. ${article.content}`;

    Speech.speak(textToSpeak, {
      language: "pt-BR",
      rate: speechRate,
      onStart: () => setIsPlaying(true),
      onDone: () => setIsPlaying(false),
      onStopped: () => setIsPlaying(false),
      onError: () => {
        setIsPlaying(false);
        Alert.alert("Erro", "N\u00e3o foi poss\u00edvel reproduzir o \u00e1udio.");
      },
    });
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(speechRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeechRate(speeds[nextIndex]);

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen
        options={{
          headerShown: !focusMode,
          title: "",
          headerBackTitle: "Voltar",
          headerRight: () => (
            <ThemedView style={styles.headerActions}>
              <Pressable onPress={handleFavorite} style={styles.headerButton}>
                <IconSymbol
                  name={isFavorite(article.id) ? "heart.fill" : "heart"}
                  size={24}
                  color={isFavorite(article.id) ? tintColor : textSecondary}
                />
              </Pressable>
              <Pressable onPress={handleOfflineToggle} style={styles.headerButton}>
                <IconSymbol
                  name={isArticleOffline(article.id) ? "arrow.down.circle.fill" : "arrow.down.circle"}
                  size={24}
                  color={isArticleOffline(article.id) ? tintColor : textSecondary}
                />
              </Pressable>
              <Pressable onPress={handleShare} style={styles.headerButton}>
                <IconSymbol name="square.and.arrow.up" size={24} color={textSecondary} />
              </Pressable>
              <Pressable onPress={() => setFocusMode(true)} style={styles.headerButton}>
                <IconSymbol name="book.fill" size={24} color={textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => router.push(`/discussions/${article.id}` as any)}
                style={styles.headerButton}
              >
                <IconSymbol name="bubble.left.fill" size={24} color={textSecondary} />
              </Pressable>
            </ThemedView>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 16 },
        ]}
      >
        {focusMode && (
          <Pressable
            onPress={() => setFocusMode(false)}
            style={[styles.focusModeButton, { backgroundColor: tintColor }]}
          >
            <IconSymbol name="xmark" size={20} color="#fff" />
            <ThemedText style={styles.focusModeText}>Sair do Modo Focado</ThemedText>
          </Pressable>
        )}
        <ThemedView style={styles.articleHeader}>
          <ThemedText type="title" style={styles.articleTitle}>
            {article.title}
          </ThemedText>
          <ThemedText style={[styles.articleDate, { color: textSecondary }]}>
            {formatDate(article.date)}
          </ThemedText>
          
          {/* Controles de \u00c1udio */}
          <ThemedView style={[styles.audioControls, { backgroundColor: cardBg, borderColor }]}>
            <Pressable
              onPress={handlePlayAudio}
              style={({ pressed }) => [
                styles.audioButton,
                { backgroundColor: tintColor },
                pressed && styles.audioButtonPressed,
              ]}
            >
              <IconSymbol
                name={isPlaying ? "pause.fill" : "play.fill"}
                size={20}
                color="#fff"
              />
              <ThemedText style={styles.audioButtonText}>
                {isPlaying ? "Pausar \u00c1udio" : "Ouvir Artigo"}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSpeedChange}
              style={({ pressed }) => [
                styles.speedButton,
                { borderColor },
                pressed && { opacity: 0.7 },
              ]}
            >
              <ThemedText style={styles.speedText}>{speechRate}x</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.articleContent}>
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <ThemedText key={index} type="subtitle" style={styles.sectionTitle}>
                  {paragraph.replace("## ", "")}
                </ThemedText>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <ThemedText key={index} type="defaultSemiBold" style={styles.subsectionTitle}>
                  {paragraph.replace("### ", "")}
                </ThemedText>
              );
            }
            return (
              <SelectableText
                key={index}
                text={paragraph}
                articleId={article.id}
                articleTitle={article.title}
              />
            );
          })}
        </ThemedView>

        {!focusMode && (
          <>
        <ThemedView style={[styles.authorsSection, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Autores e Interesses Financeiros
          </ThemedText>
          {article.authors.map((author, index) => (
            <ThemedView key={index} style={styles.authorItem}>
              <ThemedText type="defaultSemiBold" style={styles.authorName}>
                {author.name}
              </ThemedText>
              <ThemedText style={[styles.authorRole, { color: textSecondary }]}>
                {author.role}
              </ThemedText>
              <ThemedText style={styles.authorInterest}>
                💰 {author.financialInterest}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={[styles.cycleSection, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Ciclo Financeiro
          </ThemedText>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Início
            </ThemedText>
            <ThemedText style={styles.cycleText}>{article.financialCycle.inicio}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Meio
            </ThemedText>
            <ThemedText style={styles.cycleText}>{article.financialCycle.meio}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Fim
            </ThemedText>
            <ThemedText style={styles.cycleText}>{article.financialCycle.fim}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.relatedSection}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Você também pode gostar
          </ThemedText>
          <ThemedView style={styles.relatedArticles}>
            {ARTICLES.filter(
              (a) => a.themeId === article.themeId && a.id !== article.id
            )
              .slice(0, 3)
              .map((relatedArticle) => (
                <Pressable
                  key={relatedArticle.id}
                  onPress={() => router.push(`/article/${relatedArticle.id}` as any)}
                  style={({ pressed }) => [
                    styles.relatedCard,
                    { backgroundColor: cardBg, borderColor },
                    pressed && styles.relatedCardPressed,
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.relatedTitle}
                    numberOfLines={2}
                  >
                    {relatedArticle.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.relatedSummary, { color: textSecondary }]}
                    numberOfLines={2}
                  >
                    {relatedArticle.summary}
                  </ThemedText>
                  <ThemedView style={styles.relatedFooter}>
                    <ThemedText style={[styles.relatedDate, { color: textSecondary }]}>
                      {formatDate(relatedArticle.date)}
                    </ThemedText>
                    <IconSymbol name="chevron.right" size={16} color={textSecondary} />
                  </ThemedView>
                </Pressable>
              ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.commentsSection}>
          <ThemedText type="subtitle" style={styles.sectionHeader}>
            Comentários ({comments.length})
          </ThemedText>

          {isAuthenticated ? (
            <ThemedView style={[styles.commentInput, { backgroundColor: cardBg, borderColor }]}>
              <TextInput
                style={[styles.input, { color: useThemeColor({}, "text") }]}
                placeholder="Adicione um comentário..."
                placeholderTextColor={textSecondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <Pressable
                onPress={handleAddComment}
                disabled={!commentText.trim()}
                style={({ pressed }) => [
                  styles.sendButton,
                  { backgroundColor: tintColor },
                  !commentText.trim() && styles.sendButtonDisabled,
                  pressed && styles.sendButtonPressed,
                ]}
              >
                <IconSymbol name="paperplane.fill" size={20} color="#fff" />
              </Pressable>
            </ThemedView>
          ) : (
            <ThemedView style={[styles.loginPrompt, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText style={styles.loginPromptText}>
                Faça login para comentar
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.commentsList}>
            {comments.map((comment) => (
              <ThemedView key={comment.id} style={[styles.commentItem, { backgroundColor: cardBg }]}>
                <ThemedView style={styles.commentHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.commentAuthor}>
                    {comment.userName}
                  </ThemedText>
                  <ThemedText style={[styles.commentDate, { color: textSecondary }]}>
                    {formatCommentDate(comment.date)}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  articleHeader: {
    marginBottom: 24,
  },
  articleTitle: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 14,
    lineHeight: 20,
  },
  articleContent: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginTop: 20,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  authorsSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  cycleSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  relatedSection: {
    marginBottom: 32,
  },
  relatedArticles: {
    gap: 12,
  },
  relatedCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  relatedCardPressed: {
    opacity: 0.7,
  },
  relatedTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  relatedSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  relatedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  relatedDate: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  authorItem: {
    marginBottom: 16,
  },
  authorName: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  authorRole: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  authorInterest: {
    fontSize: 14,
    lineHeight: 20,
  },
  cycleItem: {
    marginBottom: 16,
  },
  cyclePhase: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  cycleText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  commentsSection: {
    marginBottom: 16,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  loginPrompt: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  loginPromptText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    padding: 12,
    borderRadius: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    lineHeight: 16,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  focusModeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  focusModeText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  audioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  audioButtonPressed: {
    opacity: 0.8,
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  speedButton: {
    width: 60,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  speedText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
