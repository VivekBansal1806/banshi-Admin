import { ThemedText, ThemedView } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { adminApi, DashboardData } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors.light;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNavigateToGames = () => {
    router.push("/(tabs)/games");
  };

  const handleNavigateToCreateGame = () => {
    router.push("/(tabs)/create-game");
  };

  const handleNavigateToWithdrawals = () => {
    router.push("/(tabs)/withdrawals");
  };

  const handleNavigateToGameDeclaration = () => {
    router.push("/(tabs)/game-declaration");
  };

  // Default values if API data is not available
  const data = dashboardData || {
    totalDeposits: 0,
    totalUsers: 0,
    totalGames: 0,
    totalPlacedBid: 0,
    totalWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    netRevenue: 0,
    pendingWithdrawalRequests: 0,
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>
                Dashboard
              </ThemedText>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Banshi Gaming Admin
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <StatsCard
            color="#4F46E5"
            iconName="people"
            title="Total Users"
            value={data.totalUsers.toLocaleString()}
            bars={[12, 18, 16, 22, 20, 24, 26]}
          />
          <StatsCard
            color="#06B6D4"
            iconName="stats-chart"
            title="Total Bids"
            value={data.totalPlacedBid.toLocaleString()}
            bars={[10, 14, 12, 18, 22, 28, 26]}
          />
          <StatsCard
            color="#10B981"
            iconName="game-controller"
            title="Games"
            value={data.totalGames.toLocaleString()}
            bars={[8, 10, 12, 14, 15, 16, 18]}
          />
          <StatsCard
            color="#F59E0B"
            iconName="wallet"
            title="Available Money"
            value={`₹${data.netRevenue.toLocaleString()}`}
            bars={[16, 18, 15, 20, 24, 22, 26]}
          />
          <StatsCard
            color="#EF4444"
            iconName="cash-outline"
            title="Withdrawn Money"
            value={`₹${data.totalWithdrawals.toLocaleString()}`}
            bars={[14, 12, 16, 18, 16, 20, 18]}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#c47ea8" }]}
            onPress={handleNavigateToGames}
          >
            <View style={styles.actionContent}>
              <IconSymbol name="list" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonText}>
                  View All Games
                </ThemedText>
                <ThemedText style={styles.actionButtonSubtext}>
                  Manage existing games
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#7e7ec4" }]}
            onPress={handleNavigateToCreateGame}
          >
            <View style={styles.actionContent}>
              <IconSymbol name="add" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonText}>
                  Create New Game
                </ThemedText>
                <ThemedText style={styles.actionButtonSubtext}>
                  Add a new game to the platform
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#FF6B35" }]}
            onPress={handleNavigateToWithdrawals}
          >
            <View style={styles.actionContent}>
              <IconSymbol name="cash-outline" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonText}>
                  Withdrawal Requests
                </ThemedText>
                <ThemedText style={styles.actionButtonSubtext}>
                  Manage user withdrawal requests
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#10B981" }]}
            onPress={handleNavigateToGameDeclaration}
          >
            <View style={styles.actionContent}>
              <IconSymbol name="trophy" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionButtonText}>
                  Declare Game Results
                </ThemedText>
                <ThemedText style={styles.actionButtonSubtext}>
                  Set game open and close results
                </ThemedText>
              </View>
            </View>
            <IconSymbol name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function StatsCard({
  color,
  iconName,
  title,
  value,
  bars,
}: {
  color: string;
  iconName: any;
  title: string;
  value: string;
  bars: number[];
}) {
  return (
    <View style={[styles.statsCardContainer]}>
      <View style={[styles.statsCard, { backgroundColor: color + "22" }]}>
        <View style={styles.statsHeader}>
          <View style={[styles.iconPill, { backgroundColor: color + "33" }]}>
            <IconSymbol name={iconName} size={20} color={color} />
          </View>
          <ThemedText type="default" style={styles.statsTitle}>
            {title}
          </ThemedText>
        </View>
        <ThemedText type="title" style={[styles.statsValue, { color }]}>
          {value}
        </ThemedText>
        <View style={styles.barChart}>
          {bars.map((h, idx) => (
            <View
              key={idx}
              style={[
                styles.bar,
                { height: 4 + h, backgroundColor: color + "AA" },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statsCardContainer: {
    width: "48%",
    marginBottom: 14,
  },
  statsCard: {
    borderRadius: 16,
    padding: 14,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconPill: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statsTitle: {
    opacity: 0.8,
    fontSize: 12,
    fontWeight: "500",
  },
  statsValue: {
    marginTop: 10,
    marginBottom: 10,
  },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonSubtext: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recentCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  recentText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  recentSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
});
