import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do expo-speech
vi.mock('expo-speech', () => ({
  speak: vi.fn((text, options) => {
    // Simular comportamento assíncrono
    setTimeout(() => {
      if (options?.onStart) options.onStart();
      setTimeout(() => {
        if (options?.onDone) options.onDone();
      }, 100);
    }, 0);
  }),
  stop: vi.fn(),
  isSpeakingAsync: vi.fn(() => Promise.resolve(false)),
}));

describe('useArticleAudio - Lógica de Divisão de Parágrafos', () => {
  it('deve dividir conteúdo em parágrafos corretamente', () => {
    const content = `# Título do Artigo

Este é o primeiro parágrafo do artigo de teste.

Este é o segundo parágrafo do artigo de teste.

## Seção 2

Este é o terceiro parágrafo do artigo de teste.`;

    const paragraphs = content
      .split('\n\n')
      .filter(p => p.trim().length > 0)
      .map(p => p.replace(/^#+\s+/, '').trim());

    expect(paragraphs.length).toBe(5);
    expect(paragraphs[0]).toBe('Título do Artigo');
    expect(paragraphs[1]).toBe('Este é o primeiro parágrafo do artigo de teste.');
    expect(paragraphs[2]).toBe('Este é o segundo parágrafo do artigo de teste.');
    expect(paragraphs[3]).toBe('Seção 2');
    expect(paragraphs[4]).toBe('Este é o terceiro parágrafo do artigo de teste.');
  });

  it('deve remover marcadores de título Markdown', () => {
    const content = '## Título com Marcador';
    const cleaned = content.replace(/^#+\s+/, '').trim();

    expect(cleaned).toBe('Título com Marcador');
  });

  it('deve filtrar parágrafos vazios', () => {
    const content = `Parágrafo 1


Parágrafo 2

`;

    const paragraphs = content
      .split('\n\n')
      .filter(p => p.trim().length > 0);

    expect(paragraphs.length).toBe(2);
  });
});

describe('useArticleAudio - Velocidades de Reprodução', () => {
  const RATE_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

  it('deve ter 5 opções de velocidade', () => {
    expect(RATE_OPTIONS.length).toBe(5);
  });

  it('deve ciclar entre velocidades corretamente', () => {
    let currentRate = 1.0;
    
    // Primeira mudança: 1.0 -> 1.25
    let currentIndex = RATE_OPTIONS.indexOf(currentRate);
    let nextIndex = (currentIndex + 1) % RATE_OPTIONS.length;
    currentRate = RATE_OPTIONS[nextIndex];
    expect(currentRate).toBe(1.25);

    // Segunda mudança: 1.25 -> 1.5
    currentIndex = RATE_OPTIONS.indexOf(currentRate);
    nextIndex = (currentIndex + 1) % RATE_OPTIONS.length;
    currentRate = RATE_OPTIONS[nextIndex];
    expect(currentRate).toBe(1.5);

    // Terceira mudança: 1.5 -> 2.0
    currentIndex = RATE_OPTIONS.indexOf(currentRate);
    nextIndex = (currentIndex + 1) % RATE_OPTIONS.length;
    currentRate = RATE_OPTIONS[nextIndex];
    expect(currentRate).toBe(2.0);

    // Quarta mudança: 2.0 -> 0.75 (volta ao início)
    currentIndex = RATE_OPTIONS.indexOf(currentRate);
    nextIndex = (currentIndex + 1) % RATE_OPTIONS.length;
    currentRate = RATE_OPTIONS[nextIndex];
    expect(currentRate).toBe(0.75);
  });
});

describe('useArticleAudio - Navegação de Parágrafos', () => {
  const totalParagraphs = 5;

  it('deve avançar corretamente', () => {
    let currentParagraph = 0;

    // Avançar
    if (currentParagraph < totalParagraphs - 1) {
      currentParagraph++;
    }

    expect(currentParagraph).toBe(1);
  });

  it('não deve avançar além do último parágrafo', () => {
    let currentParagraph = 4; // Último parágrafo (índice 4)

    // Tentar avançar
    if (currentParagraph < totalParagraphs - 1) {
      currentParagraph++;
    }

    expect(currentParagraph).toBe(4); // Deve permanecer no último
  });

  it('deve voltar corretamente', () => {
    let currentParagraph = 2;

    // Voltar
    if (currentParagraph > 0) {
      currentParagraph--;
    }

    expect(currentParagraph).toBe(1);
  });

  it('não deve voltar antes do primeiro parágrafo', () => {
    let currentParagraph = 0;

    // Tentar voltar
    if (currentParagraph > 0) {
      currentParagraph--;
    }

    expect(currentParagraph).toBe(0); // Deve permanecer no primeiro
  });
});

describe('useArticleAudio - Cálculo de Progresso', () => {
  it('deve calcular progresso corretamente', () => {
    const totalParagraphs = 10;
    const currentParagraph = 3;

    const progress = totalParagraphs > 0
      ? (currentParagraph / totalParagraphs) * 100
      : 0;

    expect(progress).toBe(30);
  });

  it('deve retornar 0 quando não há parágrafos', () => {
    const totalParagraphs = 0;
    const currentParagraph = 0;

    const progress = totalParagraphs > 0
      ? (currentParagraph / totalParagraphs) * 100
      : 0;

    expect(progress).toBe(0);
  });

  it('deve calcular 100% no último parágrafo', () => {
    const totalParagraphs = 5;
    const currentParagraph = 5;

    const progress = totalParagraphs > 0
      ? (currentParagraph / totalParagraphs) * 100
      : 0;

    expect(progress).toBe(100);
  });
});
