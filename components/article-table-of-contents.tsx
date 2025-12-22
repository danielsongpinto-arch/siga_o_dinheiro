import { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";

interface TableOfContentsProps {
  content: string;
  onSectionPress: (sectionIndex: number) => void;
  currentSection?: number;
}

interface Section {
  title: string;
  index: number;
  level: number; // 1 for "## Parte", 2 for "###"
}

export function ArticleTableOfContents({ content, onSectionPress, currentSection = 0 }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Extrair seções do conteúdo
  const sections: Section[] = [];
  const lines = content.split("\n");
  
  lines.forEach((line, index) => {
    if (line.startsWith("## Parte ")) {
      sections.push({
        title: line.replace("## ", ""),
        index: sections.length,
        level: 1,
      });
    }
  });

  if (sections.length === 0) {
    return null; // Não mostrar índice se não houver partes
  }

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const handleSectionPress = async (sectionIndex: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSectionPress(sectionIndex);
    setIsExpanded(false); // Fechar índice após seleção
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol 
            name="list.bullet" 
            size={20} 
            color={tintColor} 
          />
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Índice do Artigo
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.badgeText}>{sections.length}</ThemedText>
          </View>
        </View>
        <IconSymbol 
          name={isExpanded ? "chevron.up" : "chevron.down"} 
          size={20} 
          color={textSecondary} 
        />
      </Pressable>

      {isExpanded && (
        <ScrollView style={styles.sectionList} nestedScrollEnabled>
          {sections.map((section) => (
            <Pressable
              key={section.index}
              onPress={() => handleSectionPress(section.index)}
              style={[
                styles.sectionItem,
                section.index === currentSection && styles.sectionItemActive,
                { borderLeftColor: section.index === currentSection ? tintColor : "transparent" },
              ]}
            >
              <ThemedText
                style={[
                  styles.sectionText,
                  section.index === currentSection && { color: tintColor, fontWeight: "600" },
                ]}
              >
                {section.title}
              </ThemedText>
              {section.index === currentSection && (
                <IconSymbol name="arrow.right" size={16} color={tintColor} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionList: {
    maxHeight: 300,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingLeft: 16,
    borderLeftWidth: 3,
  },
  sectionItemActive: {
    backgroundColor: "rgba(0, 122, 255, 0.05)",
  },
  sectionText: {
    fontSize: 14,
    flex: 1,
  },
});
