import { create } from "zustand";
import { Song, type Album } from "../types";
import { useChatStore } from "./useChatStore";
import { axiosIntance } from "../lib/axios";
import _ from "lodash";

interface PlayerStore {
  currentSong: Song | null,
  currentAlbum: any | null,
  isPlaying: boolean,
  queue: Song[],
  currentIndex: number,
  isShuffle: boolean,
  isLoop: boolean,
  totalListens: number,
  setCurrentAlbum: (album: any | null) => void,

  initializeQueue: (songs: Song[]) => void,
  setQueue: (songs: Song[]) => void,
  playAlbum: (songs: Song[], startIndex?: number) => void,
  setCurrentSong: (song: Song | null) => void,
  togglePlay: () => void,
  playNext: () => void,
  playPrevious: () => void,
  toggleShuffle: () => void,
  toggleLoop: () => void,
  shuffle: (songs: Song[]) => void,
  updateSongListens: (songId: string, totalListens: number) => void,
  recordListen: (songId: string, userId: string) => Promise<void>,
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentIndex: -1,
  queue: [],
  currentSong: null,
  isShuffle: false,
  isLoop: false,
  totalListens: 0,
  currentAlbum: null,

  setCurrentAlbum: (album) => {
    if (!album) return;

    set({ currentAlbum: album, queue: album.songs });
  },
  toggleLoop: () => {
    set({ isLoop: !get().isLoop });
  },
  shuffle: (songs) => {
    const song_clone = songs.filter(song => song._id !== get().currentSong?._id);
    if (!get().isShuffle) {
      return set({ queue: song_clone });
    }
    const flag = song_clone;
    do {
      for (let i = song_clone.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [song_clone[i], song_clone[j]] = [song_clone[j], song_clone[i]];
      }
    } while (flag.length === song_clone.length && song_clone.every((item, index) => item === flag[index]));
    set({ queue: song_clone });
  },
  toggleShuffle: () => {
    set({ isShuffle: !get().isShuffle });
  },
  initializeQueue: (songs: Song[]) => {
    set({
      queue: [...songs],
      currentSong: songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  setQueue: (songs: Song[]) => {
    set({
      queue: [...songs],
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    let song = <Song> {};

    if (get().queue && !_.isEqual(get().queue, songs)) {
      if (startIndex === 0) {

        // const songInAlbum = songs.some(song => song._id === get().currentSong?._id);

        const index = songs.findIndex(item => item._id === get().currentSong?._id)
        // console.log("Check current song: ", get().currentSong);
        // console.log("Check song in album: ", songs);
        // console.log("Check index: ", startIndex, ' - ', index);
        song = songs[index !== -1 ? index : startIndex];
      } else {
        song = songs[startIndex];
      }
    } else {
      song = songs[startIndex];
    }

    if (song) {
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${song.title} by ${song.artistId.map(item => item.name).join(" • ")}`
        })
      }

      set({
        queue: songs,
        currentSong: song,
        currentIndex: startIndex,
        isPlaying: true,
      })
    }
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artistId.map(item => item.name).join(" • ")}`
      })
    };

    const songIndex = get().queue.findIndex(s => song._id === s._id);
    set({
      currentSong: song,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
      isPlaying: true,
    })
  },
  togglePlay: () => {
    const isPlaying = !get().isPlaying;
    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: isPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artistId.map(item => item.name).join(" • ")}` : 'Idle'
      })
    }
    set({ isPlaying: !get().isPlaying });
  },
  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artistId.map(item => item.name).join(" • ")}`,
        })
      }

      set({
        currentIndex: nextIndex,
        currentSong: nextSong,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Idle`,
        })
      }
    }
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artistId.map(item => item.name).join(" • ")}`,
        })
      }

      set({
        currentIndex: prevIndex,
        currentSong: prevSong,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Idle`,
        })
      }
    }
  },
  updateSongListens: (songId, totalListens) => {
    set((state) => ({
      queue: state.queue.map((song) =>
        song._id === songId ? { ...song, totalListens } : song
      ),
      currentSong:
        state.currentSong && state.currentSong._id === songId
          ? { ...state.currentSong, totalListens }
          : state.currentSong,
    }));
  },
  recordListen: async (songId, userId) => {
    const payload = { songId, userId };

    try {
      const response = await axiosIntance.post("stats/recordListen", payload);
      const data = response.data;
      console.log("check data return: ", data);
      if (data.success) {
        get().updateSongListens(songId, data.totalListens);
      } else {
        throw new Error(data.message || "API error");
      }
    } catch (error) {
      console.error("Error recording listen:", error);
    }
  },
}))