import { useRouter, Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRanking } from "@/hooks/use-ranking";
import { useAuth } from "@/hooks/use-auth";

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { userScore, leaderboard, userRank, getRankBadge, getRankTitle } = useRanking(user?.openId);

  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tintColor = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Ranking",
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
            Ranking Global
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Compete com outros leitores
          </ThemedText>
        </ThemedView>

        {userScore && (
          <ThemedView style={[styles.userCard, { backgroundColor: tintColor }]}>
            <ThemedView style={styles.userCardHeader}>
              <ThemedText style={styles.userCardRank}>
                {getRankBadge(userRank)}
              </ThemedText>
              <ThemedView style={styles.userCardInfo}>
                <ThemedText style={styles.userCardName}>Sua Posição</ThemedText>
                <ThemedText style={styles.userCardTitle}>
                  {getRankTitle(userScore.score)}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.userCardScore}>{userScore.score}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.userCardStats}>
              <ThemedView style={styles.statItem}>
                <IconSymbol name="book.fill" size={16} color="#fff" />
                <ThemedText style={styles.statText}>{userScore.articlesRead}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <IconSymbol name="trophy.fill" size={16} color="#fff" />
                <ThemedText style={styles.statText}>{userScore.badgesUnlocked}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <IconSymbol name="bookmark.fill" size={16} color="#fff" />
                <ThemedText style={styles.statText}>{userScore.highlightsCount}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Top Leitores
          </ThemedText>
          {leaderboard.slice(0, 100).map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = user?.openId === entry.userId;

            return (
              <ThemedView
                key={entry.userId}
                style={[
                  styles.leaderboardCard,
                  { backgroundColor: cardBg, borderColor },
                  isCurrentUser && styles.currentUserCard,
                ]}
              >
                <ThemedView style={styles.rankBadge}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.rankText,
                      rank <= 3 && { fontSize: 20, lineHeight: 26 },
                    ]}
                  >
                    {getRankBadge(rank)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.leaderboardInfo}>
                  <ThemedView style={styles.leaderboardHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.leaderboardName}>
                      {isCurrentUser ? "Você" : entry.userName}
                    </ThemedText>
                    {isCurrentUser && (
                      <ThemedView style={[styles.youBadge, { backgroundColor: tintColor }]}>
                        <ThemedText style={styles.youBadgeText}>VOCÊ</ThemedText>
                      </ThemedView>
                    )}
                  </ThemedView>
                  <ThemedText style={[styles.leaderboardTitle, { color: textSecondary }]}>
                    {getRankTitle(entry.score)}
                  </ThemedText>
                  <ThemedView style={styles.leaderboardStats}>
                    <ThemedView style={styles.miniStat}>
                      <IconSymbol name="book.fill" size={14} color={textSecondary} />
                      <ThemedText style={[styles.miniStatText, { color: textSecondary }]}>
                        {entry.articlesRead}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.miniStat}>
                      <IconSymbol name="trophy.fill" size={14} color={textSecondary} />
                      <ThemedText style={[styles.miniStatText, { color: textSecondary }]}>
                        {entry.badgesUnlocked}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <ThemedText type="title" style={[styles.scoreText, { color: tintColor }]}>
                  {entry.score}
                </ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>

        {leaderboard.length === 0 && (
          <ThemedView style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText style={styles.emptyText}>
              Seja o primeiro no ranking! Leia artigos e desbloqueie conquistas.
            </ThemedText>
          </ThemedView>
        )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  userCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  userCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userCardRank: {
    fontSize: 32,
    lineHeight: 40,
    marginRight: 16,
  },
  userCardInfo: {
    flex: 1,
  },
  userCardName: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  userCardTitle: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "bold",
  },
  userCardScore: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "bold",
  },
  userCardStats: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 16,
  },
  leaderboardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  currentUserCard: {
    borderWidth: 2,
  },
  rankBadge: {
    width: 48,
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    lineHeight: 22,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  leaderboardName: {
    fontSize: 16,
    lineHeight: 22,
  },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    color: "#fff",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "bold",
  },
  leaderboardTitle: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  leaderboardStats: {
    flexDirection: "row",
    gap: 12,
  },
  miniStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  miniStatText: {
    fontSize: 12,
    lineHeight: 18,
  },
  scoreText: {
    fontSize: 24,
    lineHeight: 32,
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
