import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AudioState } from '@/hooks/use-article-audio';

interface AudioPlayerProps {
  audioState: AudioState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
}

const RATE_OPTIONS = [0.75, 1.0, 1.25, 1.5, 2.0];

export function AudioPlayer({
  audioState,
  onPlay,
  onPause,
  onStop,
  onRateChange,
  onSkipForward,
  onSkipBackward,
}: AudioPlayerProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const handleRateChange = () => {
    const currentIndex = RATE_OPTIONS.indexOf(audioState.rate);
    const nextIndex = (currentIndex + 1) % RATE_OPTIONS.length;
    onRateChange(RATE_OPTIONS[nextIndex]);
  };

  const progress = audioState.totalParagraphs > 0
    ? (audioState.currentParagraph / audioState.totalParagraphs) * 100
    : 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: tintColor },
            ]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {audioState.currentParagraph + 1} / {audioState.totalParagraphs}
        </ThemedText>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        {/* Botão de velocidade */}
        <Pressable
          onPress={handleRateChange}
          style={({ pressed }) => [
            styles.rateButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <ThemedText style={[styles.rateText, { color: tintColor }]}>
            {audioState.rate}x
          </ThemedText>
        </Pressable>

        {/* Botão voltar */}
        <Pressable
          onPress={onSkipBackward}
          disabled={audioState.currentParagraph === 0}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.buttonPressed,
            audioState.currentParagraph === 0 && styles.buttonDisabled,
          ]}
        >
          <Ionicons
            name="play-back"
            size={28}
            color={audioState.currentParagraph === 0 ? '#999' : textColor}
          />
        </Pressable>

        {/* Botão play/pause */}
        <Pressable
          onPress={audioState.isPlaying ? onPause : onPlay}
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: tintColor },
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name={audioState.isPlaying ? 'pause' : 'play'}
            size={32}
            color="#fff"
          />
        </Pressable>

        {/* Botão avançar */}
        <Pressable
          onPress={onSkipForward}
          disabled={audioState.currentParagraph >= audioState.totalParagraphs - 1}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.buttonPressed,
            audioState.currentParagraph >= audioState.totalParagraphs - 1 && styles.buttonDisabled,
          ]}
        >
          <Ionicons
            name="play-forward"
            size={28}
            color={
              audioState.currentParagraph >= audioState.totalParagraphs - 1
                ? '#999'
                : textColor
            }
          />
        </Pressable>

        {/* Botão parar */}
        <Pressable
          onPress={onStop}
          disabled={!audioState.isPlaying && !audioState.isPaused}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.buttonPressed,
            !audioState.isPlaying && !audioState.isPaused && styles.buttonDisabled,
          ]}
        >
          <Ionicons
            name="stop"
            size={28}
            color={
              !audioState.isPlaying && !audioState.isPaused ? '#999' : textColor
            }
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  rateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minWidth: 50,
    alignItems: 'center',
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  playButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.3,
  },
});
