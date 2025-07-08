import { Pause, Play } from "lucide-react";
import { Button } from "../../../components/ui/button"
import { usePlayerStore } from "../../../stores/usePlayerStore";
import { useEffect, useState } from "react";
import albumService from "../../../services/album.service";
import toast from "react-hot-toast";
import _ from "lodash";

const PlayButtonAlbum = ({ albumId }: { albumId: string }) => {
  const { playAlbum, setCurrentAlbum, currentAlbum, isPlaying, togglePlay, queue } = usePlayerStore();
  const [isCurrentAlbum, setIsCurrentAlbum] = useState(false);

  useEffect(() => {
    if (albumId !== " ") {
      handleFecthingData();
    }
  }, [albumId]);


  useEffect(() => {
    if (currentAlbum)
      setIsCurrentAlbum(currentAlbum.album_data._id === albumId);
  }, [currentAlbum])

  const handleFecthingData = async () => {
    const response = await albumService.getDataAlbumSystem(albumId);
    if (response && response.data && response.data.EC === 0) {
      const dataSave = {
        album_data: response.data.album_data,
        songs: response.data.songs,
      }
      setCurrentAlbum(dataSave)
    } else {
      toast.error(response?.data.EM);
    }
  }

  const handlePlayAlbum = () => {
    const isCurrentAlbumPLaying = _.isEqual(currentAlbum.songs, queue);
    if (isCurrentAlbumPLaying) togglePlay();
    else if (currentAlbum && currentAlbum.songs.length > 0)
      playAlbum(currentAlbum.songs);
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