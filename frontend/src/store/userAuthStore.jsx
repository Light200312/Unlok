import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-hot-toast"
import axios from "axios";
import { url } from "../URL";
import { persist } from "zustand/middleware";
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

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post(`${url}/user/register`, data);
      set({ authUser: res.data });
      console.log(res.data)


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
      // await axios.post("http://localhost:5000/api/user/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      // get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  getGlobalRanking:async()=>{
    try {
       const res=await axios(`${url}/user/get-global-ranking`)
       set({ranking:res.data}) 
       toast.success("Global Rank Fetched Successfully")
    } catch (error) {
      toast.error("Error:Global Ranking fetched failed.")

      
    }
   
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
      name: "auth-storage", // 🔐 key in localStorage
      getStorage: () => localStorage, // default
    }
  )  ) ;
