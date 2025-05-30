/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { Album, Genre, Song } from "../types"
import toast from "react-hot-toast"
import genreService from "../services/genre.service"

interface GenreStore {
  genres: Genre[],
  error: string | null,
  albumGenre: Album[],
  songGenre: Song[],

  fetchDataGenre: () => Promise<void>,
  fetchDetailGenre: (genreId: string) => Promise<void>,
  updateDataGenre: (payload: any, genreId: string) => Promise<void>,
  deleteGenre: (genreId: string) => Promise<void>,
  createNewGenre: (payload: any) => Promise<void>,
}

export const useGenreStore = create<GenreStore>((set) => ({
  genres: [],
  error: null,
  albumGenre: [],
  songGenre: [],

  fetchDetailGenre: async (genreId) => {
    set({ error: null });
    try {
      if (!genreId) {
        toast.error("Missing required params");
        return;
      }
      const res = await genreService.GetDetailGenre(genreId);
      if (!res) {
        console.log('Had error when call api in server');
        return;
      }

      if (res.data.EC !== 0) {
        console.log(">> Error fetchDetailGenre: ", res.data.EM);
      } else {
        set({
          songGenre: res.data.songs,
          albumGenre: res.data.albums,
        })
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  fetchDataGenre: async () => {
    set({ error: null })
    try {
      const res = await genreService.GetAllGenre();
      if (!res) {
        console.log('Had error when call api in server');
      } else {

        if (res.data.EC !== 0) {
          console.log(">> Error fetchDataGenre: ", res.data.EM);
          toast.error("Had error when get all genre");
        }
        set({ genres: res.data.list })
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  updateDataGenre: async (payload, genreId) => {
    try {
      const res = await genreService.UpdateGenre(payload, genreId);
      if (!res) {
        console.log('Had error when call api in server');
      } else {
        if (res.data.EC !== 0) {
          toast.error(res.data.EM);
        } else {
          console.log("New data updata: ", res.data.new_data);
          toast.success(res.data.EM);
        }
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  },
  deleteGenre: async (genreId) => {
    set({ error: null });
    try {
      if (!genreId) {
        toast.error("Missing required params");
        return;
      }
      const res = await genreService.DeleteGenre(genreId);
      if (!res) {
        console.log('Had error when call api in server');
      } else {
        if (res.data.EC !== 0) {
          toast.error(res.data.EM);
        } else {
          toast.success(res.data.EM);
        }
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  createNewGenre: async (payload) => {
    set({ error: null });
    try {
      const res = await genreService.CreateNew(payload);
      if (!res) {
        console.log('Had error when call api in server');
      } else {
        if (res.data.EC !== 0) {
          toast.error(res.data.EM);
        } else {
          toast.success(res.data.EM);
        }
      }
    } catch (error: any) {
      set({ error: error.message })
    }
  }
}))