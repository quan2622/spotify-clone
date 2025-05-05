import { Library } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import AddAlbumDialog from "./AddAlbumDialog"
import AlbumTable from "./AlbumTable"

const AlbumContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center gap-2 justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-violet-500" />
              Albums Library
            </CardTitle>
            <CardDescription>Mange your album collection</CardDescription>
          </div>
          <AddAlbumDialog />
        </div>
      </CardHeader>
      <CardContent>
        <AlbumTable />
      </CardContent>
    </Card>
  )
}
export default AlbumContent