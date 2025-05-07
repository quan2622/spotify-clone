import { useEffect, useRef } from "react"
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useMusicStore } from "../../stores/useMusicStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { isPlaying, playNext, currentSong, isShuffle, shuffle, queue } = usePlayerStore();
  const { featuredSongs, madeForYouSongs, trendingSongs } = useMusicStore();

  // handle shuffle
  useEffect(() => {
    if (!queue) return;
    const newsQueue = isShuffle ? queue : [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
    shuffle(newsQueue);
  }, [isShuffle]);

  // handle paus/play
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play()
    }
    else audioRef.current.pause()
  }, [isPlaying]);

  // handle songs ended
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      playNext();
    }

    audio?.addEventListener('ended', handleEnded);
    return () => audio?.removeEventListener('ended', handleEnded);
  }, [playNext]);

  // handle songs changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      // reset the playback position
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;

      if (isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);

  return (
    <audio ref={audioRef} />
  )
}
export default AudioPlayer