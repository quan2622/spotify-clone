import { create } from 'zustand'
import { axiosIntance } from "../lib/axios";
import { Album, Song } from "../types";

interface MusicStore {
  albums: Song[],
  songs: Album[],
  isLoading: boolean,
  error: string | null,

  fetchAlbum: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,


  fetchAlbum: async () => {
    // data fetching logic...
    set({ isLoading: true, error: null, });
    try {
      const res = await axiosIntance.get('albums');
      set({ albums: res.data });
    } catch (error: any) {
      set({ error: error.respone.data.message })
    } finally {
      set({ isLoading: false });
    }
  }
}))