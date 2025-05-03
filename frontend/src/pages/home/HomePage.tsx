import { useEffect } from "react";
import Topbar from "../../components/Topbar"
import { useMusicStore } from "../../stores/useMusicStore"
import FeaturedSection from "./components/featuredSection";
import { ScrollArea } from "../../components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";


const HomePage = () => {

  const {
    fetchFeaturedSong,
    fetchMadeForYouSong,
    fetchTrendingSong,
    isLoading,
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
  } = useMusicStore();

  useEffect(() => {
    fetchFeaturedSong();
    fetchMadeForYouSong();
    fetchTrendingSong();
  }, [fetchFeaturedSong, fetchMadeForYouSong, fetchTrendingSong]);


  console.log('featured: ', featuredSongs);
  console.log('made for you songs: ', madeForYouSongs);
  console.log('trending: ', trendingSongs);

  return (
    <main className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-86px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good Afternoon
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid title='Made for you' songs={madeForYouSongs} isLoading={isLoading} />
            <SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
          </div>
        </div>
      </ScrollArea>
    </main>
  )
}

export default HomePage