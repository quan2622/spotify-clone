import { create } from "zustand";
import { axiosIntance } from "../lib/axios";

interface AuthStore {
  isAdmin: boolean,
  isLoading: boolean,
  error: null | string,

  checkAdmin: () => Promise<void>,
  reset: () => void,
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdmin: async () => {
    set({ isLoading: false, error: null });
    try {
      const res = await axiosIntance.get('admin/check');
      set({ isAdmin: res.data.admin });
    } catch (error: any) {
      set({ error: error.response.data.message, isAdmin: false });
    } finally {
      set({ isLoading: false });
    }
  },
  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  }
}))