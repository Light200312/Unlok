import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";
import { url } from "../URL";
import { UserAuth } from "./userAuthStore";

export const useClanStore = create(
  persist(
    (set, get) => ({
      clan: null,
      clanMessages: [],
      clansLoading: false,
      messagesLoading: false,clanInfo: null,
foundClans: [],

      // ✅ Create Clan
      createClan: async (clanData) => {
        set({ clansLoading: true });
        try {
          const res = await axios.post(`${url}/clan/create`, clanData);
          set({ clan: res.data.clan });
          toast.success("Clan created successfully!");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to create clan");
        } finally {
          set({ clansLoading: false });
        }
      },

      // ✅ Invite to Clan
      inviteToClan: async (inviteData) => {
        try {
          const res = await axios.post(`${url}/clan/invite`, inviteData);
          toast.success(res.data.message || "Invitation sent!");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to send invite");
        }
      },

      // ✅ Accept Clan Invite
      acceptClanInvite: async (inviteData) => {
        try {
          const res = await axios.post(`${url}/clan/accept`, inviteData);
          set({ clan: res.data.clan });
          toast.success("Joined clan successfully!");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to join clan");
        }
      },

      // ✅ Leave Clan
      leaveClan: async (userId) => {
        try {
          const res = await axios.post(`${url}/clan/leave`, { userId });
          set({ clan: null, clanMessages: [] });
          toast.success(res.data.message || "Left clan successfully");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to leave clan");
        }
      },

      // ✅ Kick Member
      kickClanMember: async (kickData) => {
        try {
          const res = await axios.post(`${url}/clan/kick`, kickData);
          toast.success(res.data.message || "Member kicked!");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to kick member");
        }
      },

      // ✅ Promote/Demote Member
      updateClanRole: async (roleData) => {
        try {
          const res = await axios.post(`${url}/clan/updateRole`, roleData);
          toast.success(res.data.message || "Role updated!");
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to update role");
        }
      },

      // ✅ Get Clan Messages
      getClanMessages: async (clanId) => {
        set({ messagesLoading: true });
        try {
          const res = await axios.get(`${url}/clan/chat/${clanId}`);
          set({ clanMessages: res.data });
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to load messages");
        } finally {
          set({ messagesLoading: false });
        }
      },

      // ✅ Send Clan Message
      sendClanMessage: async (clanId, messageData) => {
        try {
          const res = await axios.post(`${url}/clan/chat/${clanId}`, messageData);
          set((state) => ({
            clanMessages: [...state.clanMessages, res.data],
          }));
        } catch (err) {
          toast.error(err.response?.data?.error || "Failed to send message");
        }
      },// ✅ Search Clans
searchClans: async (searchTerm) => {
  set({ clansLoading: true });
  try {
    const res = await axios.post(`${url}/clan/search`, { searchTerm });
    set({ foundClans: res.data });
    toast.success("Clans loaded");
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to search clans");
  } finally {
    set({ clansLoading: false });
  }
},

// ✅ Get Clan Info
getClanInfo: async (clanId) => {
  set({ clansLoading: true });
  try {
    const res = await axios.get(`${url}/clan/info/${clanId}`);
    set({ clanInfo: res.data });
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch clan info");
  } finally {
    set({ clansLoading: false });
  }
},

// ✅ Request to Join Clan
requestJoinClan: async (joinData) => {
  try {
    const res = await axios.post(`${url}/clan/requestJoin`, joinData);
    toast.success(res.data.message || "Join request sent!");
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to request join");
  }
},


      // ✅ Subscribe to Clan Chat
      subscribeToClanChat: () => {
        const socket = UserAuth?.getState().socket;
        if (!socket) return;

        socket.off("newClanMessage");
        socket.on("newClanMessage", (msg) => {
          set((state) => ({
            clanMessages: [...state.clanMessages, msg],
          }));
        });
      },

      // ✅ Unsubscribe
      unsubscribeFromClanChat: () => {
        const socket = UserAuth?.getState().socket;
        socket?.off("newClanMessage");
      },
    }),
    {
      name: "clan-storage",
      getStorage: () => localStorage,
      partialize: (state) => {
        const { clanMessages, ...rest } = state;
        return rest;
      },
    }
  )
);
