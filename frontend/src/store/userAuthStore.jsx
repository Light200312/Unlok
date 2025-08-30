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
  // token:null,
  // Rank:null,
  // titles:null,
  // badges:null,
  ranking:null,
  socket:null,
  // BASE_URL:"http://localhost:5000",

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${url}/user/register`, data);
      set({ authUser: res.data });
      console.log(res.data)

 get().connectSocket()
  get().switchStorageKey(res.data._id);
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
      console.log(res.data)
      set({ authUser: res.data });
      get().connectSocket()
       get().switchStorageKey(res.data._id);
      // set({ Rank: res.data.rank });
      // set({ titles: res.data?.titles });
      // set({ badges: res.data.badges });
      toast.success("Logged in successfully" );
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
      // await axios.post("http://localhost:5000/api/user/logout");
      set({ authUser: null });
      set({isLoggingIn:false})
    localStorage.removeItem(get().storageKey);

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  getGlobalRanking:async()=>{
    try {
       const res=await axios(`${url}/user/get-global-ranking`)
       set({ranking:res.data}) 
      //  toast.success("Global Rank Fetched Successfully")
    } catch (error) {
      toast.error("Error:Global Ranking fetched failed.")

      
    }
   
  },
  connectSocket:async()=>{
      const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
        query: { userId: authUser._id },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

  },
  disConnectSocket:async()=>{
      const socket = get().socket;
  if (socket && socket.connected) {
    socket.off(); // remove all event listeners
    socket.disconnect();
    console.log("🔌 Socket disconnected manually");
    set({ socket: null });
  }

  },
  switchStorageKey: (userId) => {
        const newKey = `auth-store-${userId}`;
        set({ storageKey: newKey });
      },

  checkconnection:async()=>{
    try {
        const res=await axiosInstance.get('/')
        toast(res + "from backend")
    } catch (error) {
        console.log("error in connection")
    }
  }
}) ,
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
  )  ) ;


