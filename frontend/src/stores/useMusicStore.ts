/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { axiosIntance } from "../lib/axios";
import { Album, Song, Stat } from "../types";
import toast from "react-hot-toast";
import _ from "lodash"
import Fuse from "fuse.js";

interface MusicStore {
  albums: Album[],
  albumsAdmin: Album[],
  albumsUser: Album[],
  songs: Song[],
  isLoading: boolean,
  error: string | null,
  currentAlbum: Album | null,
  madeForYouSongs: Song[],
  trendingSongs: Song[],
  featuredSongs: Song[],
  stat: Stat,
  isSongLoading: boolean,
  isStatLoading: boolean,
  currentPage: number,
  songById: Song | null,
  sloganMadeForYou: string,
  sloganTrending: string,
  songsSearch: Song[],
  resultSearch: Song[],
  fetchFeaturedSong: () => Promise<void>,
  fetchMadeForYouSong: () => Promise<void>,
  fetchTrendingSong: () => Promise<void>,
  fetchStat: () => Promise<void>,
  fetchSongAdmin: () => Promise<void>,
  deleteSongAdmin: (songId: string) => Promise<void>,
  getSongPaginate: (page?: string) => Promise<void>,
  updateSong: (data: any, songId: string) => Promise<void>,
  getSongByID: (id: string) => Promise<void>,
  createAlbumUser: () => Promise<void>,
  getAllSong: () => Promise<void>,
  handleSearch: (query: string) => void,
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  sloganMadeForYou: 'A playlist crafted for your every move, mood, and moment.',
  sloganTrending: 'The playlist everyone’s talking about — fresh, fast, and always on point.',
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs: [],
  featuredSongs: [],
  stat: {
    totalAlbum: 0,
    totalSong: 0,
    totalUser: 0,
    uniqueArtists: 0,
  },
  isSongLoading: false,
  isStatLoading: false,
  currentPage: 1,
  songById: null,
  albumsAdmin: [],
  albumsUser: [],
  songsSearch: [],
  resultSearch: [],

  handleSearch: (query) => {
    if (!query) return { EC: 1, EM: "Missing search query. Please try again!", }
    const songs = get().songsSearch;
    const fuse = new Fuse(songs, {
      keys: ['title', 'artist'],
      threshold: 0.5,
      ignoreLocation: true,
      includeScore: true,
    });

    const results = fuse.search(query).slice(0, 10).map(result => result.item);
    set({ resultSearch: results });
    return { EC: 0, EM: "Success!" };

  },
  getAllSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get("songs/all");
      if (res.data.EC === 0)
        set({ songsSearch: res.data.songs });
      else toast.error(res.data.EM)
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },
  createAlbumUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.post("albums/createAlbum");
      toast.success("Add new album successed");
      set((state) => ({ albumsUser: [...state.albumsUser, res.data.data_new] }))
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  getSongByID: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get(`songs/${id}`);
      console.log('check song by Id: ', res.data);
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  updateSong: async (data, songId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.put(`admin/songs/${songId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.EM);
      const new_songs = get().songs.map(item => item._id === res.data.song._id ? res.data.song : item);
      set({ songs: new_songs });
    } catch (error: any) {
      set({ error: error });
    } finally {
      set({ isLoading: false });
    }
  },
  getSongPaginate: async (page = '1') => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get(`admin/songs?page=${page}`);
      set({
        songs: res.data.songs,
        currentPage: +page,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFeaturedSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.get('songs/featured');
      set({ featuredSongs: res.data.songs });
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
      set({ madeForYouSongs: res.data.songs });
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
      set({ trendingSongs: res.data.songs });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchStat: async () => {
    set({ isStatLoading: true, error: null });
    try {
      const res = await axiosIntance.get('stats');
      set({ stat: res.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isStatLoading: false });
    }
  },
  fetchSongAdmin: async () => {
    set({ isSongLoading: true, error: null });
    try {
      const res = await axiosIntance.get('songs/all');
      if (res.data && res.data.EC === 0) {
        set({ songs: res.data.songs })
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isSongLoading: false });
    }
  },
  deleteSongAdmin: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      // console.log('song Id: ', songId);
      const res = await axiosIntance.delete(`admin/songs/${songId}`);
      get().getSongPaginate((get().currentPage).toString());
      set(state => ({
        stat: { ...state.stat, totalSong: state.stat.totalSong - 1 }
      }))
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || 'Fail to delete song');
      set({ error: error });
    } finally {
      set({ isLoading: false });
    }
  },
}))