import { useEffect, useRef, useState } from "react"
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useMusicStore } from "../../stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { userId } = useAuth()
  const { isPlaying, playNext, currentSong, isShuffle, shuffle, queue, isLoop, recordListen } = usePlayerStore();
  const { featuredSongs, madeForYouSongs, trendingSongs } = useMusicStore();

  // State to track listen progress and prevent duplicate listens
  const [hasRecordedListen, setHasRecordedListen] = useState(false);

  // handle shuffle
  useEffect(() => {
    if (!queue) return;
    const newsQueue = isShuffle ? queue : [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
    shuffle(newsQueue);
  }, [isShuffle]);

  // handle pause/play with promise handling
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error('Error during play:', error);
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // handle songs ended
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (isLoop) {
        if (audio) {
          audio.currentTime = 0;

          // link fix error when play(): https://developer.chrome.com/blog/play-request-was-interrupted
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              if (error.name !== 'AbortError') {
                console.error('Error replaying looped song:', error);
              }
            });
          }
        }
      } else {
        playNext();
      }
    }

    audio?.addEventListener('ended', handleEnded);
    return () => audio?.removeEventListener('ended', handleEnded);
  }, [playNext, isLoop]);

  // handle songs changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;

    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.pause();
      audio.src = currentSong?.audioUrl;
      // reset the playback position
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;

      // Reset listen progress and recorded state
      setHasRecordedListen(false);

      if (isPlaying) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') {
              console.error('Error playing new song:', error);
            }
          });
        }
      }
    }
  }, [currentSong, isPlaying]);

  // Update loop attribute based on isLoop state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = isLoop;
  }, [isLoop]);

  // Track listen progress
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!audio || !currentSong || !userId) return;

      const progress = (audio.currentTime / audio.duration) * 100;
      // setListenProgress(progress);
      // Record listen if progress exceeds 80% and hasn't been recorded yet
      if (progress >= 80 && !hasRecordedListen) {
        console.log('check progress: ', progress);
        recordListen(currentSong._id, userId);
        setHasRecordedListen(true);
      }
    };

    audio?.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentSong, hasRecordedListen, recordListen]);

  return (
    <audio ref={audioRef} />
  )
}

export default AudioPlayer