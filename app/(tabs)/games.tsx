import { ThemedText, ThemedView } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Game, gamesApi } from '@/services/api';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingGameId, setDeletingGameId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const colors = Colors.light;

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedGames = await gamesApi.getAllGames();
      
      setGames(fetchedGames);
    } catch (error) {

      setError('Failed to fetch games. Please try again.');
      Alert.alert('Error', 'Failed to fetch games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const handleDeleteGame = (game: Game) => {
    Alert.alert(
      'Delete Game',
      `Are you sure you want to delete "${game.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingGameId(game.gameId);
              await gamesApi.deleteGame(game.gameId);
              setGames(games.filter(g => g.gameId !== game.gameId));
              Alert.alert('Success', 'Game deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete game. Please try again.');
        
            } finally {
              setDeletingGameId(null);
            }
          },
        },
      ]
    );
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    } catch (error) {
      return dateTimeString;
    }
  };

  const getGameStatus = (game: Game) => {
    const now = new Date();
    const opening = new Date(game.openingTime);
    const closing = new Date(game.closingTime);
    
    if (now < opening) {
      return { status: 'Upcoming', color: '#FF6B35', bgColor: '#FF6B35' + '15' };
    } else if (now >= opening && now <= closing) {
      return { status: 'Active', color: '#4CAF50', bgColor: '#4CAF50' + '15' };
    } else {
      return { status: 'Closed', color: '#9E9E9E', bgColor: '#9E9E9E' + '15' };
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => {
    const gameStatus = getGameStatus(item);
    
    return (
      <View style={[styles.gameCard, { backgroundColor: colors.background }]}>
        <View style={styles.gameHeader}>
          <View style={styles.gameTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.gameName}>
              {item.name}
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: gameStatus.bgColor }]}>
              <ThemedText style={[styles.statusText, { color: gameStatus.color }]}>
                {gameStatus.status}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: '#FF4444' }]}
            onPress={() => handleDeleteGame(item)}
            disabled={deletingGameId === item.gameId}
          >
            {deletingGameId === item.gameId ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <IconSymbol name="trash" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <IconSymbol name="time" size={16} color="#FF6B35" />
            <View style={styles.timeContent}>
              <ThemedText type="default" style={styles.timeLabel}>
                Opening Time
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.timeValue}>
                {formatDateTime(item.openingTime)}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.timeItem}>
            <IconSymbol name="time-outline" size={16} color="#FF6B35" />
            <View style={styles.timeContent}>
              <ThemedText type="default" style={styles.timeLabel}>
                Closing Time
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.timeValue}>
                {formatDateTime(item.closingTime)}
              </ThemedText>
            </View>
            
          </View>
          <View style={styles.timeItem}>
            <IconSymbol name="snow" size={16} color="#FF6B35" />
            <View style={styles.timeContent}>
            
              <ThemedText type="defaultSemiBold" style={styles.timeValue}>
                {`GAME ID : ${item.gameId}`}
              </ThemedText>
            </View>
            
          </View>
        </View>

        {item.openResult && (
          <View style={styles.resultContainer}>
            <ThemedText type="default" style={styles.resultLabel}>
              Open Result: {item.openResult}
            </ThemedText>
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <ThemedText type="default" style={styles.loadingText}>
          Loading games...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          All Games
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          {games.length} game{games.length !== 1 ? 's' : ''} found
        </ThemedText>
        {error && (
          <ThemedText type="default" style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </View>

      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.gameId.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="game-controller" size={64} color="#FF6B35" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No Games Found
            </ThemedText>
            <ThemedText type="default" style={styles.emptyText}>
              Create your first game to get started!
            </ThemedText>
            {error && (
              <ThemedText type="default" style={styles.errorText}>
                {error}
              </ThemedText>
            )}
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    height: "80%",
    marginBottom: "20%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorText: {
    color: '#FF6B35',
    marginTop: 8,
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  gameCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gameTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameName: {
    fontSize: 18,
    marginRight: 12,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContent: {
    marginLeft: 12,
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 15,
  },
  resultContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  resultLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
}); 