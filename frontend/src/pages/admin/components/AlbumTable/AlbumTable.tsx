import { useEffect, useState } from "react";
import { useMusicStore } from "../../../../stores/useMusicStore"
import { Calendar, Music, PencilLine, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import UpdateAlbum from "./UpdateAlbum";
import { useAlbumStore } from "../../../../stores/useAlbumStore";
import type { Album } from "../../../../types";

const AlbumTable = () => {
  const { fetchSongAdmin } = useMusicStore();
  const { fetchAlbum, albumsAdmin, deleteAlbumAdmin } = useAlbumStore();
  const [updateAlbum, setUpdateAlbum] = useState<Album | null>(null);

  useEffect(() => {
    fetchAlbum("ADMIN");
    fetchSongAdmin();
  }, [fetchAlbum, fetchSongAdmin]);

  const handleCLoseUpdateModal = () => {
    setUpdateAlbum(null);
  }

  return (
    <>
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
          {albumsAdmin.map((album) => (
            <TableRow key={album._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img src={album.imageUrl} alt={album.title} className="size-12 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium">{album.title}</TableCell>
              <TableCell>{album.artistId ? album.artistId.name : "Created by Admin"}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  {album.releaseYear}
                </span>
              </TableCell>
              <TableCell>
                <div className="inline-flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  {album.totalSong} songs
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant={'ghost'} size={'sm'} onClick={() => setUpdateAlbum(album)}
                    className="text-yellow-500 hover:text-yellow-300 hover:bg-red-400/10">
                    <PencilLine className="h-4 w-4 mt-[3px]" />
                  </Button>
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

      {updateAlbum &&
        <UpdateAlbum album={updateAlbum} handleClose={handleCLoseUpdateModal} />
      }

    </>
  )
}
export default AlbumTable