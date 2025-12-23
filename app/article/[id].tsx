import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { Share } from "react-native";
import { AudioPlayer } from "@/components/audio-player";
import { useArticleAudio } from "@/hooks/use-article-audio";
import { VisualizationGallery } from "@/components/visualization-gallery";
import { ArticleTableOfContents } from "@/components/article-table-of-contents";
import { ArticleBookmarks, createBookmark } from "@/components/article-bookmarks";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SelectableText } from "@/components/selectable-text";
import { ArticleTextWithReferences, ReferenceList } from "@/components/article-text-with-references";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { useOfflineArticles } from "@/hooks/use-offline-articles";
import { useReadingHistory } from "@/hooks/use-reading-history";
import { useQuiz } from "@/hooks/use-quiz";
import { useFontSize } from "@/hooks/use-font-size";
import { useScrollHideTabBar } from "@/hooks/use-scroll-hide-tab-bar";
import { useBookmarkSync } from "@/hooks/use-bookmark-sync";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useReadingGoals } from "@/hooks/use-reading-goals";
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
  const { getQuizForArticle, getScorePercentage, hasCompletedQuiz } = useQuiz();
  const { getFontSizes } = useFontSize();
  const fontSizes = getFontSizes();
  const { handleScroll, resetTabBar } = useScrollHideTabBar();
  const { syncEnabled, syncBookmark, deleteBookmarkOnServer } = useBookmarkSync();
  const { updateProgress, getProgress } = useReadingProgress();
  const { incrementProgress } = useReadingGoals();
  const [commentText, setCommentText] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [summaryMode, setSummaryMode] = useState(false);
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Resetar tab bar ao desmontar
  useEffect(() => {
    return () => {
      resetTabBar();
    };
  }, [resetTabBar]);

  const article = ARTICLES.find((a) => a.id === id);
  const audioHook = useArticleAudio(article?.content || "");

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
      audioHook.stop();
    };
  }, []);

  const handlePlayAudio = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    audioHook.play();
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
              <Pressable onPress={() => router.push(`/notes/${article.id}` as any)} style={styles.headerButton}>
                <IconSymbol name="doc.text.fill" size={24} color={textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => router.push(`/discussions/${article.id}` as any)}
                style={styles.headerButton}
              >
                <IconSymbol name="bubble.left.fill" size={24} color={textSecondary} />
              </Pressable>
              <Pressable onPress={() => setShowBookmarks(true)} style={styles.headerButton}>
                <IconSymbol name="bookmark.fill" size={24} color={textSecondary} />
              </Pressable>
            </ThemedView>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        onScroll={(event) => {
          handleScroll(event);
          // Atualizar progresso de leitura
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          if (article) {
            updateProgress(
              article.id,
              contentOffset.y,
              contentSize.height,
              layoutMeasurement.height,
              async () => {
                // Callback quando artigo é completado (90%)
                await incrementProgress();
              }
            );
          }
        }}
        scrollEventThrottle={16}
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
          <ThemedText type="title" style={[styles.articleTitle, { fontSize: fontSizes.title }]}>
            {article.title}
          </ThemedText>
          <ThemedText style={[styles.articleDate, { color: textSecondary }]}>
            {formatDate(article.date)}
          </ThemedText>
          
           {/* Botão de Áudio */}
          <Pressable
            onPress={handlePlayAudio}
            style={({ pressed }) => [
              styles.audioButton,
              { backgroundColor: tintColor },
              pressed && styles.audioButtonPressed,
            ]}
          >
            <IconSymbol
              name="play.fill"
              size={20}
              color="#fff"
            />
            <ThemedText style={styles.audioButtonText}>
              Ouvir Artigo
            </ThemedText>
          </Pressable>
        </ThemedView>

        {/* Botão Modo Resumo */}
        {!focusMode && (
          <Pressable
            onPress={() => {
              setSummaryMode(!summaryMode);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={[styles.summaryModeButton, { backgroundColor: summaryMode ? tintColor : cardBg, borderColor }]}
          >
            <IconSymbol
              name={summaryMode ? "doc.text.fill" : "doc.plaintext"}
              size={20}
              color={summaryMode ? "#fff" : tintColor}
            />
            <ThemedText style={[styles.summaryModeText, { color: summaryMode ? "#fff" : tintColor }]}>
              {summaryMode ? "Ver Artigo Completo" : "Modo Resumo"}
            </ThemedText>
          </Pressable>
        )}

        {/* Índice Clicável */}
        {!focusMode && !summaryMode && (
          <ArticleTableOfContents
            content={article.content}
            onSectionPress={(sectionIndex) => {
              // Scroll para a seção selecionada
              // Nota: implementação simplificada - em produção usaria refs para scroll preciso
              setCurrentPartIndex(sectionIndex);
            }}
            currentSection={currentPartIndex}
          />
        )}

        <ThemedView style={styles.articleContent}>
          {(() => {
            // Dividir artigo em partes baseado em "## Parte"
            const parts = article.content.split(/(?=## Parte \d+:)/);
            
            // Na versão web, SEMPRE mostrar artigo completo (sem divisão por partes)
            // No mobile, usar divisão por partes para melhor UX
            const shouldShowFullArticle = Platform.OS === 'web' || parts.length === 1 || !parts[0].includes("## Parte");
            
            // MODO RESUMO: Mostrar apenas títulos + primeiro parágrafo de cada parte
            if (summaryMode && parts.length > 1) {
              return parts.map((part, partIndex) => {
                const paragraphs = part.split("\n\n");
                const title = paragraphs.find(p => p.startsWith("## Parte"));
                const firstParagraph = paragraphs.find(p => !p.startsWith("##") && !p.startsWith("###") && p.trim().length > 0);
                
                return (
                  <ThemedView key={partIndex} style={[styles.summarySection, { backgroundColor: cardBg, borderColor }]}>
                    {title && (
                      <ThemedText type="subtitle" style={[styles.sectionTitle, { fontSize: fontSizes.subtitle }]}>
                        {title.replace("## ", "")}
                      </ThemedText>
                    )}
                    {firstParagraph && (
                      <ThemedText style={[styles.summaryText, { fontSize: fontSizes.body, color: textSecondary }]}>
                        {firstParagraph.substring(0, 200)}...
                      </ThemedText>
                    )}
                  </ThemedView>
                );
              });
            }
            
            // Se não houver partes definidas OU estiver na web, mostrar todo o conteúdo
            if (shouldShowFullArticle) {
              return article.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <ThemedText key={index} type="subtitle" style={[styles.sectionTitle, { fontSize: fontSizes.subtitle }]}>
                      {paragraph.replace("## ", "")}
                    </ThemedText>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <ThemedText key={index} type="defaultSemiBold" style={[styles.subsectionTitle, { fontSize: fontSizes.body }]}>
                      {paragraph.replace("### ", "")}
                    </ThemedText>
                  );
                }
                // Se o parágrafo contém referências [1], [2], etc., usar ArticleTextWithReferences
                if (paragraph.match(/\[\d+\]/)) {
                  return (
                    <ArticleTextWithReferences
                      key={index}
                      content={paragraph}
                      style={{ fontSize: fontSizes.body, lineHeight: fontSizes.body * 1.6, marginBottom: 16 }}
                      onReferencePress={(refNumber) => {
                        // Scroll para seção de referências (implementação simplificada)
                        console.log(`Reference ${refNumber} clicked`);
                      }}
                    />
                  );
                }
                return (
                  <SelectableText
                    key={index}
                    text={paragraph}
                    articleId={article.id}
                    articleTitle={article.title}
                    fontSize={fontSizes.body}
                  />
                );
              });
            }

            // Filtrar partes vazias
            const validParts = parts.filter(p => p.trim().length > 0);
            const currentPart = validParts[currentPartIndex] || validParts[0];
            const totalParts = validParts.length;

            return (
              <>
                {/* Indicador de Progresso */}
                {totalParts > 1 && (
                  <ThemedView style={[styles.partIndicator, { backgroundColor: cardBg, borderColor }]}>
                    <ThemedText style={[styles.partIndicatorText, { color: textSecondary }]}>
                      Parte {currentPartIndex + 1} de {totalParts}
                    </ThemedText>
                    <ThemedView style={styles.partDots}>
                      {validParts.map((_, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setCurrentPartIndex(index);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                          style={[
                            styles.partDot,
                            {
                              backgroundColor: index === currentPartIndex ? tintColor : borderColor,
                            },
                          ]}
                        />
                      ))}
                    </ThemedView>
                  </ThemedView>
                )}

                {/* Conteúdo da Parte Atual */}
                {currentPart.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("## ")) {
                    return (
                      <ThemedText key={index} type="subtitle" style={[styles.sectionTitle, { fontSize: fontSizes.subtitle }]}>
                        {paragraph.replace("## ", "")}
                      </ThemedText>
                    );
                  }
                  if (paragraph.startsWith("### ")) {
                    return (
                      <ThemedText key={index} type="defaultSemiBold" style={[styles.subsectionTitle, { fontSize: fontSizes.body }]}>
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
                      fontSize={fontSizes.body}
                    />
                  );
                })}

                {/* Botões de Navegação */}
                {totalParts > 1 && (
                  <ThemedView style={styles.partNavigation}>
                    <Pressable
                      onPress={() => {
                        if (currentPartIndex > 0) {
                          setCurrentPartIndex(currentPartIndex - 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }
                      }}
                      disabled={currentPartIndex === 0}
                      style={[
                        styles.partNavButton,
                        { backgroundColor: currentPartIndex === 0 ? borderColor : tintColor },
                      ]}
                    >
                      <IconSymbol name="chevron.left" size={20} color="#fff" />
                      <ThemedText style={styles.partNavButtonText}>
                        {currentPartIndex === 0 ? "Início" : "Anterior"}
                      </ThemedText>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        if (currentPartIndex < totalParts - 1) {
                          setCurrentPartIndex(currentPartIndex + 1);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        }
                      }}
                      disabled={currentPartIndex === totalParts - 1}
                      style={[
                        styles.partNavButton,
                        { backgroundColor: currentPartIndex === totalParts - 1 ? borderColor : tintColor },
                      ]}
                    >
                      <ThemedText style={styles.partNavButtonText}>
                        {currentPartIndex === totalParts - 1 ? "Fim" : "Próxima"}
                      </ThemedText>
                      <IconSymbol name="chevron.right" size={20} color="#fff" />
                    </Pressable>
                  </ThemedView>
                )}
              </>
            );
          })()}
        </ThemedView>

        {/* Galeria de Visualizações para O Sistema Autoperpetuante */}
        {!focusMode && article.id === "sistema-001" && (
          <VisualizationGallery
            visualizations={[
              {
                id: "ciclo",
                title: "O Ciclo Autoperpetuante",
                description: "Como o sistema se renova através de 5 fases: Expansão → Euforia → Crise → Transferência → Renovação",
                image: require("@/assets/images/visualizations/ciclo-autoperpetuante.png"),
              },
              {
                id: "timeline-crises",
                title: "Linha do Tempo das Crises",
                description: "Histórico de crises financeiras de 1929 a 2026: padrão repetitivo de transferência de riqueza",
                image: require("@/assets/images/visualizations/linha-tempo-crises.png"),
              },
              {
                id: "multiplicador",
                title: "Multiplicador Bancário",
                description: "Como $1 se transforma em $10 através do sistema de reservas fracionárias",
                image: require("@/assets/images/visualizations/multiplicador-bancario.png"),
              },
              {
                id: "transferencia",
                title: "Transferência de Riqueza",
                description: "Tabela detalhada: quanto os 1% ganharam e os 99% perderam em cada crise",
                image: require("@/assets/images/visualizations/transferencia-riqueza.png"),
              },
            ]}
          />
        )}

        {/* Galeria de Visualizações para Arquitetos do Poder */}
        {!focusMode && (article.themeId === "arquitetos-do-poder" || article.id === "rockefeller-001" || article.id === "morgan-001" || article.id === "carnegie-001" || article.id === "conexoes-001") && (
          <VisualizationGallery
            visualizations={[
              {
                id: "jekyll-island",
                title: "Rede Jekyll Island",
                description: "Novembro 1910: 6 homens controlando 1/4 da riqueza mundial criaram o Federal Reserve",
                image: require("@/assets/images/visualizations/jekyll-island-network.png"),
              },
              {
                id: "timeline-arquitetos",
                title: "Linha do Tempo Integrada",
                description: "1870-2024: Como Rockefeller, Morgan e Carnegie construíram sistemas que persistem hoje",
                image: require("@/assets/images/visualizations/arquitetos-timeline.png"),
              },
            ]}
          />
        )}

        {/* Galeria de Visualizações para artigos da Segunda Guerra */}
        {!focusMode && (article.id === "ww2-001" || article.id === "ww2-prewar" || article.id === "ww2-postwar") && (
          <VisualizationGallery
            visualizations={[
              {
                id: "fluxograma",
                title: "Sistema de Saque Nazista",
                description: "Fluxograma mostrando como recursos fluíam dos países conquistados para a máquina de guerra alemã",
                image: require("@/assets/images/wwii-saque-fluxograma.png"),
              },
              {
                id: "producao",
                title: "Produção Militar Comparada",
                description: "Comparação da produção de tanques, aviões e navios entre Alemanha e Aliados (1939-1945)",
                image: require("@/assets/images/wwii-producao-comparada.png"),
              },
              {
                id: "timeline",
                title: "Linha do Tempo Financeira",
                description: "Trajetória financeira da Alemanha nazista de 1933 a 1945, mostrando ganhos e perdas",
                image: require("@/assets/images/wwii-linha-tempo.png"),
              },
              {
                id: "mapa",
                title: "Mapa do Saque na Europa",
                description: "Geografia do saque nazista com valores saqueados por país",
                image: require("@/assets/images/wwii-mapa-europa.png"),
              },
              {
                id: "balanco",
                title: "Balanço Final",
                description: "Déficit de 293 bilhões de marcos: gastos militares vs recursos saqueados",
                image: require("@/assets/images/wwii-balanco-final.png"),
              },
            ]}
          />
        )}

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

        {getQuizForArticle(id || "").length > 0 && (
          <ThemedView style={[styles.quizSection, { backgroundColor: cardBg, borderColor }]}>
            <ThemedView style={styles.quizHeader}>
              <ThemedView>
                <ThemedText type="subtitle" style={styles.sectionHeader}>
                  Teste seus conhecimentos
                </ThemedText>
                <ThemedText style={[styles.quizSubtitle, { color: textSecondary }]}>
                  {getQuizForArticle(id || "").length} quest\u00f5es sobre este artigo
                </ThemedText>
              </ThemedView>
              <IconSymbol name="checkmark.seal.fill" size={32} color={tintColor} />
            </ThemedView>

            {hasCompletedQuiz(id || "") && (
              <ThemedView style={[styles.quizScore, { backgroundColor: borderColor }]}>
                <IconSymbol name="trophy.fill" size={20} color={tintColor} />
                <ThemedText style={styles.quizScoreText}>
                  \u00daltima pontua\u00e7\u00e3o: {getScorePercentage(id || "")}%
                </ThemedText>
              </ThemedView>
            )}

            <Pressable
              onPress={() => router.push(`/quiz/${id}` as any)}
              style={[styles.quizButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.quizButtonText}>
                {hasCompletedQuiz(id || "") ? "Refazer Quiz" : "Iniciar Quiz"}
              </ThemedText>
              <IconSymbol name="arrow.right" size={20} color="#fff" />
            </Pressable>
          </ThemedView>
        )}

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

      {/* Player de Áudio Flutuante */}
      {(audioHook.audioState.isPlaying || audioHook.audioState.isPaused) && (
        <AudioPlayer
          audioState={audioHook.audioState}
          onPlay={audioHook.play}
          onPause={audioHook.pause}
          onStop={audioHook.stop}
          onRateChange={audioHook.setRate}
          onSkipForward={audioHook.skipForward}
          onSkipBackward={audioHook.skipBackward}
        />
      )}

      {/* Modal de Bookmarks */}
      {showBookmarks && (
        <ThemedView style={StyleSheet.absoluteFill}>
          <ArticleBookmarks
            articleId={article.id}
            articleTitle={article.title}
            onClose={() => setShowBookmarks(false)}
            onBookmarkUpdated={syncEnabled ? syncBookmark : undefined}
            onBookmarkDeleted={syncEnabled ? deleteBookmarkOnServer : undefined}
          />
        </ThemedView>
      )}
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
  quizSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  quizSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  quizScore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  quizScoreText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  quizButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  partIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  partIndicatorText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  partDots: {
    flexDirection: "row",
    gap: 8,
  },
  partDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  partNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 32,
    marginBottom: 16,
  },
  partNavButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  partNavButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  summaryModeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
  },
  summaryModeText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  summarySection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  summaryText: {
    marginTop: 8,
    lineHeight: 22,
  },
});
