import { create } from "zustand"
import { axiosIntance } from "../lib/axios"
import { User } from "../types";

interface UserStore {
  users: User[],
  fetchUser: () => Promise<void>,
  isLoading: boolean,
  error: string | null,
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await axiosIntance.get('users');
      set({ users: res.data });
    } catch (error: any) {
      set({ error: error });
    } finally {
      set({ isLoading: false });
    }
  }
}))