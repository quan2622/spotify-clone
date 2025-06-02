import { useEffect } from "react";
import { useMusicStore } from "../../stores/useMusicStore"
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "../../components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "../../stores/usePlayerStore";
import { useAuth } from "@clerk/clerk-react";


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

  const { userId } = useAuth();
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSong();
    fetchMadeForYouSong();
    fetchTrendingSong();
  }, [fetchFeaturedSong, fetchMadeForYouSong, fetchTrendingSong]);

  useEffect(() => {
    if (featuredSongs.length > 0 && madeForYouSongs.length > 0 && trendingSongs.length > 0) {
      const newsQueue = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(newsQueue);
    }
  }, [initializeQueue, featuredSongs, trendingSongs, madeForYouSongs]);


  return (
    <main className="h-full   rounded-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-178px)] pb-6 pt-2">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good Afternoon
          </h1>
          <FeaturedSection />

          <div className="space-y-8">
            {userId &&
              <SectionGrid title='Made for you' songs={madeForYouSongs} isLoading={isLoading} />
            }
            <SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
          </div>
        </div>
      </ScrollArea>
    </main>
  )
}

export default HomePage