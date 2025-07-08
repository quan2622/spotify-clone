import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Album, Song } from "../../../types";
import { useMusicStore } from "../../../stores/useMusicStore";
import toast from "react-hot-toast";
import { axiosIntance } from "../../../lib/axios";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { useAlbumStore } from "../../../stores/useAlbumStore";

type SuggestionAlbum_User = {
  album: Album;
  formatDuraion: (duration: number) => string;
};

const SuggestionAlbum_User = ({
  album,
  formatDuraion,
}: SuggestionAlbum_User) => {
  const { featuredSongs } = useMusicStore();
  const { addSongToAlbumUser, currentAlbum } = useAlbumStore();
  const { setQueue } = usePlayerStore();
  const [songSelected, setSongSelected] = useState<string>("");
  const [dataSuggest, setDataSuggest] = useState<Song[]>([]);

  useEffect(() => {
    setDataSuggest(featuredSongs);
  }, [setDataSuggest, featuredSongs]);

  useEffect(() => {
    setQueue(currentAlbum?.songs ?? []);
  }, [currentAlbum, setQueue]);

  const handleAddNewSong = async (song: Song) => {
    await addSongToAlbumUser(album._id, song);
  };

  const handleFetchData = async () => {
    try {
      const res = await axiosIntance.get("songs/featured");
      if (res.data) setDataSuggest(res.data.songs);
    } catch {
      toast.error("Had error when refresh new data");
    }
  };

  return (
    <div className="bg-zinc-900/80 p-4">
      <h1 className="text-white text-lg font-bold mt-6 mb-4">Suggestion</h1>
      <div className="px-4">
        <div className="space-y-2 py-4">
          {dataSuggest.map((song, index) => {
            const isSelected = songSelected === song._id;
            const isExist = album.songs.some((s) => s._id === song._id);
            if (!isExist)
              return (
                <div
                  key={song._id}
                  className={`grid grid-cols-[16px_4fr_2fr_1fr] px-4 py-2 gap-4 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer group ${isSelected ? "bg-zinc-600 hover:bg-zinc-600" : ""
                    }`}
                  onClick={() => setSongSelected(song._id)}
                >
                  <div className="flex items-center opacity-0">{index + 1}</div>
                  <div className="flex items-center">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <div className="ml-5">
                      <div className="text-sm text-white">{song.title}</div>
                      <div className="text-sm mt-1">
                        {song.artistId.map((item) => item.name).join(" • ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">
                      {" "}
                      {song.createdAt.split("T")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="ml-1">{formatDuraion(song.duration)}</span>
                    <PlusCircle
                      className={`${isSelected ? "opacity-100" : "opacity-0"
                        } group-hover:opacity-100 ml-4`}
                      onClick={() => handleAddNewSong(song)}
                    />
                  </div>
                </div>
              );
          })}
        </div>
        <div className="flex items-center justify-end">
          <div
            className="text-xs md:text-sm text-white pr-20 hover:font-semibold cursor-pointer"
            onClick={handleFetchData}
          >
            Refresh
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(SuggestionAlbum_User);
