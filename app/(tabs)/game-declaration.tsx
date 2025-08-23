import { ThemedText, ThemedView } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { adminApi, GameDeclarationRequest } from '@/services/api';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function GameDeclarationScreen() {
  const [gameId, setGameId] = useState('');
  const [openResult, setOpenResult] = useState('');
  const [closeResult, setCloseResult] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {

    if (!gameId.trim() || !openResult.trim() || !closeResult.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields');
      return;
    }

    const gameIdNum = parseInt(gameId);
    if (isNaN(gameIdNum) || gameIdNum <= 0) {
      Alert.alert('Invalid Game ID', 'Please enter a valid game ID');
      return;
    }

    try {
      setSubmitting(true);
      const gameData: GameDeclarationRequest = {
        gameId: gameIdNum,
        openResult: openResult.trim(),
        closeResult: closeResult.trim(),
      };
    
      await adminApi.declareGameResult(gameData);
      
      Alert.alert('Success', 'Game result declared successfully', [
        {
          text: 'OK',
          onPress: () => {
            setGameId('');
            setOpenResult('');
            setCloseResult('');
          },
        },
      ]);
    } catch (error) {

      Alert.alert('Error', 'Failed to declare game result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setGameId('');
    setOpenResult('');
    setCloseResult('');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Declare Game Results
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Set open and close results for games
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Game ID
            </ThemedText>
            <View style={styles.inputWrapper}>
              <IconSymbol name="game-controller" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter game ID (e.g., 1, 2, 3...)"
                placeholderTextColor="#9CA3AF"
                value={gameId}
                onChangeText={setGameId}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Open Result
            </ThemedText>
            <View style={styles.inputWrapper}>
              <IconSymbol name="sunny" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter open result (e.g., 122, 456, 789...)"
                placeholderTextColor="#9CA3AF"
                value={openResult}
                onChangeText={setOpenResult}
                autoCapitalize="none"

              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Close Result
            </ThemedText>
            <View style={styles.inputWrapper}>
              <IconSymbol name="moon" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter close result (e.g., 347, 123, 567...)"
                placeholderTextColor="#9CA3AF"
                value={closeResult}
                onChangeText={setCloseResult}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
              disabled={submitting}
            >
              <IconSymbol name="refresh" size={20} color="#6B7280" />
              <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <IconSymbol name="checkmark-circle" size={20} color="white" />
                  <ThemedText style={styles.submitButtonText}>Declare Result</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    marginBottom: "20%",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  formContainer: {
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    opacity: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  resetButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  submitButton: {
    backgroundColor: '#10B981',
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});
