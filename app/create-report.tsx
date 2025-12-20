import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";
import { useHighlights } from "@/hooks/use-highlights";
import { ARTICLES, THEMES } from "@/data/mock-data";

export default function CreateReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();
  const { highlights } = useHighlights();
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState("Relatório de Análise Financeira");
  const [reportNotes, setReportNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");

  const toggleArticle = (articleId: string) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleGenerateReport = async () => {
    if (selectedArticles.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um artigo para gerar o relatório.");
      return;
    }

    setIsGenerating(true);

    try {
      const articles = selectedArticles
        .map((id) => ARTICLES.find((a) => a.id === id))
        .filter(Boolean);

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            h1 {
              color: #D4AF37;
              font-size: 32px;
              margin-bottom: 10px;
              border-bottom: 3px solid #D4AF37;
              padding-bottom: 10px;
            }
            h2 {
              color: #D4AF37;
              font-size: 24px;
              margin-top: 40px;
              margin-bottom: 15px;
              border-left: 4px solid #D4AF37;
              padding-left: 12px;
            }
            h3 {
              color: #555;
              font-size: 18px;
              margin-top: 25px;
              margin-bottom: 10px;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin-bottom: 30px;
            }
            .article-section {
              margin-bottom: 50px;
              page-break-inside: avoid;
            }
            .author {
              background: #f5f5f5;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
            }
            .author-name {
              font-weight: 600;
              color: #D4AF37;
              font-size: 16px;
            }
            .author-role {
              color: #666;
              font-size: 14px;
              margin-top: 4px;
            }
            .financial-interest {
              margin-top: 8px;
              padding: 10px;
              background: #fff;
              border-left: 3px solid #D4AF37;
              font-size: 14px;
            }
            .cycle {
              background: #f9f9f9;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
            }
            .cycle-phase {
              font-weight: 600;
              color: #D4AF37;
              margin-bottom: 5px;
            }
            .highlight {
              background: #fff9e6;
              padding: 15px;
              margin: 15px 0;
              border-left: 4px solid #D4AF37;
              border-radius: 4px;
            }
            .highlight-text {
              font-style: italic;
              margin-bottom: 8px;
            }
            .highlight-note {
              font-size: 14px;
              color: #666;
            }
            .notes {
              background: #f0f8ff;
              padding: 20px;
              margin: 30px 0;
              border-radius: 8px;
              border: 1px solid #d0e8ff;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #eee;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .article-section {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <div class="meta">
            Gerado em ${new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
      `;

      if (reportNotes) {
        htmlContent += `
          <div class="notes">
            <h3>Notas Pessoais</h3>
            <p>${reportNotes.replace(/\n/g, "<br>")}</p>
          </div>
        `;
      }

      articles.forEach((article, index) => {
        if (!article) return;
        const theme = THEMES.find((t) => t.id === article.themeId);
        const articleHighlights = highlights.filter((h) => h.articleId === article.id);

        htmlContent += `
          <div class="article-section">
            <h2>Artigo ${index + 1}: ${article.title}</h2>
            <div class="meta">
              Tema: ${theme?.title || "N/A"} | 
              Data: ${new Date(article.date).toLocaleDateString("pt-BR")}
            </div>

            <h3>Autores e Interesses Financeiros</h3>
        `;

        article.authors.forEach((author) => {
          htmlContent += `
            <div class="author">
              <div class="author-name">${author.name}</div>
              <div class="author-role">${author.role}</div>
              <div class="financial-interest">
                <strong>Interesse Financeiro:</strong> ${author.financialInterest}
              </div>
            </div>
          `;
        });

        htmlContent += `
            <h3>Ciclo Financeiro</h3>
            <div class="cycle">
              <div class="cycle-phase">Início</div>
              <p>${article.financialCycle.inicio}</p>
            </div>
            <div class="cycle">
              <div class="cycle-phase">Meio</div>
              <p>${article.financialCycle.meio}</p>
            </div>
            <div class="cycle">
              <div class="cycle-phase">Fim</div>
              <p>${article.financialCycle.fim}</p>
            </div>
        `;

        if (articleHighlights.length > 0) {
          htmlContent += `<h3>Marcadores</h3>`;
          articleHighlights.forEach((highlight) => {
            htmlContent += `
              <div class="highlight">
                <div class="highlight-text">"${highlight.text}"</div>
                ${
                  highlight.note
                    ? `<div class="highlight-note"><strong>Nota:</strong> ${highlight.note}</div>`
                    : ""
                }
              </div>
            `;
          });
        }

        htmlContent += `</div>`;
      });

      htmlContent += `
          <div class="footer">
            Relatório gerado pelo aplicativo Siga o Dinheiro<br>
            Análise de fatos através da visão financeira dos participantes
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Compartilhar Relatório",
        });
      }

      Alert.alert("Sucesso", "Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Error generating report:", error);
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Criar Relatório",
          headerStyle: {
            backgroundColor: tintColor,
          },
          headerTintColor: "#fff",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Título do Relatório
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: cardBg, borderColor, color: textColor },
            ]}
            value={reportTitle}
            onChangeText={setReportTitle}
            placeholder="Digite o título do relatório"
            placeholderTextColor={secondaryText}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Notas Pessoais (opcional)
          </ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: cardBg, borderColor, color: textColor },
            ]}
            value={reportNotes}
            onChangeText={setReportNotes}
            placeholder="Adicione suas observações e análises pessoais..."
            placeholderTextColor={secondaryText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Selecionar Artigos
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryText }]}>
            Escolha os artigos que deseja incluir no relatório
          </ThemedText>

          {ARTICLES.map((article) => {
            const theme = THEMES.find((t) => t.id === article.themeId);
            const isSelected = selectedArticles.includes(article.id);
            const isFavorited = favorites.includes(article.id);

            return (
              <Pressable
                key={article.id}
                onPress={() => toggleArticle(article.id)}
                style={[
                  styles.articleItem,
                  { backgroundColor: cardBg, borderColor },
                  isSelected && { borderColor: tintColor, borderWidth: 2 },
                ]}
              >
                <ThemedView style={styles.articleContent}>
                  <ThemedView style={styles.articleHeader}>
                    <ThemedView style={[styles.checkbox, { borderColor }]}>
                      {isSelected && (
                        <IconSymbol name="checkmark" size={18} color={tintColor} />
                      )}
                    </ThemedView>
                    <ThemedView style={styles.articleInfo}>
                      <ThemedText style={[styles.themeText, { color: tintColor }]}>
                        {theme?.title || "Tema"}
                      </ThemedText>
                      <ThemedText type="defaultSemiBold" numberOfLines={2}>
                        {article.title}
                      </ThemedText>
                      {isFavorited && (
                        <ThemedView style={styles.favoriteBadge}>
                          <IconSymbol name="heart.fill" size={12} color={tintColor} />
                          <ThemedText style={[styles.favoriteText, { color: tintColor }]}>
                            Favorito
                          </ThemedText>
                        </ThemedView>
                      )}
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            );
          })}
        </ThemedView>

        <Pressable
          onPress={handleGenerateReport}
          disabled={isGenerating || selectedArticles.length === 0}
          style={[
            styles.generateButton,
            { backgroundColor: tintColor },
            (isGenerating || selectedArticles.length === 0) && styles.generateButtonDisabled,
          ]}
        >
          <IconSymbol
            name="doc.text.fill"
            size={24}
            color="#fff"
          />
          <ThemedText style={styles.generateButtonText}>
            {isGenerating
              ? "Gerando Relatório..."
              : `Gerar Relatório (${selectedArticles.length} ${
                  selectedArticles.length === 1 ? "artigo" : "artigos"
                })`}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  articleItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  articleInfo: {
    flex: 1,
    gap: 4,
  },
  themeText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  favoriteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  favoriteText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
  },
});
