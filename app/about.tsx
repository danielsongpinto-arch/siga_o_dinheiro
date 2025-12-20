import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const cardBg = useThemeColor({}, "cardBackground");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Sobre o App",
          headerBackTitle: "Perfil",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.title}>
            Siga o Dinheiro
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Análise de fatos através da perspectiva financeira
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Nossa Missão
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            O aplicativo "Siga o Dinheiro" tem como objetivo revelar os interesses financeiros por
            trás de eventos históricos e atuais. Acreditamos que compreender as motivações
            econômicas dos autores de fatos importantes é essencial para uma análise completa e
            crítica da realidade.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Por Que Seguir o Dinheiro?
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            O interesse financeiro próprio é capaz de gerar consequências em ações realizadas que
            nem sempre são divulgadas e contadas dessa forma. Ao seguir o rastro do dinheiro,
            podemos entender:
          </ThemedText>
          <ThemedView style={styles.bulletList}>
            <ThemedText style={styles.bullet}>
              • Quem se beneficia financeiramente de determinados eventos
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Como interesses econômicos influenciam decisões aparentemente políticas ou sociais
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Por que certos fatos são apresentados de determinadas maneiras pela mídia
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Quais são as verdadeiras motivações por trás de ações de governos e corporações
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            O Conceito de Ciclo Financeiro
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Cada evento analisado no aplicativo é compreendido através de um ciclo financeiro com
            três fases distintas:
          </ThemedText>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Início
            </ThemedText>
            <ThemedText style={styles.cycleDescription}>
              Identificação dos interesses financeiros iniciais, estabelecimento de estruturas e
              posicionamento dos atores que se beneficiarão do evento.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Meio
            </ThemedText>
            <ThemedText style={styles.cycleDescription}>
              Período de acumulação de lucros, expansão de operações e consolidação de ganhos
              financeiros durante o desenrolar dos eventos.
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.cycleItem}>
            <ThemedText type="defaultSemiBold" style={styles.cyclePhase}>
              Fim
            </ThemedText>
            <ThemedText style={styles.cycleDescription}>
              Conclusão do ciclo com distribuição de lucros e, frequentemente, o início de um novo
              ciclo baseado nas estruturas estabelecidas no anterior.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Nossa Abordagem
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Cada artigo publicado no aplicativo apresenta:
          </ThemedText>
          <ThemedView style={styles.bulletList}>
            <ThemedText style={styles.bullet}>
              • Análise detalhada dos fatos históricos ou atuais
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Identificação dos principais autores e seus papéis
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Mapeamento dos interesses financeiros específicos de cada autor
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Descrição do ciclo financeiro completo (início, meio e fim)
            </ThemedText>
            <ThemedText style={styles.bullet}>
              • Conexões entre eventos aparentemente isolados
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Objetivo Final
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Nosso objetivo não é promover teorias conspiratórias, mas sim fornecer uma análise
            baseada em fatos sobre como interesses financeiros moldam eventos importantes. Ao
            compreender essas dinâmicas, os leitores podem desenvolver uma visão mais crítica e
            informada sobre o mundo ao seu redor.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Acreditamos que seguir o dinheiro é uma ferramenta essencial para entender a realidade
            de forma mais completa e menos ingênua.
          </ThemedText>
        </ThemedView>
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
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
    marginTop: 8,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 8,
  },
  cycleItem: {
    marginTop: 16,
  },
  cyclePhase: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  cycleDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
