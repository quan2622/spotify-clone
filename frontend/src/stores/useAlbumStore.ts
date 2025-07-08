import { create } from "zustand";
import type { Album, AlbumCaching, Song } from "../types";
import albumService from "../services/album.service";
import toast from "react-hot-toast";
import { axiosIntance } from "../lib/axios";
import _ from "lodash";

interface ALbumStore {
  isLoading: boolean;
  recommendAlbum: AlbumCaching[] | null;
  popularAlbum: AlbumCaching[] | null;
  albums: Album[],
  albumsAdmin: Album[];
  albumsUser: Album[];
  currentAlbum: Album | null,

  deleteAlbumAdmin: (albumId: string) => Promise<void>;
  fetchDataAlbum: (type: string) => Promise<void>;
  createAlbumUser: () => Promise<void>;
  fetchAlbum: (option: string) => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  addSongToAlbumUser: (albumId: string, song: Song) => Promise<void>;
  minusSongAlbumUser: (albumId: string, song: Song) => Promise<void>;
}


export const useAlbumStore = create<ALbumStore>((set, get) => ({
  isLoading: false,
  recommendAlbum: null,
  popularAlbum: null,
  albums: [],
  albumsAdmin: [],
  albumsUser: [],
  currentAlbum: null,


  deleteAlbumAdmin: async (albumId) => {
    set({ isLoading: true });
    try {
      const res = await axiosIntance.delete(`admin/albums/${albumId}`);

      set(state => ({
        albums: state.albums.filter(a => a._id !== albumId),
        // songs: state.songs.map((song) =>
        //   song.albumId === state.albums.find(a => a._id === albumId)?.title ? { ...song, albumId: null } : song,
        // )
      }));
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.message || 'Fail to delete album');
    } finally {
      set({ isLoading: false });
    }
  },
  fetchDataAlbum: async (type) => {
    set({ isLoading: true });
    try {
      const res = await albumService.getCachingAlbum(`${type}`); // recommended &  popular_albums
      console.log("Check data return: ", res?.data);
      if (res && res.data && res.data.EC === 0) {
        if (type === 'popular_albums') {
          set({ popularAlbum: res.data.data });
        } else if (type === 'recommended') {
          set({ recommendAlbum: res.data.data });
        }
      } else {
        toast.error(res?.data.EM)
      }
    } catch (error: any) {
      console.log("Had error when fecthing data album: ", error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbum: async (option) => {
    // data fetching logic...
    set({ isLoading: true });
    try {
      if (option === "USER") {
        const res = await axiosIntance.get('albums');
        set({ albumsUser: res.data.albums });
      } else if (option === "ADMIN") {
        const res = await axiosIntance.get('admin/albums');
        let songCount = JSON.parse(res.data.dataSongCount);
        songCount = new Map(songCount);

        const reMakeAlbum = res.data.albums.map((album: Album) => {
          album.totalSong = songCount.get(album._id.toString())
          return album;
        })

        set({ albumsAdmin: reMakeAlbum });
      }
    } catch (error: any) {
      console.log("Had error when fetch album - ", option, ' - ', error);
    } finally {
      set({ isLoading: false });
    }
  },
  createAlbumUser: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosIntance.post("albums/createAlbum");
      toast.success("Add new album successed");
      set((state) => ({ albumsUser: [...state.albumsUser, res.data.data_new] }))
    } catch (error: any) {
      console.log("Had error when creature new album for user");
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (albumId) => {
    set({ isLoading: true });
    try {
      const res = await axiosIntance.get(`albums/${albumId}`);
      if (res.data) {
        if (res.data.EC !== 0) toast.error(res.data.EM);
        else {
          const songs = res.data.songs;
          const dataAlbum = _.cloneDeep(res.data.album_data);
          dataAlbum.songs = songs;

          set({ currentAlbum: dataAlbum })
        };
      }
    } catch (error: any) {
      console.log("Had error when fetch album by Id: ", error);
    } finally {
      set({ isLoading: false });
    }
  },
  addSongToAlbumUser: async (albumId, song) => {
    set({ isLoading: true });
    const originalAlbum = _.cloneDeep(get().currentAlbum);
    try {
      const current = get().currentAlbum;
      if (current) {
        const newSongs = [...current.songs, song];
        set({
          currentAlbum: { ...current, songs: newSongs },
          isLoading: false
        });
      }

      // Call  API update data
      try {
        await axiosIntance.post("albums/addnew", { albumId, song });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (apiError) {
        set({ currentAlbum: originalAlbum, });
        toast.error("Had error when update data in Album");
      }
    } catch (error: any) {
      console.log("Had error when add song to album");
    } finally {
      set({ isLoading: false })
    }
  },
  minusSongAlbumUser: async (albumId, song) => {
    set({ isLoading: true });
    const originalAlbum = _.cloneDeep(get().currentAlbum);

    try {
      const current = _.cloneDeep(get().currentAlbum);
      if (current) {
        const newDataSong = current.songs.filter(i => i._id !== song._id);
        set({
          currentAlbum: { ...current, songs: newDataSong },
          isLoading: false,
        });
      }

      try {
        await axiosIntance.post("albums/deleteSong", { albumId, song });
      } catch (error: any) {
        set({ currentAlbum: originalAlbum, });
        toast.error("Had error when delete song");
      }
    } catch (error: any) {
      console.log("Had error when minus song from album")
    } finally {
      set({ isLoading: false });
    }
  },

}))