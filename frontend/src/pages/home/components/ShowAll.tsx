import { useNavigate, useParams } from "react-router-dom"
import { useMusicStore } from "../../../stores/useMusicStore"
import { Song } from "../../../types"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { formatDuraion } from "../../album/AlbumPage";

import MadeOfYouImage from '/SectionGrid/MadeForYou.jpg';
import TrendingImage from '/SectionGrid/viral_trending.jpg';

const ShowAll = () => {
  const { page } = useParams();
  const { isLoading, trendingSongs, madeForYouSongs, fetchMadeForYouSong, fetchTrendingSong, sloganMadeForYou, sloganTrending } = useMusicStore();
  const { currentSong, isPlaying, togglePlay, playAlbum } = usePlayerStore()
  const [songs, setSongs] = useState<Song[]>([]);
  const [bgCL, setBgCL] = useState('');
  const { albumsAdmin, fetchAlbum } = useMusicStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  useEffect(() => {
    if (!page) return;
    const fetchData = async (page: string) => {
      if (page === "Made for you") {
        await fetchMadeForYouSong();
      } else if (page === "Trending") {
        await fetchTrendingSong();
      } else {
        toast.error("Page not found");
      }
    }
    fetchData(page);
  }, [page]);

  useEffect(() => {
    if (page === "Made for you" && madeForYouSongs) {
      setSongs(madeForYouSongs);
      setBgCL('#978088');
    } else if (page === "Trending" && trendingSongs) {
      setSongs(trendingSongs);
      setBgCL('#cf2b3a');
    }
  }, [page, madeForYouSongs, trendingSongs]);

  const handlePlayAlbum = () => {
    if (!songs) return;

    const isCurrentAlbumPLaying = songs.some(song => song._id === currentSong?._id);
    if (isCurrentAlbumPLaying) return togglePlay();
    else playAlbum(songs);
  }

  const handlePlaySong = (index: number) => {
    if (!songs) return;
    playAlbum(songs, index);
  }

  if (isLoading) return null;

  return (
    <div className="h-full ">
      <ScrollArea className="h-full rounded-md">
        {/* Main content */}
        <div className="relative h-[100%]">
          <div className="absolute inset-0  pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${bgCL} 0px, ${bgCL} 10vh, #18181b 70vh, #18181b 100%)`
            }}
            aria-hidden='true' />

          {/* content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img src={page === 'Trending' ? TrendingImage : MadeOfYouImage} alt={page}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">{page}</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">{page === 'trending' ? sloganTrending : sloganMadeForYou}</span>
                  <span>• {songs.length} songs</span>
                </div>
              </div>
            </div>
            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                size='icon'
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                onClick={handlePlayAlbum}
              >
                {isPlaying && songs.some(song => currentSong?._id === song._id) ?
                  <Pause className="h-8 w-8 text-black" />
                  :
                  <Play className="h-8 w-8 text-black" />
                }
              </Button>
            </div>
            {/* Table section */}
            <div className="bg-black/1 backdrop-blur-sm border-t-zinc-100 pt-6 bg-black/5">
              {/* Table header */}
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Release Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              {/* song lists */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {songs.slice(0, 21).map((song, index) => {
                    const isCurrent = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        onClick={() => handlePlaySong(index)}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrent && isPlaying ?
                            <div className="text-green-500 size-4">♬</div>
                            :
                            <span className="group-hover:hidden">{index + 1}</span>
                          }
                          {!isCurrent &&
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          }
                        </div>
                        <div className="flex items-center gap-3">
                          <img src={song.imageUrl} alt={song.title}
                            className="size-10" />
                          <div>
                            <div className="font-medium text-white">{song.title}</div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">{song.createdAt.split('T')[0]}</div>
                        <div className="flex items-center">{formatDuraion(song.duration)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Suggestion */}
            <div className="bg-zinc-900/80 p-8">
              <h1 className="text-white text-lg font-bold mt-6 mb-4">Suggestion</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {albumsAdmin.map(album => (
                  <div key={album._id} className="group bg-zinc8700/40 rounded-md hover:bg-zinc-700/40 transition-all cursor-pointer p-4"
                    onClick={() => navigate(`/albums/${album._id}`)}>
                    <div className="relative">
                      <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                        <img src={album.imageUrl} alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1 mt-2 truncate">{album.title}</h3>
                    <p className="text-sm text-zinc-400 mb-2">{album.artist}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
export default ShowAll