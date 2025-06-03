import { Grip } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import AddGenreDialog from "./AddGenreDialog"
import GenreTable from "./GenreTable"


const GenreContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center gap-2 justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Grip className="h-5 w-5 text-orange-600" />
              Manage Genre
            </CardTitle>
            <CardDescription>Mange all genre of the song</CardDescription>
          </div>
          <AddGenreDialog />
        </div>
      </CardHeader>
      <CardContent>
        <GenreTable />
      </CardContent>
    </Card>
  )
}
export default GenreContent