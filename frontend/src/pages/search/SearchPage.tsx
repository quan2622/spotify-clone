import { useMusicStore } from "../../stores/useMusicStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { CircleEllipsis, Pause, Play } from "lucide-react";
import { usePlayerStore } from "../../stores/usePlayerStore";

import { DataTable } from "./Table/data-table"
import SearchPageSkeleton from "../../components/skeleton/SearchPageSkeleton";
import { Song } from "../../types";


const SearchPage = () => {
  const { dataSearch } = useParams();
  const { getAllSong, handleSearch, resultSearch, songsSearch } = useMusicStore();
  const { togglePlay, currentSong, setCurrentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    getAllSong();
  }, []);

  useEffect(() => {
    if (!dataSearch || !songsSearch) return;
    handleSearch(dataSearch);
  }, [dataSearch, songsSearch]);


  const handlePlaySong = (song: Song) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  }

  if (resultSearch.length === 0) {
    return <SearchPageSkeleton />
  }

  return (
    <div className="p-4">
      <div>
        <h2 className="font-bold text-3xl mb-3">Top result</h2>
        <div className="flex gap-6 bg-zinc-700/30 p-5 rounded-md">
          <div className="w-[35%] bg-zinc-900 p-4 rounded-md flex items-center justify-center min-h-[200px]">
            <img className="w-full rounded-md hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow ease duration-300 object-contain object-center"
              src={resultSearch[0].imageUrl} alt={resultSearch[0]._id} />
          </div>
          <div className="w-[50%] p-4">
            <div className="font-bold text-3xl">{resultSearch[0].title}</div>
            <div className="font-medium py-3"> Song • {resultSearch[0].artistId.map(item => item.name).join(" • ")}</div>
            <div className="text-sm pt-1 pb-5">May 19,2025 - <span>Duration: {resultSearch[0].duration} minutes</span> </div>
            <div className="flex gap-4 items-center">
              <Button size={"lg"} className="text-white font-semibold" onClick={() => handlePlaySong(resultSearch[0])}>
                {resultSearch[0]._id === currentSong?._id && isPlaying ?
                  <><Pause /> Pause</>
                  :
                  <><Play /> Play</>
                }
              </Button>

              <CircleEllipsis className="size-8 text-zinc-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-3xl">Songs</h2>
        <div className="container mx-auto pt-10">
          <DataTable data={resultSearch} />
        </div>
      </div>
    </div>
  )
}
export default SearchPage
