import { View, Modal, Pressable, TextInput, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useArticleComments, ArticleComment } from "@/hooks/use-article-comments";

interface ArticleCommentsModalProps {
  visible: boolean;
  articleId: string;
  articleTitle: string;
  onClose: () => void;
}

export function ArticleCommentsModal({
  visible,
  articleId,
  articleTitle,
  onClose,
}: ArticleCommentsModalProps) {
  const insets = useSafeAreaInsets();
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
    cardBg: useThemeColor({ light: "#F9F9F9", dark: "#1C1C1E" }, "background"),
  };

  const { comments, addComment, updateComment, deleteComment } = useArticleComments(articleId);

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    await addComment(newCommentText.trim());
    setNewCommentText("");
  };

  const handleEditComment = (comment: ArticleComment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingText.trim()) return;
    await updateComment(editingCommentId, editingText.trim());
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      "Excluir Comentário",
      "Tem certeza que deseja excluir este comentário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteComment(commentId),
        },
      ]
    );
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">Comentários</ThemedText>
            <ThemedText style={[styles.articleTitle, { color: colors.icon }]} numberOfLines={1}>
              {articleTitle}
            </ThemedText>
          </View>
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.icon} />
          </Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, comments.length === 0 && styles.emptyList]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <IconSymbol name="bubble.left" size={48} color={colors.icon} />
                <ThemedText style={[styles.emptyText, { color: colors.icon }]}>Nenhum comentário ainda</ThemedText>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.commentCard, { backgroundColor: colors.cardBg }]}>
                {editingCommentId === item.id ? (
                  <View style={styles.editContainer}>
                    <TextInput value={editingText} onChangeText={setEditingText} style={[styles.editInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]} multiline autoFocus />
                    <View style={styles.editActions}>
                      <Pressable onPress={handleCancelEdit} style={[styles.editButton, { backgroundColor: colors.border }]}><ThemedText style={{ fontSize: 14 }}>Cancelar</ThemedText></Pressable>
                      <Pressable onPress={handleSaveEdit} style={[styles.editButton, { backgroundColor: colors.tint }]}><ThemedText style={{ fontSize: 14, color: "#fff" }}>Salvar</ThemedText></Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    <ThemedText style={styles.commentText}>{item.text}</ThemedText>
                    <View style={styles.commentFooter}>
                      <ThemedText style={[styles.commentDate, { color: colors.icon }]}>{formatDate(item.createdAt)}{item.updatedAt !== item.createdAt && " (editado)"}</ThemedText>
                      <View style={styles.commentActions}>
                        <Pressable onPress={() => handleEditComment(item)} style={styles.actionButton}><IconSymbol name="pencil" size={16} color={colors.icon} /></Pressable>
                        <Pressable onPress={() => handleDeleteComment(item.id)} style={styles.actionButton}><IconSymbol name="trash" size={16} color="#FF3B30" /></Pressable>
                      </View>
                    </View>
                  </>
                )}
              </View>
            )}
          />

          <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TextInput value={newCommentText} onChangeText={setNewCommentText} placeholder="Adicione um comentário..." placeholderTextColor={colors.icon} style={[styles.input, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.border }]} multiline maxLength={500} />
            <Pressable onPress={handleAddComment} disabled={!newCommentText.trim()} style={[styles.sendButton, { backgroundColor: newCommentText.trim() ? colors.tint : colors.border }]}>
              <IconSymbol name="paperplane.fill" size={20} color={newCommentText.trim() ? "#fff" : colors.icon} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  articleTitle: { fontSize: 14, marginTop: 4 },
  closeButton: { padding: 4 },
  listContent: { padding: 16, gap: 12 },
  emptyList: { flex: 1, justifyContent: "center" },
  emptyState: { alignItems: "center", gap: 8 },
  emptyText: { fontSize: 17, fontWeight: "600", marginTop: 16 },
  commentCard: { padding: 16, borderRadius: 12 },
  commentText: { fontSize: 16, lineHeight: 24 },
  commentFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  commentDate: { fontSize: 13 },
  commentActions: { flexDirection: "row", gap: 12 },
  actionButton: { padding: 4 },
  editContainer: { gap: 12 },
  editInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, lineHeight: 24, minHeight: 100, textAlignVertical: "top" },
  editActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  editButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  inputContainer: { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingTop: 16, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, lineHeight: 22, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
});
