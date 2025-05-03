import { create } from 'zustand'
import { axiosIntance } from "../lib/axios";
import { Album, Song } from "../types";

interface MusicStore {
  albums: Song[],
  songs: Album[],
  isLoading: boolean,
  error: string | null,
  currentAlbum: Album | null,
  madeForYouSongs: Song[],
  trendingSongs: Song[],
  featuredSongs: Song[],

  fetchAlbum: () => Promise<void>,
  fetchAlbumById: (albumId: string) => Promise<void>
  fetchFeaturedSong: () => Promise<void>,
  fetchMadeForYouSong: () => Promise<void>,
  fetchTrendingSong: () => Promise<void>,
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs: [],
  featuredSongs: [],


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
  },
  fetchAlbumById: async (albumId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get(`albums/${albumId}`);
      set({ currentAlbum: res.data });
    } catch (error: any) {
      set({ error: error.respone.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFeaturedSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get('songs/featured');
      set({ featuredSongs: res.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get('songs/made-for-you');
      set({ madeForYouSongs: res.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get('songs/trending');
      set({ trendingSongs: res.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}))