/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Album, Artist, newArtist, Song } from "../types";
import artistService from "../services/artist.service";
import toast from "react-hot-toast";

interface ArtistStore {
  artists: Artist[],
  error: string | null,
  album_artist: Album[],
  song_artist: Song[],
  totalSong: number,
  totalPage: number,

  getAllArtist: () => Promise<void>,
  CreateNewArtist: (data: newArtist) => Promise<void>,
  getArtistSong: (artistId: string, page: number) => Promise<void>,
  getArtistAlbum: (artistId: string) => Promise<void>,
  updateArtist: (artistId: string, data: newArtist) => Promise<void>,
  deleteArtist: (artistId: string) => Promise<void>
}

export const useArtistStore = create<ArtistStore>((set) => ({
  artists: [],
  error: null,
  album_artist: [],
  song_artist: [],
  totalSong: 0,
  totalPage: 0,

  getAllArtist: async () => {
    set({ error: null });
    try {
      const res = await artistService.getAllArtist();
      // console.log("check data res store: ", res?.data);
      if (res && res.data.EC === 0) {
        set({ artists: [...res.data.artists] });
      } else toast.error(res?.data.EM);
      return;
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  getArtistAlbum: async (artistId) => {
    set({ error: null });
    try {
      const res = await artistService.getArtistAlbum(artistId);
      if (res && res.data.EC === 0) {
        set({ album_artist: res.data.albums })
      } else toast.error(res?.data.EM);
      return;
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  getArtistSong: async (artistId, page) => {
    set({ error: null });
    try {
      const res = await artistService.getArtistSong(artistId, page, true);
      if (res && res.data.EC === 0) {
        set({ song_artist: res.data.songs, totalSong: res.data.totalSong, totalPage: res.data.totalPage })
      } else toast.error(res?.data.EM);
      return;
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  CreateNewArtist: async (data) => {
    set({ error: null });
    try {
      if (!data) {
        toast.error("Missing required params");
        return;
      }
      const res = await artistService.CreateNewArtist({
        name: data.name,
        realName: data.realName,
        genres: data.genres,
        country: data.country,
        imageFile: data.imageFile,
      })
      if (res && res.data.EC === 0) {
        toast.success(res.data.EM);
      } else {
        toast.error(res?.data.EM);
      }
      return;
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  updateArtist: async (artistId, data) => {
    set({ error: null });
    try {
      if (!artistId || !data) {
        toast.error('Misisng required params');
        return;
      }
      const res = await artistService.updateDataArtist(artistId, data);
      if (res && res.data.EC === 0) {
        toast.success(res.data.EM);
      } else toast.error(res?.data.EM);
      return;
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  deleteArtist: async (artistId) => {
    set({ error: null });
    try {
      if (!artistId) {
        toast.error("Missing artistId");
      }
      const res = await artistService.deleteArtist(artistId);
      if (res && res.data.EC === 0) {
        toast.success(res.data.EM);
      } else toast.error(res?.data.EM);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

}))