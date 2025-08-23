import { ThemedText, ThemedView } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { User, usersApi } from '@/services/api';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const colorScheme = useColorScheme();
  const colors = Colors.light;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await usersApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (e) {
      setError('Failed to fetch users. Please try again.');
      Alert.alert('Error', 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${user.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingUserId(user.userId);
              await usersApi.deleteUser(user.userId);
              setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
              Alert.alert('Success', 'User deleted successfully!');
            } catch (e) {
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            } finally {
              setDeletingUserId(null);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => {
    return (
      <View style={[styles.userCard, { backgroundColor: colors.background }] }>
        <View style={styles.userHeader}>
          <View style={styles.userTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.userName}>
              {item.name}
            </ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: '#FF6B35' + '15' }]}>
              <ThemedText style={[styles.roleText, { color: '#FF6B35' }]}>
                {item.role}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: '#FF4444' }]}
            onPress={() => handleDeleteUser(item)}
            disabled={deletingUserId === item.userId}
          >
            {deletingUserId === item.userId ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <IconSymbol name="trash" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol name="call" size={16} color="#FF6B35" />
          <ThemedText style={styles.infoValue}>{item.phone}</ThemedText>
        </View>
       
        <View style={styles.infoRow}>
          <IconSymbol name="wallet" size={16} color="#FF6B35" />
          <ThemedText type="defaultSemiBold" style={styles.balanceText}>
            Balance: ₹{item.balance?.toFixed?.(2) ?? item.balance}
          </ThemedText>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const visibleUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => {
      const name = (u.name ?? '').toLowerCase();
      const phone = (u.phone ?? '').toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [users, searchQuery]);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <ThemedText type="default" style={styles.loadingText}>
          Loading users...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Users
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          {visibleUsers.length} user{visibleUsers.length !== 1 ? 's' : ''} found
        </ThemedText>
        {error && (
          <ThemedText type="default" style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: '#F3F4F6' }]}>
          <IconSymbol name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or number"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={visibleUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B35"]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="people" size={64} color="#FF6B35" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No Users Found
            </ThemedText>
            <ThemedText type="default" style={styles.emptyText}>
              Users will appear here when available.
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
    paddingTop: 20,
    height: "80%",
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
  errorText: {
    color: '#FF4444',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoValue: {
    marginLeft: 8,
  },
  balanceText: {
    marginLeft: 8,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

