import { create } from 'zustand'
import { axiosIntance } from "../lib/axios";
import { Album, Song, Stat } from "../types";
import toast from "react-hot-toast";

interface MusicStore {
  albums: Album[],
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

  fetchAlbum: () => Promise<void>,
  fetchAlbumById: (albumId: string) => Promise<void>
  fetchFeaturedSong: () => Promise<void>,
  fetchMadeForYouSong: () => Promise<void>,
  fetchTrendingSong: () => Promise<void>,
  fetchStat: () => Promise<void>,
  // fetchSongAdmin: () => Promise<void>,
  deleteSongAdmin: (songId: string) => Promise<void>,
  deleteAlbumAdmin: (albumId: string) => Promise<void>,
  getSongPaginate: (page?: string) => Promise<void>,
  updateSong: (data: any, songId: string) => Promise<void>,
  getSongByID: (id: string) => Promise<void>
}

export const useMusicStore = create<MusicStore>((set, get) => ({
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
      const res = await axiosIntance.put(`songs/${songId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message);
      const new_songs = get().songs.map(item => item._id === res.data.song._id ? res.data.song : item);
      console.log('check new data: ', new_songs);
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
      const res = await axiosIntance.get(`songs?page=${page}`);
      set({
        songs: res.data,
        currentPage: +page,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
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
  // fetchSongAdmin: async () => {
  //   set({ isSongLoading: true, error: null });
  //   try {
  //     const res = await axiosIntance.get('songs');
  //     set({ songs: res.data })
  //   } catch (error: any) {
  //     set({ error: error.message });
  //   } finally {
  //     set({ isSongLoading: false });
  //   }
  // },
  deleteSongAdmin: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      console.log('song Id: ', songId);
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
  deleteAlbumAdmin: async (albumId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosIntance.delete(`admin/albums/${albumId}`);

      set(state => ({
        albums: state.albums.filter(a => a._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find(a => a._id === albumId)?.title ? { ...song, albumId: null } : song,
        )
      }));
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || 'Fail to delete album');
      // set({ error: error });
    } finally {
      set({ isLoading: false });
    }
  },
}))