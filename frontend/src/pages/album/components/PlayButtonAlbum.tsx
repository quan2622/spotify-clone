import { Pause, Play } from "lucide-react";
import { Button } from "../../../components/ui/button"
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { useEffect, useState } from "react";
import albumService from "../../../services/album.service";
import toast from "react-hot-toast";
import _ from "lodash";
import type { Album } from "../../../types";

const PlayButtonAlbum = ({ album }: { album: Album }) => {
  const { playAlbum, setCurrentAlbum, currentAlbum, isPlaying } = usePlayerStore();
  const [albumPlay, setAlbumPlay] = useState<any>();
  let isCurrentAlbum = currentAlbum?._id && album?._id && currentAlbum._id === album._id;

  useEffect(() => {
    handleFecthingData();
  }, []);

  // useEffect(() => {
  //   if (!currentAlbum.songs) {

  //   }

  // }, [currentAlbum]);

  const handlePlayAlbum = () => {
    if (isCurrentAlbum) {
      playAlbum(albumPlay.songs, 0, album._id);
    }
    else if (albumPlay && albumPlay.songs?.length > 0) {
      playAlbum(albumPlay.songs);
      setCurrentAlbum(albumPlay.album_data);
    }
    else toast.error("Not found song!");
  }

  const handleFecthingData = async () => {
    const response = await albumService.getDataAlbumSystem(album._id);
    if (response && response.data && response.data.EC === 0) {
      const dataSave = {
        album_data: response.data.album_data,
        songs: response.data.songs,
      }
      setAlbumPlay(dataSave);
    } else {
      toast.error(response?.data.EM);
    }
  }


  return (
    <Button onClick={handlePlayAlbum} size={'icon'}
      className={` absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${isCurrentAlbum && isPlaying ? 'opacity-100 translate-y-2 translate-x-2 group-hover:translate-x-0' : 'opacity-0 group-hover:opacity-100'} `}
    >
      {isCurrentAlbum && isPlaying ?
        <Pause className="size-5 text-black" />
        :
        <Play className="size-5 text-black" />
      }
    </Button>
  )
}
export default PlayButtonAlbum