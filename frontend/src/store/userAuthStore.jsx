import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-hot-toast"
import axios from "axios";
import { url } from "../URL";
import { io } from "socket.io-client";
import { persist } from "zustand/middleware";
// import {userAuth} from ""

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://unlok-backend.onrender.com";

export const UserAuth = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      ranking: null,
      socket: null,
      onlineUsers: [],

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axios.post(`${url}/user/register`, data);
          set({ authUser: res.data });

          // 🔑 update storage key after signup
          get().switchStorageKey(res.data._id);

          get().connectSocket();
          toast.success("Account created successfully");
        } catch (error) {
          console.error("Signup error:", error?.response?.data || error);
          toast.error(error?.response?.data?.error || "Signup failed");
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axios.post(`${url}/user/login`, data);
          set({ authUser: res.data });

          // 🔑 update storage key after login
          get().switchStorageKey(res.data._id);

          get().connectSocket();
          toast.success("Logged in successfully");
        } catch (error) {
          console.error("Login error:", error?.response?.data || error);
          toast.error(error?.response?.data?.error || "Login failed");
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          get().disConnectSocket();
          set({ authUser: null, isLoggingIn: false });
          // clear only current user’s storage
          localStorage.removeItem(get().storageKey);
          toast.success("Logged out successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      },

      switchStorageKey: (userId) => {
        const newKey = `auth-store-${userId}`;
        set({ storageKey: newKey });
      },

      connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
          query: { userId: authUser._id },
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
        });
        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },

      disConnectSocket: async () => {
        const socket = get().socket;
        if (socket && socket.connected) {
          socket.off();
          socket.disconnect();
          set({ socket: null });
          console.log("🔌 Socket disconnected manually");
        }
      },
    }),
    {
      name: "auth-store", // default name, will be replaced dynamically
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        if (state?.authUser) {
          state.connectSocket();
        }
      },
      partialize: (state) => {
        const { socket, ...rest } = state;
        return rest;
      },
    }
  )
);
