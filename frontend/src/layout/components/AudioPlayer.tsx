import { useEffect, useRef } from "react"
import { usePlayerStore } from "../../stores/usePlayerStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { isPlaying, playNext, currentSong } = usePlayerStore();

  // handle paus/play
  useEffect(() => {
    if (isPlaying) audioRef.current?.play()
    else audioRef.current?.pause()
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