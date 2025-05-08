import { Library, ListMusic } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuthStore } from "../../stores/useAuthStore"
import DashBoardStatus from "./components/DashBoardStatus"
import Header from "./components/Header"
import AlbumContent from "./components/AlbumContent"
import SongContent from "./components/SongContent"
import { useEffect } from "react"
import { useMusicStore } from "../../stores/useMusicStore"

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore()
  const { fetchStat, getSongPaginate, fetchAlbum } = useMusicStore();

  useEffect(() => {
    fetchAlbum();
    fetchStat();
    getSongPaginate();
  }, [fetchStat, fetchAlbum, getSongPaginate]);


  if (!isAdmin && !isLoading) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />

      <DashBoardStatus />

      <Tabs defaultValue="song" className="space-y-4">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger value="song" className="data-[state=active]:bg-zinc-700">
            <ListMusic className="mr-2 size-4" /> songs
          </TabsTrigger>
          <TabsTrigger value="album" className="data-[state=active]:bg-zinc-700">
            <Library className="mr-2 size-4" /> albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="song"><SongContent /> </TabsContent>
        <TabsContent value="album"><AlbumContent /> </TabsContent>
      </Tabs>
    </div>
  )
}
export default AdminPage