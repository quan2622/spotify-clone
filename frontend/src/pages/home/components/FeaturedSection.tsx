import { useEffect, useState } from "react"
import FeatureGirdSkeleton from "../../../components/skeleton/FeatureGirdSkeleton"
import { useMusicStore } from "../../../stores/useMusicStore"
import { useUIStore } from "../../../stores/useUIStore"
import PlayButton from "./PlayButton"
import type { Song } from "../../../types"

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore()
  const { mainSize, handleGetPrimColor } = useUIStore();

  const [lagreSize, setLargeSize] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [songRender, setSongRender] = useState<Song[]>([]);

  useEffect(() => {
    handleGetPrimColor(imageUrl);
  }, [imageUrl])

  useEffect(() => {
    if (mainSize >= 74) {
      setLargeSize(true);
    } else setLargeSize(false);
  }, [mainSize]);

  useEffect(() => {
    if (featuredSongs)
      setSongRender(featuredSongs);
  }, [featuredSongs])

  if (isLoading) return <FeatureGirdSkeleton />
  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 ${lagreSize ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-8 transition-all ease duration-300 `}>

      {songRender.map((song) => (
        <div key={song._id}
          className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative hover:shadow-[0_0_16px] hover:shadow-stone-500"
          onMouseEnter={() => setImageUrl(song.imageUrl)}
        // onMouseLeave={() => setImageUrl("")}
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h16 sm:h-20 object-cover flex-shrink-0" />
          <div className="flex flex-col p-4">
            <p className={`font-medium truncate ${lagreSize && mainSize === 88 ? 'w-[200px]' : 'w-[150px]'} `}>{song.title}</p>
            <div className="w-full overflow-hidden">
              <p className="text-sm text-zinc-400 truncate">{song.artistId.map(item => item.name).join(" • ")}</p>
            </div>
          </div>
          <PlayButton song={song} />
        </div>
      ))}
    </div>
  )
}
export default FeaturedSection