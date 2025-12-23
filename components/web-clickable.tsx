import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { ReactNode } from "react";

interface WebClickableProps {
  children: ReactNode;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

/**
 * Componente wrapper que garante cliques funcionem tanto na web quanto no mobile.
 * 
 * - Web: Usa <button> HTML nativo para garantir acessibilidade e eventos de clique
 * - Mobile: Usa TouchableOpacity do React Native
 * 
 * Uso:
 * ```tsx
 * <WebClickable onPress={handlePress} style={styles.button}>
 *   <Text>Clique aqui</Text>
 * </WebClickable>
 * ```
 */
export function WebClickable({ children, onPress, style, disabled = false }: WebClickableProps) {
  if (Platform.OS === "web") {
    const flatStyle = StyleSheet.flatten(style);
    return (
      <button
        type="button"
        onClick={(e) => {
          if (disabled) return;
          e.preventDefault();
          e.stopPropagation();
          onPress();
        }}
        disabled={disabled}
        style={{
          // Copiar TODOS os estilos do React Native
          ...flatStyle,
          // Sobrescrever estilos específicos do button HTML
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          border: "none",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          pointerEvents: disabled ? "none" : "auto",
          touchAction: "manipulation",
          opacity: disabled ? 0.5 : (flatStyle.opacity ?? 1),
        } as any}
      >
        {children}
      </button>
    );
  }
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7} 
      style={style}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}
