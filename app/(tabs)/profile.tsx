import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";
import { useNotifications } from "@/hooks/use-notifications";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const { notificationsEnabled, loading: notifLoading, toggleNotifications } = useNotifications();
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

      <ThemedView style={styles.notificationsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Notificações
        </ThemedText>
        <ThemedView style={[styles.notificationCard, { backgroundColor: cardBg, borderColor }]}>
          <ThemedView style={styles.notificationRow}>
            <ThemedView style={styles.notificationInfo}>
              <ThemedText type="defaultSemiBold">Novos Artigos</ThemedText>
              <ThemedText style={styles.notificationDesc}>
                Receba notificações quando novos artigos forem publicados
              </ThemedText>
            </ThemedView>
            <Pressable
              onPress={() => toggleNotifications(!notificationsEnabled)}
              disabled={notifLoading}
              style={[
                styles.toggle,
                { borderColor },
                notificationsEnabled && { backgroundColor: tintColor, borderColor: tintColor },
              ]}
            >
              <ThemedView
                style={[
                  styles.toggleThumb,
                  { backgroundColor: notificationsEnabled ? "#fff" : borderColor },
                  notificationsEnabled && styles.toggleThumbActive,
                ]}
              />
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.actionsSection}>
        <Pressable
          onPress={() => router.push("/reading-history" as any)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
            pressed && styles.actionButtonPressed,
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="clock.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Histórico de Leitura
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </Pressable>
        <Pressable
          onPress={handleAbout}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
            pressed && styles.actionButtonPressed,
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="info.circle" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Sobre o App
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
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
            <ThemedView style={styles.actionContent}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#FF3B30" />
              <ThemedText type="defaultSemiBold" style={styles.logoutText}>
                Sair
              </ThemedText>
            </ThemedView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    lineHeight: 22,
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
  notificationsSection: {
    marginBottom: 32,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationDesc: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.7,
    marginTop: 4,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
});
