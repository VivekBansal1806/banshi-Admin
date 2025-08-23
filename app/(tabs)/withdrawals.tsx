import { ThemedText, ThemedView } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { adminApi, User, usersApi, WithdrawalRequest } from '@/services/api';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function WithdrawalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors.light;
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersById, setUsersById] = useState<Record<number, User>>({});

  const fetchWithdrawals = async (filter: FilterType = 'all') => {
    try {
      setLoading(true);
      let data: WithdrawalRequest[] = [];
      
      switch (filter) {
        case 'all':
          data = await adminApi.getAllWithdrawals();
          break;
        case 'pending':
          data = await adminApi.getPendingWithdrawals();
          break;
        case 'approved':
          data = await adminApi.getApprovedWithdrawals();
          break;
        case 'rejected':
          data = await adminApi.getRejectedWithdrawals();
          break;
      }
      
      setWithdrawals(data);
      setFilteredWithdrawals(data);
    } catch (error) {

      Alert.alert('Error', 'Failed to fetch withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWithdrawals(activeFilter);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWithdrawals();
    // Also fetch users for phone and balance mapping
    (async () => {
      try {
        const users = await usersApi.getAllUsers();
        const map: Record<number, User> = {};
        users.forEach((u) => {
          map[u.userId] = u;
        });
        setUsersById(map);
      } catch (err) {
        // Non-blocking
  
      }
    })();
  }, []);

  useEffect(() => {
    fetchWithdrawals(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWithdrawals(withdrawals);
    } else {
      const filtered = withdrawals.filter((withdrawal) => {
        const user = usersById[withdrawal.userId];
        const phone = user?.phone ?? '';
        return (
          withdrawal.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          phone.includes(searchQuery) ||
          withdrawal.amount.toString().includes(searchQuery)
        );
      });
      setFilteredWithdrawals(filtered);
    }
  }, [searchQuery, withdrawals, usersById]);

  const handleAccept = async (withdrawalId: number) => {
    try {
      await adminApi.decideWithdrawal(withdrawalId, true);
      Alert.alert('Success', 'Withdrawal request accepted');
      fetchWithdrawals(activeFilter);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept withdrawal request');
    }
  };

  const handleReject = async (withdrawalId: number) => {
    try {
      await adminApi.decideWithdrawal(withdrawalId, false);
      Alert.alert('Success', 'Withdrawal request rejected');
      fetchWithdrawals(activeFilter);
    } catch (error) {
      Alert.alert('Error', 'Failed to reject withdrawal request');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <ThemedText style={styles.loadingText}>Loading withdrawal requests...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Withdrawal Requests
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Manage user withdrawal requests
          </ThemedText>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
            onPress={() => setActiveFilter('all')}
          >
            <ThemedText style={styles.filterText}>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilter]}
            onPress={() => setActiveFilter('pending')}
          >
            <ThemedText style={styles.filterText}>Pending</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'approved' && styles.activeFilter]}
            onPress={() => setActiveFilter('approved')}
          >
            <ThemedText style={styles.filterText}>Approved</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'rejected' && styles.activeFilter]}
            onPress={() => setActiveFilter('rejected')}
          >
            <ThemedText style={styles.filterText}>Rejected</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsContainer}>
          {filteredWithdrawals.map((withdrawal) => (
            <View key={withdrawal.id} style={styles.requestCard}>
              <View style={styles.requestHeaderRow}>
                <ThemedText type="defaultSemiBold" style={styles.userName}>
                  {withdrawal.userName}
                </ThemedText>
                <View style={[
                  styles.statusBadge,
                  withdrawal.status.toLowerCase() === 'approved' && styles.statusApproved,
                  withdrawal.status.toLowerCase() === 'rejected' && styles.statusRejected,
                  withdrawal.status.toLowerCase() === 'pending' && styles.statusPending,
                ]}>
                  <ThemedText style={styles.statusText}>{withdrawal.status.toUpperCase()}</ThemedText>
                </View>
              </View>

              <ThemedText style={styles.metaText}>ID: {withdrawal.id}  •  UserID: {withdrawal.userId}</ThemedText>
              
              <View style={styles.amountRow}>
                <ThemedText style={styles.amountLabel}>Amount</ThemedText>
                <ThemedText type="title" style={styles.amountValue}>₹{withdrawal.amount.toLocaleString()}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Phone</ThemedText>
                  <ThemedText style={styles.detailValue}>{usersById[withdrawal.userId]?.phone ?? '-'}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Balance</ThemedText>
                  <ThemedText style={styles.detailValue}>₹{(usersById[withdrawal.userId]?.balance ?? 0).toLocaleString()}</ThemedText>
                </View>
              </View>

              <View style={styles.chipsRow}>
                <View style={styles.chip}><ThemedText style={styles.chipText}>UPI: {withdrawal.upiId}</ThemedText></View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Requested</ThemedText>
                  <ThemedText style={styles.detailValue}>{new Date(withdrawal.requestedAt).toLocaleString()}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Processed</ThemedText>
                  <ThemedText style={styles.detailValue}>{withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleString() : '-'}</ThemedText>
                </View>
              </View>

            {withdrawal.status.toLowerCase() === 'pending' ?  <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleAccept(withdrawal.id)}
                 
                >
                  <ThemedText style={styles.actionButtonText}>ACCEPT</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton,]}
                  onPress={() => handleReject(withdrawal.id)}
                  
                >
                  <ThemedText style={styles.actionButtonText}>REJECT</ThemedText>
                </TouchableOpacity>
              </View>:null}
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  activeFilter: {
    backgroundColor: '#FF6B35',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  requestsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  requestCard: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  requestHeader: {
    marginBottom: 12,
  },
  requestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  chipText: {
    fontSize: 12,
    opacity: 0.8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    opacity: 0.9,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#374151',
  },
  statusApproved: {
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  statusRejected: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(234,179,8,0.2)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 