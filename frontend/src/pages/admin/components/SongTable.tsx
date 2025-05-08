import { Calendar, PenLine, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useMusicStore } from "../../../stores/useMusicStore"
import { Button } from "../../../components/ui/button";
import PaginationTable from "./Pagination/Pagination";

const SongTable = () => {
  const { songs, isLoading, error, deleteSongAdmin } = useMusicStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }



  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[70px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img src={song.imageUrl} alt={song.title} className="size-12 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {song.createdAt.split("T")[0]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant={"ghost"} size={'sm'}
                    className="text-yellow-500 hover:text-yellow-300 hover:bg-red-400/10"
                    onClick={() => {
                      // deleteSongAdmin(song._id)
                    }}
                  >
                    <PenLine className="size-4" />
                  </Button>
                  <Button variant={"ghost"} size={'sm'}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => {
                      deleteSongAdmin(song._id)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table >
      <PaginationTable />
    </>
  )
}
export default SongTable