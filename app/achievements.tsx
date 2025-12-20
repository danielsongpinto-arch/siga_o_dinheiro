import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAchievements } from "@/hooks/use-achievements";
import { BADGES } from "@/data/badges";

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { isBadgeUnlocked, getBadgeProgress, unlockedBadges } = useAchievements();

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  const badgesByType = {
    reading: BADGES.filter((b) => b.type === "reading"),
    exploration: BADGES.filter((b) => b.type === "exploration"),
    engagement: BADGES.filter((b) => b.type === "engagement"),
    special: BADGES.filter((b) => b.type === "special"),
  };

  const renderBadge = (badge: typeof BADGES[0]) => {
    const unlocked = isBadgeUnlocked(badge.id);
    const progress = getBadgeProgress(badge);
    const percentage = (progress / badge.requirement) * 100;

    return (
      <ThemedView
        key={badge.id}
        style={[
          styles.badgeCard,
          { backgroundColor: cardBg, borderColor },
          unlocked && styles.badgeUnlocked,
        ]}
      >
        <ThemedView
          style={[
            styles.badgeIcon,
            { backgroundColor: unlocked ? tintColor : borderColor },
          ]}
        >
          <IconSymbol
            name={badge.icon as any}
            size={32}
            color={unlocked ? "#fff" : textSecondary}
          />
        </ThemedView>
        <ThemedView style={styles.badgeInfo}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.badgeTitle, !unlocked && { opacity: 0.5 }]}
          >
            {badge.title}
          </ThemedText>
          <ThemedText
            style={[styles.badgeDescription, { color: textSecondary }]}
          >
            {badge.description}
          </ThemedText>
          {!unlocked && (
            <>
              <ThemedView style={[styles.progressBar, { backgroundColor: borderColor }]}>
                <ThemedView
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%`, backgroundColor: tintColor },
                  ]}
                />
              </ThemedView>
              <ThemedText style={[styles.progressText, { color: textSecondary }]}>
                {progress}/{badge.requirement}
              </ThemedText>
            </>
          )}
          {unlocked && (
            <ThemedView style={styles.unlockedBadge}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={tintColor} />
              <ThemedText style={[styles.unlockedText, { color: tintColor }]}>
                Desbloqueado
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Conquistas",
          headerBackTitle: "Voltar",
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
          },
        ]}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Suas Conquistas
          </ThemedText>
          <ThemedView style={[styles.statsCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              {unlockedBadges.length}/{BADGES.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Badges Desbloqueados</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 Leitura
          </ThemedText>
          {badgesByType.reading.map(renderBadge)}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🗺️ Exploração
          </ThemedText>
          {badgesByType.exploration.map(renderBadge)}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💬 Engajamento
          </ThemedText>
          {badgesByType.engagement.map(renderBadge)}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ⭐ Especiais
          </ThemedText>
          {badgesByType.special.map(renderBadge)}
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 48,
    lineHeight: 56,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  badgeCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 16,
  },
  badgeUnlocked: {
    borderWidth: 2,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    lineHeight: 18,
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unlockedText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
