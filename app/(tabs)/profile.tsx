import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const tintColor = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");

  const handleAbout = () => {
    router.push("/about" as any);
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: logout },
      ],
    );
  };

  return (
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
          Perfil
        </ThemedText>
      </ThemedView>

      {isAuthenticated && user ? (
        <ThemedView style={[styles.userCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="subtitle" style={styles.userName}>
            {user.name || user.email || "Usuário"}
          </ThemedText>
          {user.email && (
            <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          )}
        </ThemedView>
      ) : null}

      <ThemedView style={styles.statsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Estatísticas
        </ThemedText>
        <ThemedView style={[styles.statsCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              {favorites.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              {favorites.length === 1 ? "Artigo Favoritado" : "Artigos Favoritados"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.actionsSection}>
        <Pressable
          onPress={handleAbout}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
            pressed && styles.actionButtonPressed,
          ]}
        >
          <ThemedText type="defaultSemiBold">Sobre o App</ThemedText>
        </Pressable>

        {isAuthenticated && (
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.actionButton,
              styles.logoutButton,
              { borderColor },
              pressed && styles.actionButtonPressed,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.logoutText}>
              Sair
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </ScrollView>
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
    fontSize: 32,
    lineHeight: 40,
  },
  userCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
  },
  userName: {
    marginBottom: 4,
    fontSize: 20,
    lineHeight: 26,
  },
  userEmail: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    lineHeight: 26,
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
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
  actionsSection: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderColor: "#FF3B30",
  },
  logoutText: {
    color: "#FF3B30",
  },
});
