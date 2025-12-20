import { useThemePreference } from "./use-theme-preference";

export function useColorScheme() {
  const { effectiveTheme } = useThemePreference();
  return effectiveTheme ?? "light";
}
