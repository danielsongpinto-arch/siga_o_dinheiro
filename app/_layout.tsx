import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useOnboarding } from "@/hooks/use-onboarding";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/manus-runtime";
import { TabBarProvider } from "@/contexts/tab-bar-context";
// import { NightModeOverlay } from "@/components/night-mode-overlay"; // DESATIVADO TEMPORARIAMENTE PARA TESTE
import * as Notifications from "expo-notifications";
import { useScheduledDownloads } from "@/hooks/use-scheduled-downloads";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };
// Web iframe previewer cannot infer safe-area; default to zero until container sends metrics.

export const unstable_settings = {
  anchor: "onboarding",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loading: onboardingLoading } = useOnboarding();
  const { executeScheduledDownload } = useScheduledDownloads();
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  // Forçar tema escuro no DOM da web
  useEffect(() => {
    if (Platform.OS === "web") {
      console.log("[Theme Web] colorScheme:", colorScheme);
      const root = document.documentElement;
      if (colorScheme === "dark") {
        console.log("[Theme Web] Aplicando tema ESCURO");
        root.style.colorScheme = "dark";
        root.style.backgroundColor = "#000";
        document.body.style.backgroundColor = "#000";
      } else {
        console.log("[Theme Web] Aplicando tema CLARO");
        root.style.colorScheme = "light";
        root.style.backgroundColor = "#fff";
        document.body.style.backgroundColor = "#fff";
      }
    }
  }, [colorScheme]);

  // Listener para notificações de download agendado
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.scheduledDownloadId) {
        executeScheduledDownload(data.scheduledDownloadId as string);
      }
    });

    return () => subscription.remove();
  }, [executeScheduledDownload]);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  const providerInitialMetrics = useMemo(
    () => initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame },
    [initialFrame, initialInsets],
  );

  // Aguardar verificação de onboarding antes de renderizar
  if (onboardingLoading) {
    return null;
  }

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TabBarProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
              <Stack.Screen name="oauth/callback" options={{ headerShown: false }} />
            </Stack>
              {/* <NightModeOverlay /> */} {/* DESATIVADO TEMPORARIAMENTE PARA TESTE */}
              <StatusBar style="auto" />
            </ThemeProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </TabBarProvider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        <SafeAreaFrameContext.Provider value={frame}>
          <SafeAreaInsetsContext.Provider value={insets}>{content}</SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
      </SafeAreaProvider>
    );
  }

  return <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>;
}
