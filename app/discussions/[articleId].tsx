import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useDiscussions } from "@/hooks/use-discussions";
import { useAuth } from "@/hooks/use-auth";
import { ARTICLES } from "@/data/mock-data";

export default function DiscussionsScreen() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { discussions, createDiscussion, addReply, toggleLike, isLiked } = useDiscussions(articleId);

  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [discussionContent, setDiscussionContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  const article = ARTICLES.find((a) => a.id === articleId);

  const handleCreateDiscussion = async () => {
    if (!discussionTitle.trim() || !discussionContent.trim()) {
      Alert.alert("Aviso", "Preencha o título e o conteúdo da discussão.");
      return;
    }

    if (!isAuthenticated || !user) {
      Alert.alert("Login necessário", "Você precisa estar logado para criar discussões.");
      return;
    }

    try {
      await createDiscussion(
        discussionTitle.trim(),
        discussionContent.trim(),
        user.openId,
        user.name || user.email || "Usuário"
      );
      setDiscussionTitle("");
      setDiscussionContent("");
      setShowNewDiscussion(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a discussão.");
    }
  };

  const handleAddReply = async (discussionId: string) => {
    if (!replyContent.trim()) return;

    if (!isAuthenticated || !user) {
      Alert.alert("Login necessário", "Você precisa estar logado para responder.");
      return;
    }

    try {
      await addReply(
        discussionId,
        replyContent.trim(),
        user.openId,
        user.name || user.email || "Usuário"
      );
      setReplyContent("");
      setReplyingTo(null);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a resposta.");
    }
  };

  const handleLike = async (itemId: string, isReply: boolean = false) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleLike(itemId, isReply);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Discussões",
          headerBackTitle: "Voltar",
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: Math.max(insets.top, 20) + 16,
              paddingBottom: Math.max(insets.bottom, 20) + 16,
            },
          ]}
        >
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle" style={styles.articleTitle}>
              {article?.title}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
              {discussions.length} {discussions.length === 1 ? "discussão" : "discussões"}
            </ThemedText>
          </ThemedView>

          {!showNewDiscussion && (
            <WebClickable
              onPress={() => setShowNewDiscussion(true)}
              style={[
                styles.newDiscussionButton,
                { backgroundColor: tintColor },
                styles.buttonPressed,
              ]}
            >
              <IconSymbol name="plus" size={20} color="#fff" />
              <ThemedText style={styles.newDiscussionButtonText}>
                Nova Discussão
              </ThemedText>
            </WebClickable>
          )}

          {showNewDiscussion && (
            <ThemedView style={[styles.newDiscussionCard, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Nova Discussão
              </ThemedText>
              <TextInput
                value={discussionTitle}
                onChangeText={setDiscussionTitle}
                placeholder="Título da discussão"
                placeholderTextColor={textSecondary}
                style={[styles.titleInput, { borderColor }]}
              />
              <TextInput
                value={discussionContent}
                onChangeText={setDiscussionContent}
                placeholder="Compartilhe sua análise ou pergunta..."
                placeholderTextColor={textSecondary}
                multiline
                numberOfLines={4}
                style={[styles.contentInput, { borderColor }]}
              />
              <ThemedView style={styles.buttonRow}>
                <WebClickable
                  onPress={() => {
                    setShowNewDiscussion(false);
                    setDiscussionTitle("");
                    setDiscussionContent("");
                  }}
                  style={[
                    styles.cancelButton,
                    { borderColor },
                    styles.buttonPressed,
                  ]}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
                </WebClickable>
                <WebClickable
                  onPress={handleCreateDiscussion}
                  style={[
                    styles.submitButton,
                    { backgroundColor: tintColor },
                    styles.buttonPressed,
                  ]}
                >
                  <ThemedText style={styles.submitButtonText}>Publicar</ThemedText>
                </WebClickable>
              </ThemedView>
            </ThemedView>
          )}

          {discussions.map((discussion) => (
            <ThemedView
              key={discussion.id}
              style={[styles.discussionCard, { backgroundColor: cardBg, borderColor }]}
            >
              <ThemedView style={styles.discussionHeader}>
                <ThemedView style={styles.discussionInfo}>
                  <ThemedText type="defaultSemiBold">{discussion.userName}</ThemedText>
                  <ThemedText style={[styles.timestamp, { color: textSecondary }]}>
                    {formatDate(discussion.createdAt)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedText type="defaultSemiBold" style={styles.discussionTitle}>
                {discussion.title}
              </ThemedText>
              <ThemedText style={styles.discussionContent}>{discussion.content}</ThemedText>

              <ThemedView style={styles.discussionActions}>
                <WebClickable
                  onPress={() => handleLike(discussion.id)}
                  style={styles.actionButton}
                >
                  <IconSymbol
                    name={isLiked(discussion.id) ? "heart.fill" : "heart"}
                    size={20}
                    color={isLiked(discussion.id) ? tintColor : textSecondary}
                  />
                  <ThemedText style={[styles.actionText, { color: textSecondary }]}>
                    {discussion.likes}
                  </ThemedText>
                </WebClickable>

                <WebClickable
                  onPress={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)}
                  style={styles.actionButton}
                >
                  <IconSymbol name="bubble.left.fill" size={20} color={textSecondary} />
                  <ThemedText style={[styles.actionText, { color: textSecondary }]}>
                    {discussion.replies.length}
                  </ThemedText>
                </WebClickable>
              </ThemedView>

              {discussion.replies.length > 0 && (
                <ThemedView style={styles.repliesList}>
                  {discussion.replies.map((reply) => (
                    <ThemedView key={reply.id} style={[styles.replyCard, { borderColor }]}>
                      <ThemedView style={styles.replyHeader}>
                        <ThemedText type="defaultSemiBold" style={styles.replyAuthor}>
                          {reply.userName}
                        </ThemedText>
                        <ThemedText style={[styles.timestamp, { color: textSecondary }]}>
                          {formatDate(reply.createdAt)}
                        </ThemedText>
                      </ThemedView>
                      <ThemedText style={styles.replyContent}>{reply.content}</ThemedText>
                      <WebClickable
                        onPress={() => handleLike(reply.id, true)}
                        style={styles.replyLike}
                      >
                        <IconSymbol
                          name={isLiked(reply.id) ? "heart.fill" : "heart"}
                          size={16}
                          color={isLiked(reply.id) ? tintColor : textSecondary}
                        />
                        <ThemedText style={[styles.actionText, { color: textSecondary }]}>
                          {reply.likes}
                        </ThemedText>
                      </WebClickable>
                    </ThemedView>
                  ))}
                </ThemedView>
              )}

              {replyingTo === discussion.id && (
                <ThemedView style={[styles.replyInput, { borderColor }]}>
                  <TextInput
                    value={replyContent}
                    onChangeText={setReplyContent}
                    placeholder="Escreva sua resposta..."
                    placeholderTextColor={textSecondary}
                    multiline
                    style={styles.replyTextInput}
                  />
                  <WebClickable
                    onPress={() => handleAddReply(discussion.id)}
                    disabled={!replyContent.trim()}
                    style={[
                      styles.replyButton,
                      { backgroundColor: tintColor },
                      !replyContent.trim() && styles.replyButtonDisabled,
                      styles.buttonPressed,
                    ]}
                  >
                    <IconSymbol name="paperplane.fill" size={20} color="#fff" />
                  </WebClickable>
                </ThemedView>
              )}
            </ThemedView>
          ))}

          {discussions.length === 0 && !showNewDiscussion && (
            <ThemedView style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText style={styles.emptyText}>
                Nenhuma discussão ainda. Seja o primeiro a iniciar uma conversa!
              </ThemedText>
            </ThemedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  articleTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  newDiscussionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  newDiscussionButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  newDiscussionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 16,
    lineHeight: 22,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  discussionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  discussionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  discussionInfo: {
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  discussionTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  discussionContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  discussionActions: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  repliesList: {
    marginTop: 12,
    gap: 8,
  },
  replyCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 16,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  replyAuthor: {
    fontSize: 14,
    lineHeight: 20,
  },
  replyContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  replyLike: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  replyInput: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  replyTextInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 40,
    maxHeight: 100,
  },
  replyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  replyButtonDisabled: {
    opacity: 0.4,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.7,
  },
});
