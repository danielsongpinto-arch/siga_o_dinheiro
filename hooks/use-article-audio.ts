import { useState, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const AUDIO_POSITION_KEY = 'article_audio_position';

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  currentParagraph: number;
  totalParagraphs: number;
}

export function useArticleAudio(content: string, articleId: string) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    rate: 1.0,
    currentParagraph: 0,
    totalParagraphs: 0,
  });

  // Dividir conteúdo em parágrafos para narração sequencial
  const paragraphs = content
    .split('\n\n')
    .filter(p => p.trim().length > 0)
    .map(p => p.replace(/^#+\s+/, '').trim()); // Remove marcadores de título Markdown

  useEffect(() => {
    setAudioState(prev => ({
      ...prev,
      totalParagraphs: paragraphs.length,
    }));
    
    // Carregar posição salva
    loadSavedPosition();
    
    // Configurar áudio para background playback
    configureAudio();
  }, [content]);
  
  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error configuring audio:', error);
    }
  };
  
  const loadSavedPosition = async () => {
    try {
      const saved = await AsyncStorage.getItem(`${AUDIO_POSITION_KEY}_${articleId}`);
      if (saved) {
        const { currentParagraph, rate } = JSON.parse(saved);
        setAudioState(prev => ({ ...prev, currentParagraph, rate }));
      }
    } catch (error) {
      console.error('Error loading audio position:', error);
    }
  };
  
  const savePosition = async (paragraph: number, rate: number) => {
    try {
      await AsyncStorage.setItem(
        `${AUDIO_POSITION_KEY}_${articleId}`,
        JSON.stringify({ currentParagraph: paragraph, rate })
      );
    } catch (error) {
      console.error('Error saving audio position:', error);
    }
  };

  const speak = useCallback(async (text: string, index: number) => {
    return new Promise<void>((resolve) => {
      Speech.speak(text, {
        language: 'pt-BR',
        rate: audioState.rate,
        onDone: () => {
          resolve();
        },
        onStopped: () => {
          resolve();
        },
        onError: () => {
          resolve();
        },
      });
    });
  }, [audioState.rate]);

  const play = useCallback(async () => {
    if (audioState.isPaused) {
      // Retomar do parágrafo atual
      setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      
      for (let i = audioState.currentParagraph; i < paragraphs.length; i++) {
        setAudioState(prev => ({ ...prev, currentParagraph: i }));
        await speak(paragraphs[i], i);
        
        // Verificar se foi pausado durante a fala
        const wasStopped = await Speech.isSpeakingAsync();
        if (!wasStopped) break;
      }
      
      // Terminou de falar todos os parágrafos
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentParagraph: 0,
      }));
    } else {
      // Começar do início
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentParagraph: 0,
      }));

      for (let i = 0; i < paragraphs.length; i++) {
        setAudioState(prev => ({ ...prev, currentParagraph: i }));
        await speak(paragraphs[i], i);
        
        // Verificar se foi pausado durante a fala
        const wasStopped = await Speech.isSpeakingAsync();
        if (!wasStopped) break;
      }

      // Terminou de falar todos os parágrafos
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentParagraph: 0,
      }));
    }
  }, [audioState.isPaused, audioState.currentParagraph, paragraphs, speak]);

  const pause = useCallback(() => {
    Speech.stop();
    setAudioState(prev => {
      const newState = {
        ...prev,
        isPlaying: false,
        isPaused: true,
      };
      savePosition(newState.currentParagraph, newState.rate);
      return newState;
    });
  }, [articleId]);

  const stop = useCallback(() => {
    Speech.stop();
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentParagraph: 0,
    }));
  }, []);

  const setRate = useCallback((rate: number) => {
    setAudioState(prev => ({ ...prev, rate }));
  }, []);

  const skipForward = useCallback(() => {
    if (audioState.currentParagraph < paragraphs.length - 1) {
      Speech.stop();
      setAudioState(prev => ({
        ...prev,
        currentParagraph: prev.currentParagraph + 1,
      }));
    }
  }, [audioState.currentParagraph, paragraphs.length]);

  const skipBackward = useCallback(() => {
    if (audioState.currentParagraph > 0) {
      Speech.stop();
      setAudioState(prev => ({
        ...prev,
        currentParagraph: Math.max(0, prev.currentParagraph - 1),
      }));
    }
  }, [audioState.currentParagraph]);

  // Limpar ao desmontar componente
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return {
    audioState,
    play,
    pause,
    stop,
    setRate,
    skipForward,
    skipBackward,
  };
}
