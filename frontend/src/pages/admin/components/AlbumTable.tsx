import { useEffect } from "react";
import { useMusicStore } from "../../../stores/useMusicStore"
import { Calendar, Music, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";

const AlbumTable = () => {
  const { albums, deleteAlbumAdmin, fetchAlbum } = useMusicStore();

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-zinc-800/50">
          <TableHead className="w-[70px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Release Year</TableHead>
          <TableHead>Songs</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albums.map((album) => (
          <TableRow key={album._id} className="hover:bg-zinc-800/50">
            <TableCell>
              <img src={album.imageUrl} alt={album.title} className="size-12 rounded object-cover" />
            </TableCell>
            <TableCell className="font-medium">{album.title}</TableCell>
            <TableCell>{album.artist}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-zinc-400">
                <Calendar className="h-4 w-4" />
                {album.releaseYear}
              </span>
            </TableCell>
            <TableCell>
              <div className="inline-flex items-center gap-2">
                <Music className="w-4 h-4" />
                {album.songs.length} songs
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button variant={"ghost"} size={'sm'}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => {
                    deleteAlbumAdmin(album._id)
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default AlbumTable