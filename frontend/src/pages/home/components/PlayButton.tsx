import { Pause, Play } from "lucide-react"
import { Song } from "../../../types"
import { usePlayerStore } from "../../../stores/usePlayerStore"
import { Button } from "../../../components/ui/button"

type PlayButton = {
  song: Song,
}

const PlayButton = ({ song }: PlayButton) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

  const isCurrentSong = currentSong?._id === song._id;

  const hanlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  }
  return (
    <Button onClick={hanlePlay} size={'icon'}
      className={` absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${isCurrentSong && isPlaying ? 'opacity-100 translate-y-2 translate-x-2 group-hover:translate-x-0' : 'opacity-0 group-hover:opacity-100'} `}
    >
      {isCurrentSong && isPlaying ?
        <Pause className="size-5 text-black" />
        :
        <Play className="size-5 text-black" />
      }
    </Button>
  )
}
export default PlayButton