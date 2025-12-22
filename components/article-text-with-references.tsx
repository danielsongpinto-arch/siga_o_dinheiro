import React from "react";
import { Text, Pressable, StyleSheet, Linking } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";

interface ArticleTextWithReferencesProps {
  content: string;
  style?: any;
  onReferencePress?: (refNumber: number) => void;
}

/**
 * Componente que renderiza texto de artigo com suporte a referências clicáveis.
 * Detecta citações no formato [1], [2], etc. e as transforma em links clicáveis.
 */
export function ArticleTextWithReferences({
  content,
  style,
  onReferencePress,
}: ArticleTextWithReferencesProps) {
  const tintColor = useThemeColor({}, "tint");

  // Regex para detectar citações [1], [2], etc.
  const referenceRegex = /\[(\d+)\]/g;

  // Função para processar o texto e criar elementos clicáveis
  const renderTextWithReferences = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = referenceRegex.exec(content)) !== null) {
      const refNumber = parseInt(match[1], 10);
      const matchIndex = match.index;

      // Adicionar texto antes da referência
      if (matchIndex > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={style}>
            {content.substring(lastIndex, matchIndex)}
          </Text>
        );
      }

      // Adicionar referência clicável
      parts.push(
        <Pressable
          key={`ref-${refNumber}-${matchIndex}`}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (onReferencePress) {
              onReferencePress(refNumber);
            }
          }}
          style={({ pressed }) => [
            styles.referenceLink,
            pressed && styles.referenceLinkPressed,
          ]}
        >
          <Text style={[styles.referenceLinkText, { color: tintColor }]}>
            [{refNumber}]
          </Text>
        </Pressable>
      );

      lastIndex = matchIndex + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < content.length) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={style}>
          {content.substring(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : <Text style={style}>{content}</Text>;
  };

  return <Text style={style}>{renderTextWithReferences()}</Text>;
}

/**
 * Componente para renderizar a seção de referências com links externos
 */
interface ReferenceListProps {
  content: string;
}

export function ReferenceList({ content }: ReferenceListProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Extrair seção de referências
  const referencesMatch = content.match(/## Fontes e Referências\n\n([\s\S]+?)(?:\n\n---|\n\n\*|$)/);
  
  if (!referencesMatch) {
    return null;
  }

  const referencesText = referencesMatch[1];
  
  // Regex para detectar referências individuais
  // Formato: [1] **Título**\nDescrição\nURL
  const referenceRegex = /\[(\d+)\]\s+\*\*(.+?)\*\*\s+(.+?)\s+(https?:\/\/[^\s]+)/g;
  
  const references: Array<{
    number: number;
    title: string;
    description: string;
    url: string;
  }> = [];

  let match;
  while ((match = referenceRegex.exec(referencesText)) !== null) {
    references.push({
      number: parseInt(match[1], 10),
      title: match[2],
      description: match[3],
      url: match[4],
    });
  }

  const handleLinkPress = async (url: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <>
      {references.map((ref) => (
        <Pressable
          key={ref.number}
          onPress={() => handleLinkPress(ref.url)}
          style={({ pressed }) => [
            styles.referenceItem,
            pressed && styles.referenceItemPressed,
          ]}
        >
          <Text style={[styles.referenceNumber, { color: tintColor }]}>
            [{ref.number}]
          </Text>
          <Text style={[styles.referenceTitle, { color: textColor }]}>
            {ref.title}
          </Text>
          <Text style={[styles.referenceDescription, { color: textSecondary }]}>
            {ref.description}
          </Text>
          <Text style={[styles.referenceUrl, { color: tintColor }]} numberOfLines={1}>
            {ref.url}
          </Text>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  referenceLink: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  referenceLinkPressed: {
    opacity: 0.6,
  },
  referenceLinkText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  referenceItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  referenceItemPressed: {
    opacity: 0.7,
  },
  referenceNumber: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  referenceTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  referenceDescription: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  referenceUrl: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
