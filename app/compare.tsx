import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useComparison } from "@/hooks/use-comparison";
import { ARTICLES, THEMES } from "@/data/mock-data";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function CompareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedArticleIds, clearComparison } = useComparison();
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const secondaryText = useThemeColor({}, "textSecondary");

  const articles = selectedArticleIds
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean);

  const handleClear = () => {
    Alert.alert(
      "Limpar Comparação",
      "Deseja remover todos os artigos da comparação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            clearComparison();
            router.back();
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    // Gerar texto de comparação
    let comparisonText = "COMPARAÇÃO DE INTERESSES FINANCEIROS\n\n";
    
    articles.forEach((article, index) => {
      if (!article) return;
      const theme = THEMES.find((t) => t.id === article.themeId);
      
      comparisonText += `\n${"=".repeat(50)}\n`;
      comparisonText += `ARTIGO ${index + 1}: ${article.title}\n`;
      comparisonText += `Tema: ${theme?.title || "N/A"}\n`;
      comparisonText += `Data: ${new Date(article.date).toLocaleDateString("pt-BR")}\n`;
      comparisonText += `${"=".repeat(50)}\n\n`;
      
      comparisonText += `AUTORES E INTERESSES:\n`;
      article.authors.forEach((author) => {
        comparisonText += `\n• ${author.name} (${author.role})\n`;
        comparisonText += `  Interesse Financeiro: ${author.financialInterest}\n`;
      });
      
      comparisonText += `\n\nCICLO FINANCEIRO:\n`;
      comparisonText += `Início: ${article.financialCycle.inicio}\n`;
      comparisonText += `Meio: ${article.financialCycle.meio}\n`;
      comparisonText += `Fim: ${article.financialCycle.fim}\n`;
    });
    
    comparisonText += `\n\n${"=".repeat(50)}\n`;
    comparisonText += `Gerado por Siga o Dinheiro em ${new Date().toLocaleString("pt-BR")}\n`;

    // Salvar em arquivo temporário e compartilhar
    const fs = require("expo-file-system");
    const fileName = `comparacao_${Date.now()}.txt`;
    const filePath = `${fs.documentDirectory}${fileName}`;
    
    try {
      await fs.writeAsStringAsync(filePath, comparisonText);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/plain",
          dialogTitle: "Compartilhar Comparação",
        });
      } else {
        Alert.alert("Sucesso", "Comparação salva em: " + filePath);
      }
    } catch (error) {
      console.error("Error exporting comparison:", error);
      Alert.alert("Erro", "Não foi possível exportar a comparação.");
    }
  };

  if (articles.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Comparar Artigos",
            headerStyle: {
              backgroundColor: tintColor,
            },
            headerTintColor: "#fff",
          }}
        />
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol name="doc.text.magnifyingglass" size={64} color={borderColor} />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Nenhum artigo selecionado
          </ThemedText>
          <ThemedText style={[styles.emptyText, { color: secondaryText }]}>
            Selecione até 3 artigos para comparar seus autores e interesses financeiros.
          </ThemedText>
          <WebClickable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: tintColor }]}
          >
            <ThemedText style={styles.backButtonText}>Voltar</ThemedText>
          </WebClickable>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Comparar Artigos",
          headerStyle: {
            backgroundColor: tintColor,
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <ThemedView style={styles.headerButtons}>
              <WebClickable onPress={handleExport} style={styles.headerButton}>
                <IconSymbol name="square.and.arrow.up" size={22} color="#fff" />
              </WebClickable>
              <WebClickable onPress={handleClear} style={styles.headerButton}>
                <IconSymbol name="trash.fill" size={22} color="#fff" />
              </WebClickable>
            </ThemedView>
          ),
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
        <ThemedText type="title" style={styles.title}>
          Comparação de Interesses
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: secondaryText }]}>
          Análise comparativa dos interesses financeiros e ciclos econômicos
        </ThemedText>

        {articles.map((article, index) => {
          if (!article) return null;
          const theme = THEMES.find((t) => t.id === article.themeId);

          return (
            <ThemedView
              key={article.id}
              style={[styles.articleSection, { backgroundColor: cardBg, borderColor }]}
            >
              <ThemedView style={styles.articleHeader}>
                <ThemedView style={[styles.articleNumber, { backgroundColor: tintColor }]}>
                  <ThemedText style={styles.articleNumberText}>{index + 1}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.articleHeaderText}>
                  <ThemedText type="defaultSemiBold" style={styles.themeText}>
                    {theme?.title || "Tema"}
                  </ThemedText>
                  <ThemedText type="subtitle" numberOfLines={2}>
                    {article.title}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Autores e Interesses
                </ThemedText>
                {article.authors.map((author, idx) => (
                  <ThemedView key={idx} style={styles.authorItem}>
                    <ThemedText type="defaultSemiBold">{author.name}</ThemedText>
                    <ThemedText style={[styles.roleText, { color: secondaryText }]}>
                      {author.role}
                    </ThemedText>
                    <ThemedView style={[styles.interestBox, { backgroundColor: borderColor }]}>
                      <ThemedText style={styles.interestText}>
                        {author.financialInterest}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Ciclo Financeiro
                </ThemedText>
                <ThemedView style={styles.cycleItem}>
                  <ThemedText type="defaultSemiBold">Início</ThemedText>
                  <ThemedText style={styles.cycleText}>
                    {article.financialCycle.inicio}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.cycleItem}>
                  <ThemedText type="defaultSemiBold">Meio</ThemedText>
                  <ThemedText style={styles.cycleText}>{article.financialCycle.meio}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.cycleItem}>
                  <ThemedText type="defaultSemiBold">Fim</ThemedText>
                  <ThemedText style={styles.cycleText}>{article.financialCycle.fim}</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          );
        })}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16,
    marginRight: 8,
  },
  headerButton: {
    padding: 4,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  articleSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  articleNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  articleNumberText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
  },
  articleHeaderText: {
    flex: 1,
    gap: 4,
  },
  themeText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  authorItem: {
    marginBottom: 16,
  },
  roleText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  interestBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  interestText: {
    fontSize: 14,
    lineHeight: 20,
  },
  cycleItem: {
    marginBottom: 12,
  },
  cycleText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    opacity: 0.8,
  },
});
