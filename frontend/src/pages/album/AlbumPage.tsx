import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMusicStore } from "../../stores/useMusicStore";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import {
  CircleEllipsis,
  CircleMinus,
  Clock,
  Music,
  Pause,
  Play,
} from "lucide-react";
import { usePlayerStore } from "../../stores/usePlayerStore";
import UpdateAlbumUserDialog from "../../layout/components/UpdateAlbumUserDialog";
import SuggestionAlbum_User from "./components/SuggestionAlbum_User";
import { Song } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { axiosIntance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useAlbumStore } from "../../stores/useAlbumStore";

export const formatDuraion = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const remainingSecond = duration % 60;
  return `${minutes}:${remainingSecond.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { user } = useUser();
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { fetchFeaturedSong } = useMusicStore();

  const { isLoading, fetchAlbumById, currentAlbum, minusSongAlbumUser } = useAlbumStore();

  const {
    playAlbum,
    currentSong,
    currentIndex,
    isPlaying,
    togglePlay,
    setQueue,
  } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  useEffect(() => {
    fetchFeaturedSong();
  }, [fetchFeaturedSong]);

  useEffect(() => {
    setQueue(currentAlbum?.songs ?? []);
  }, [currentAlbum, setQueue]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPLaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPLaying) return togglePlay();
    else playAlbum(currentAlbum?.songs);
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum?.songs) return;
    playAlbum(currentAlbum?.songs, index);
  };

  const handleDeleteSong = async (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (albumId) {
      await minusSongAlbumUser(albumId, song);
    }
    if (currentAlbum?.songs.length === 1) {
      toast.error("No song in album here!");
    } else {
      if (currentAlbum?.songs) {
        if (currentIndex - 1 === 0) playAlbum(currentAlbum.songs);

        const newSongs = currentAlbum.songs.filter(
          (item) => item._id !== song._id
        );
        const newIndex = currentIndex - 1 === -1 ? 0 : currentIndex - 1;
        playAlbum(newSongs, newIndex);
        // togglePlay();
      }
    }
  };

  const hanleDeleteAlbum = async () => {
    const res = await axiosIntance.delete(`albums/delete/${albumId}`);
    if (res.data && res.data.EC === 0) {
      toast.success(res.data.EM);
      useMusicStore.setState((state) => ({
        albumsUser: state.albumsUser.filter((a) => a._id !== albumId),
      }));
      navigate("/");
    } else {
      toast.error("Had error when delete album");
    }
  };

  if (isLoading) return null;
  // console.log("check current album: ", currentAlbum);
  return (
    <div className="h-full ">
      <ScrollArea className="h-full rounded-md">
        {/* Main content */}
        <div className="relative h-[100%]">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div className="w-[240px] h-[240px] shadow-xl rounded bg-stone-900/50 flex items-center justify-between group relative">
                {currentAlbum?.imageUrl ? (
                  <img
                    src={currentAlbum.imageUrl}
                    alt={currentAlbum.title}
                    className="w-[240px] h-[240px] shadow-xl rounded "
                  />
                ) : (
                  <Music className="size-20 m-auto text-stone-400 group-hover:hidden" />
                )}

                <div className="hidden group-hover:block mx-auto absolute w-full h-full bg-neutral-900 opacity-70">
                  <UpdateAlbumUserDialog
                    albumId={albumId}
                    currentAlbum={currentAlbum}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold mb-4 truncate">
                  {currentAlbum?.title}
                </h1>
                <div className="text-lg mb-2 font-light italic">
                  {currentAlbum?.description}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.type === "user"
                      ? `${user?.lastName} ${user?.firstName}`
                      : currentAlbum?.artistId.name}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>
            {/* play button */}
            <div className="px-6 pb-4 flex items-center gap-6 justify-between">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                onClick={handlePlayAlbum}
              >
                {isPlaying &&
                  currentAlbum?.songs?.some(
                    (song) => currentSong?._id === song._id
                  ) ? (
                  <Pause className="h-8 w-8 text-black" />
                ) : (
                  <Play className="h-8 w-8 text-black" />
                )}
              </Button>
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <CircleEllipsis className="size-8 text-zinc-400 hover:text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-stone-800">
                    <DropdownMenuLabel>Choose Selection</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="hover:hover:bg-zinc-700 flex items-center"
                        onClick={() => hanleDeleteAlbum()}
                      >
                        <CircleMinus />
                        <span className="text-sm">Delete Album</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Table section */}
            <div className="bg-black/20 backdrop-blur-sm">
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
                  {currentAlbum?.songs?.map((song, index) => {
                    const isCurrent = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        onClick={() => handlePlaySong(index)}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrent && isPlaying ? (
                            <div className="text-green-500 size-4">♬</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrent && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="h-10 w-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-white">
                              {song.title}
                            </div>
                            <div>
                              {song.artistId
                                .map((item) => item.name)
                                .join(" • ")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          <span>{formatDuraion(song.duration)}</span>
                          <CircleMinus
                            className="ml-7 hidden group-hover:block"
                            onClick={(e) => handleDeleteSong(e, song)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Suggestion */}
            {currentAlbum?.type === "user" && (
              <SuggestionAlbum_User
                album={currentAlbum}
                formatDuraion={formatDuraion}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default AlbumPage;
