import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { Button } from "../../components/ui/button";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Slider } from "../../components/ui/slider";
import { Link } from "react-router-dom";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
};

const PlayBackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    isShuffle,
    isLoop,
    toggleLoop,
  } = usePlayerStore();
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => usePlayerStore.setState({ isPlaying: false });
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-x-[1800px] mx-auto">
        {/* Current playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[20%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate ">
                  {currentSong.artistId.map((item, index) => (
                    <React.Fragment key={index}>
                      <Link
                        to={`artist/${item._id}`}
                        className="inline-block cursor-pointer hover:underline"
                      >
                        {item.name}
                      </Link>
                      {index < currentSong.artistId.length - 1 && ` | `}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {/* player control */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => toggleShuffle()}
              className={`hidden sm:inline-flex hover:text-white ${
                isShuffle ? "text-emerald-500" : "text-zinc-400"
              }`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="bg-white hover: bg-white/80 text-black rounded-full h-8 w-8"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => toggleLoop()}
              className={`hidden sm:inline-flex hover:text-white ${
                isLoop ? "text-emerald-500" : "text-zinc-400"
              }`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">
              {formatTime(currentTime)}
            </div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>
        {/* Volume control */}
        <div className="hidden sm:flex items-center gap-1 min-w-[300px] w-40% justify-end">
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:text-white text-zinc-400"
          >
            <Laptop2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hover:text-white text-zinc-400"
            >
              {volume === 0 ? (
                <VolumeOff className="h-4 w-4" />
              ) : (
                <>
                  {volume > 50 ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <Volume1 className="h-4 w-4" />
                  )}
                </>
              )}
            </Button>
            <Slider
              value={[volume]}
              step={1}
              max={100}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
    // <></>
  );
};
export default PlayBackControls;
