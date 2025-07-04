import { useEffect, useState } from "react"
import FeatureGirdSkeleton from "../../../components/skeleton/FeatureGirdSkeleton"
import { useMusicStore } from "../../../stores/useMusicStore"
import { useUIStore } from "../../../stores/useUIStore"
import PlayButton from "./PlayButton"

const FeaturedSection = () => {
  const { isLoading, featuredSongs, error } = useMusicStore()
  const { mainSize, handleGetPrimColor } = useUIStore();

  const [lagreSize, setLargeSize] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    handleGetPrimColor(imageUrl);
  }, [imageUrl])

  useEffect(() => {
    if (mainSize === 88) {
      setLargeSize(true);
    } else setLargeSize(false);
  }, [mainSize]);

  if (isLoading) return <FeatureGirdSkeleton />
  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${lagreSize ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-8`}>
      {featuredSongs.map((song) => (
        <div key={song._id}
          className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
          onMouseEnter={() => setImageUrl(song.imageUrl)}
        // onMouseLeave={() => setImageUrl("")}
        >
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-16 sm:w-20 h16 sm:h-20 object-cover flex-shrink-0" />
          <div className="flex flex-col p-4">
            <p className="font-medium truncate w-[160px]">{song.title}</p>
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