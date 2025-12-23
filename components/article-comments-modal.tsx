import { View, Modal, TextInput, Pressable, FlatList, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useArticleComments, ArticleComment } from "@/hooks/use-article-comments";
import { exportCommentsToPDF, shareCommentsAsText } from "@/lib/export-comments";
import { shareCommentAsText, shareCommentAsImage } from "@/lib/share-comment";
import { useShareTracking } from "@/hooks/use-share-tracking";

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
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "7days" | "30days" | "90days">("all");

  const colors = {
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    tint: useThemeColor({}, "tint"),
    icon: useThemeColor({}, "icon"),
    border: useThemeColor({ light: "#E5E5E5", dark: "#2C2C2E" }, "background"),
    cardBg: useThemeColor({ light: "#F9F9F9", dark: "#1C1C1E" }, "background"),
  };

  const { comments, addComment, updateComment, deleteComment } = useArticleComments(articleId);
  const { trackShare } = useShareTracking();

  // Filtrar comentários por busca e data
  const filteredComments = comments.filter((comment) => {
    // Filtro de texto
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      if (!comment.text.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtro de data
    if (dateFilter !== "all") {
      const commentDate = new Date(comment.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === "7days" && daysDiff > 7) return false;
      if (dateFilter === "30days" && daysDiff > 30) return false;
      if (dateFilter === "90days" && daysDiff > 90) return false;
    }

    return true;
  });

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

  const handleExportComments = () => {
    Alert.alert(
      "Exportar Todos os Comentários",
      "Escolha o formato de exportação",
      [
        {
          text: "PDF",
          onPress: async () => {
            try {
              await trackShare();
              await exportCommentsToPDF();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível exportar os comentários");
            }
          },
        },
        {
          text: "Texto",
          onPress: async () => {
            try {
              await trackShare();
              await shareCommentsAsText();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível compartilhar os comentários");
            }
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const handleShareComment = (comment: ArticleComment) => {
    Alert.alert(
      "Compartilhar Comentário",
      "Escolha o formato",
      [
        {
          text: "Imagem",
          onPress: async () => {
            try {
              await trackShare();
              await shareCommentAsImage({
                ...comment,
                articleTitle,
              });
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível compartilhar o comentário");
            }
          },
        },
        {
          text: "Texto",
          onPress: async () => {
            try {
              await trackShare();
              await shareCommentAsText({
                ...comment,
                articleTitle,
              });
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível compartilhar o comentário");
            }
          },
        },
        { text: "Cancelar", style: "cancel" },
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
          {comments.length > 0 && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleExportComments();
              }}
              style={styles.exportButton}
            >
              <IconSymbol name="square.and.arrow.up" size={22} color={colors.tint} />
            </Pressable>
          )}
          <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.icon} />
          </Pressable>
        </View>

        {/* Campo de Busca e Filtros */}
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBg, borderBottomColor: colors.border }]}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar comentários..."
              placeholderTextColor={colors.icon}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {searchText.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearchText("");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
              </Pressable>
            )}
          </View>

          {/* Filtros de Data */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateFilters}>
            {["all", "7days", "30days", "90days"].map((filter) => (
              <Pressable
                key={filter}
                onPress={() => {
                  setDateFilter(filter as typeof dateFilter);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.dateFilterChip,
                  {
                    backgroundColor: dateFilter === filter ? colors.tint : colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dateFilterText,
                    { color: dateFilter === filter ? "#fff" : colors.text },
                  ]}
                >
                  {filter === "all" ? "Todos" : filter === "7days" ? "Últimos 7 dias" : filter === "30days" ? "Últimos 30 dias" : "Últimos 90 dias"}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Indicador de Resultados */}
          {(searchText || dateFilter !== "all") && (
            <View style={styles.resultsIndicator}>
              <ThemedText style={[styles.resultsText, { color: colors.icon }]}>
                {filteredComments.length} {filteredComments.length === 1 ? "resultado" : "resultados"}
              </ThemedText>
              <Pressable
                onPress={() => {
                  setSearchText("");
                  setDateFilter("all");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <ThemedText style={{ color: colors.tint, fontSize: 14 }}>Limpar filtros</ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <FlatList
            data={filteredComments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, comments.length === 0 && styles.emptyList]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <IconSymbol name={searchText || dateFilter !== "all" ? "magnifyingglass" : "bubble.left"} size={48} color={colors.icon} />
                <ThemedText style={[styles.emptyText, { color: colors.icon }]}>
                  {searchText || dateFilter !== "all" ? "Nenhum comentário encontrado" : "Nenhum comentário ainda"}
                </ThemedText>
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
                        <Pressable onPress={() => handleShareComment(item)} style={styles.actionButton}><IconSymbol name="square.and.arrow.up" size={16} color={colors.tint} /></Pressable>
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
  exportButton: { padding: 4, marginRight: 8 },
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
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
  searchInputContainer: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 16 },
  dateFilters: { flexDirection: "row", gap: 8 },
  dateFilterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  dateFilterText: { fontSize: 14, fontWeight: "500" },
  resultsIndicator: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  resultsText: { fontSize: 13 },
});
