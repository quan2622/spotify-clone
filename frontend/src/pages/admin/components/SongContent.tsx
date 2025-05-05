import { Music } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import SongTable from "./SongTable"
import AddSong from "./AddSong"

const SongContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-emerald-500" />
              Songs Library
            </CardTitle>
            <CardDescription>
              Manage your music tracks
            </CardDescription>
          </div>
          <AddSong />

        </div>
      </CardHeader>
      <CardContent>
        <SongTable />
      </CardContent>
    </Card>
  )
}
export default SongContent