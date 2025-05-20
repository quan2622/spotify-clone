import { Song } from "../../../types";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { CirclePlus, Music, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface DataTableProps {
  data: Song[];
}

export const formatDuraion = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const remainingSecond = duration % 60;
  return `${minutes}:${remainingSecond.toString().padStart(2, '0')}`;
}

export function DataTable({ data, }: DataTableProps) {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const [songSelected, setSongSelected] = useState(-1);

  useEffect(() => {
    usePlayerStore.setState({ queue: data })
  }, [data]);

  useEffect(() => {
    if (!currentSong) return;
    let index = data.findIndex(song => song._id === currentSong._id);
    setSongSelected(index);
  }, [currentSong]);

  const hanldePlaySong = (song: Song) => {
    if (song._id !== currentSong?._id) {
      setCurrentSong(song);
    } else togglePlay();
  }

  return (
    <>
      {data.length ? (
        <div className="px-2">
          <div className="space-y-2 py-4">
            {data.map((song, index) => {
              let isCurrentSong = song._id === currentSong?._id;
              return (
                <div key={song._id} className={`grid grid-cols-[16px_4fr_2fr] gap-4 px-4 py-2 group  hover:bg-white/5 rounded-md group cursor-pointer ${songSelected === index ? "bg-emerald-600 text-white" : "text-zinc-400"}`} onClick={() => setSongSelected(index)}>
                  <div className="flex items-center justify-center">
                    {isCurrentSong ?
                      isPlaying ? (
                        <div className="text-green-500 size-6">♬</div>
                      ) : (
                        <span className="group-hover:hidden">
                          {index + 1}
                        </span>
                      )
                      :
                      <span className="hidden group-hover:block" onClick={() => hanldePlaySong(song)}>
                        <Play className="size-5" />
                      </span>
                    }
                  </div>
                  <div className="flex gap-4">
                    <img src={song.imageUrl} alt="" className="size-12 object-cover object-center" />
                    <div>
                      <div className="font-medium text-sm mb-1">{song.title}</div>
                      <div className="text-xs">{song.artist}</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-10 items-center pr-3">
                    <CirclePlus className="cursor-pointer" />
                    <span>
                      {formatDuraion(song.duration)}
                    </span>
                  </div>
                </div>
              )
            })
            }
          </div >
        </div >
      ) : (
        <div className="px-4 font-semibold flex justify-center items-center gap-3">
          <Music className="size-20 shadow-[1px_1px_14px] shadow-emerald-600 p-4 rounded-full animate-pulse" />
          <span className="text-lg">Not Found</span>
        </div>
      )
      }
    </>
  );
}
