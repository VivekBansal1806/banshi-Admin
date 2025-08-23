import axios from "axios";
import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || "https://banshi-fe4m.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Game {
  gameId: number;
  name: string;
  openingTime: string;
  closingTime: string;
  openResult?: string | null;
  closeResult?: string | null;
}

export interface CreateGameRequest {
  name: string;
  openingTime: string;
  closingTime: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  response: T;
}

export const gamesApi = {
  // Get all games
  getAllGames: async (): Promise<Game[]> => {
    try {
      const response = await api.get<ApiResponse<Game[]>>(
        "/api/admin/games/all"
      );

      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new game
  createGame: async (gameData: CreateGameRequest): Promise<Game> => {
    try {
      const response = await api.post<ApiResponse<Game>>(
        "/api/admin/games/create",
        gameData
      );

      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a game
  deleteGame: async (gameId: number): Promise<void> => {
    try {
      await api.delete(`/api/games/delete/${gameId}`);
    } catch (error) {
      throw error;
    }
  },
};

export interface User {
  userId: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  balance: number;
}

export interface DashboardData {
  totalDeposits: number;
  totalUsers: number;
  totalGames: number;
  totalPlacedBid: number;
  totalWithdrawals: number;
  pendingWithdrawalAmount: number;
  netRevenue: number;
  pendingWithdrawalRequests: number;
  recentActivity?: any[];
}

export interface WithdrawalRequest {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  upiId: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string | null;
  userPhone?: string;
  balance?: number;
}

export interface GameDeclarationRequest {
  gameId: number;
  openResult: string;
  closeResult: string;
}

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<ApiResponse<User[]>>(
        "/api/admin/user/all"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId: number): Promise<void> => {
    try {
      await api.delete(`/api/user/${userId}`);
    } catch (error) {
      throw error;
    }
  },
};

export const adminApi = {
  // Get dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await api.get<ApiResponse<DashboardData>>(
        "/api/admin/dashboard"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Get all withdrawal requests
  getAllWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    try {
      const response = await api.get<ApiResponse<WithdrawalRequest[]>>(
        "/api/admin/withdrawals/all"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Get approved withdrawals
  getApprovedWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    try {
      const response = await api.get<ApiResponse<WithdrawalRequest[]>>(
        "/api/admin/withdrawals/approved"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Get rejected withdrawals
  getRejectedWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    try {
      const response = await api.get<ApiResponse<WithdrawalRequest[]>>(
        "/api/admin/withdrawals/rejected"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Get pending withdrawals
  getPendingWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    try {
      const response = await api.get<ApiResponse<WithdrawalRequest[]>>(
        "/api/admin/withdrawals/pending"
      );
      return response.data.response;
    } catch (error) {
      throw error;
    }
  },

  // Decide withdrawal (approve/reject)
  decideWithdrawal: async (
    withdrawalId: number,
    approve: boolean
  ): Promise<void> => {
    try {
      await api.post("/api/admin/withdrawals/decision", {
        withdrawalId,
        approve,
      });
    } catch (error) {
      throw error;
    }
  },

  // Declare game result
  declareGameResult: async (
    gameData: GameDeclarationRequest
  ): Promise<void> => {
    try {
      await api.put("/api/admin/games/declare-result", gameData);
    } catch (error) {
      throw error;
    }
  },
};

export default api;
