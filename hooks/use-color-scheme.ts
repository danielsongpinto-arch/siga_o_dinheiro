import { useThemePreference } from "./use-theme-preference";

export function useColorScheme() {
  const { effectiveTheme, loading } = useThemePreference();
  
  // Se ainda está carregando, retorna light como padrão
  if (loading) {
    return "light";
  }
  
  // Retorna o tema efetivo (nunca null porque effectiveTheme sempre tem valor)
  return effectiveTheme || "light";
}
