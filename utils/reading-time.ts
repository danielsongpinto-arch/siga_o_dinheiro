/**
 * Calcula o tempo estimado de leitura baseado em palavras por minuto
 * @param text Texto completo do artigo
 * @param wordsPerMinute Velocidade de leitura (padrão: 200 palavras/minuto)
 * @returns Tempo estimado em minutos
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * Formata o tempo de leitura para exibição
 * @param minutes Tempo em minutos
 * @returns String formatada (ex: "5 min", "1 min")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return "1 min";
  }
  return `${minutes} min`;
}
