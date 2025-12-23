import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WebClickable } from "@/components/web-clickable";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFavorites } from "@/hooks/use-favorites";
import { useNotifications } from "@/hooks/use-notifications";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useAutoTheme } from "@/hooks/use-auto-theme";
import { useFontSize, type FontSizeOption } from "@/hooks/use-font-size";
import type { ThemePreference } from "@/hooks/use-theme-preference";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const { notificationsEnabled, loading: notifLoading, toggleNotifications } = useNotifications();
  const { preference: themePreference, updatePreference: updateThemePreference } =
    useThemePreference();
  const { autoThemeEnabled, sunTimes, toggleAutoTheme } = useAutoTheme();
  const { fontSize, updateFontSize } = useFontSize();
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
            <WebClickable
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
            </WebClickable>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.themeSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Aparência
        </ThemedText>
        <ThemedView style={[styles.themeCard, { backgroundColor: cardBg, borderColor }]}>
          {(["light", "dark", "auto"] as ThemePreference[]).map((theme) => {
            const isSelected = themePreference === theme;
            const themeLabels = {
              light: "Claro",
              dark: "Escuro",
              auto: "Automático",
            };
            const themeIcons = {
              light: "sun.max.fill",
              dark: "moon.fill",
              auto: "circle.lefthalf.filled",
            };

            return (
              <WebClickable
                key={theme}
                onPress={() => updateThemePreference(theme)}
                style={[
                  styles.themeOption,
                  { borderColor },
                  isSelected && { backgroundColor: tintColor, borderColor: tintColor },
                ]}
              >
                <IconSymbol
                  name={themeIcons[theme] as any}
                  size={24}
                  color={isSelected ? "#fff" : tintColor}
                />
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.themeLabel, isSelected && { color: "#fff" }]}
                >
                  {themeLabels[theme]}
                </ThemedText>
              </WebClickable>
            );
          })}
        </ThemedView>
        
        {themePreference === "auto" && (
          <ThemedView style={[styles.autoThemeCard, { backgroundColor: cardBg, borderColor }]}>
            <ThemedView style={styles.autoThemeHeader}>
              <ThemedView>
                <ThemedText type="defaultSemiBold">Modo Autom\u00e1tico Avan\u00e7ado</ThemedText>
                <ThemedText style={[styles.autoThemeDescription, { color: borderColor }]}>
                  Ajusta o tema baseado no nascer/p\u00f4r do sol
                </ThemedText>
              </ThemedView>
              <WebClickable
                onPress={() => toggleAutoTheme(!autoThemeEnabled)}
                style={[
                  styles.toggle,
                  { borderColor },
                  autoThemeEnabled && { backgroundColor: tintColor, borderColor: tintColor },
                ]}
              >
                <ThemedView
                  style={[
                    styles.toggleThumb,
                    { backgroundColor: autoThemeEnabled ? "#fff" : borderColor },
                    autoThemeEnabled && styles.toggleThumbActive,
                  ]}
                />
              </WebClickable>
            </ThemedView>
            {autoThemeEnabled && sunTimes && (
              <ThemedView style={styles.sunTimesInfo}>
                <ThemedView style={styles.sunTimeItem}>
                  <IconSymbol name="sunrise.fill" size={16} color={tintColor} />
                  <ThemedText style={styles.sunTimeText}>
                    {sunTimes.sunrise.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.sunTimeItem}>
                  <IconSymbol name="sunset.fill" size={16} color={tintColor} />
                  <ThemedText style={styles.sunTimeText}>
                    {sunTimes.sunset.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Tamanho da Fonte
        </ThemedText>
        <ThemedView style={styles.fontSizeOptions}>
          {(["small", "medium", "large", "extra-large"] as FontSizeOption[]).map((size) => (
            <WebClickable
              key={size}
              onPress={() => updateFontSize(size)}
              style={[
                styles.fontSizeButton,
                { borderColor },
                fontSize === size && { backgroundColor: tintColor, borderColor: tintColor },
              ]}
            >
              <ThemedText
                style={[
                  styles.fontSizeButtonText,
                  fontSize === size && { color: "#fff" },
                ]}
              >
                {size === "small" && "A"}
                {size === "medium" && "A"}
                {size === "large" && "A"}
                {size === "extra-large" && "A"}
              </ThemedText>
              <ThemedText
                style={[
                  styles.fontSizeLabel,
                  fontSize === size && { color: "#fff" },
                ]}
              >
                {size === "small" && "Pequeno"}
                {size === "medium" && "M\u00e9dio"}
                {size === "large" && "Grande"}
                {size === "extra-large" && "Extra"}
              </ThemedText>
            </WebClickable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.actionsSection}>
        <WebClickable
          onPress={() => router.push("/leaderboard" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Ranking
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/achievements" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="trophy.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Conquistas
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/series" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="book.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              S\u00e9ries Tem\u00e1ticas
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/statistics" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="chart.bar.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Estatísticas
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/highlights" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="bookmark.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Marcadores
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/all-notes" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="pencil" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Minhas Notas
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/flashcards" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="square.stack.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Modo de Estudo
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/create-report" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="doc.text.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Criar Relat\u00f3rio
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={() => router.push("/reading-history" as any)}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="clock.fill" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Histórico de Leitura
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>
        <WebClickable
          onPress={handleAbout}
          style={[
            styles.actionButton,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <ThemedView style={styles.actionContent}>
            <IconSymbol name="info.circle" size={24} color={tintColor} />
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Sobre o App
            </ThemedText>
          </ThemedView>
          <IconSymbol name="chevron.right" size={20} color={borderColor} />
        </WebClickable>

        {isAuthenticated && (
          <WebClickable
            onPress={handleLogout}
            style={[
              styles.actionButton,
              styles.logoutButton,
              { borderColor },
            ]}
          >
            <ThemedView style={styles.actionContent}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#FF3B30" />
              <ThemedText type="defaultSemiBold" style={styles.logoutText}>
                Sair
              </ThemedText>
            </ThemedView>
          </WebClickable>
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
  section: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
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
  themeSection: {
    marginBottom: 32,
  },
  themeCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
  },
  themeOption: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionPressed: {
    opacity: 0.7,
  },
  themeLabel: {
    fontSize: 14,
    lineHeight: 20,
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
  autoThemeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  autoThemeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  autoThemeDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  sunTimesInfo: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  sunTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sunTimeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  fontSizeOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  fontSizeButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  fontSizeButtonText: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  fontSizeLabel: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
  },
});
