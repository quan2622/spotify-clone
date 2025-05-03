import { create } from "zustand";
import { Song } from "../types";

interface PlayerStore {
  currentSong: Song | null,
  isPlaying: boolean,
  queue: Song[],
  currentIndex: number,

  initializeQueue: (songs: Song[]) => void,
  playAlbum: (songs: Song[], startIndex?: number) => void,
  setCurrentSong: (song: Song | null) => void,
  togglePlay: () => void,
  playNext: () => void,
  playPrevious: () => void,
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentIndex: -1,
  queue: [],
  currentSong: null,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: [...songs],
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,

    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    })
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const songIndex = get().queue.findIndex(s => song._id === s._id);
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    })
  },
  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },
  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentIndex: nextIndex,
        currentSong: nextSong,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentIndex: prevIndex,
        currentSong: prevSong,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },
}))