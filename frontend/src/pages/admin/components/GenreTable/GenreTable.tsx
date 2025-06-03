import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { useGenreStore } from "../../../../stores/genreStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../../../components/ui/button";
import { Trash2 } from "lucide-react";
import UpdateGenre from "./UpdateGenre";
import toast from "react-hot-toast";

const GenreTable = () => {
  const { genres, isLoading, fetchDataGenre, error, deleteGenre } = useGenreStore();
  useEffect(() => {
    fetchDataGenre();
  }, [fetchDataGenre]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading genres...</div>
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

  const hanleDeleteGenre = (genreId: string, numberOfSong: number) => {
    if (numberOfSong > 0) {
      toast.error("Cannot delete this genre");
      return;
    }
    deleteGenre(genreId);
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[70px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Total Song</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.map((genre) => (
            <TableRow key={genre._id} className="hover:bg-zinc-800/50">
              <TableCell>
                <img src={genre.imageUrl} alt={genre._id} className="size-12 rounded object-cover" />
              </TableCell>
              <TableCell className="font-medium">{genre.name}</TableCell>
              <TableCell className="max-w-[150px]">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="max-w-full truncate overflow-hidden mr-2 hover:underline cursor-pointer">
                      {genre.description}
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Description</DialogTitle>
                      <DialogDescription>
                        {genre.description}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>{genre.numberOfSong}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  {/* <Calendar className="h-4 w-4" /> */}
                  {genre.updatedAt.split("T")[0]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">

                  <UpdateGenre genre={genre} />
                  <Button variant={"ghost"} size={'sm'}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => {
                      hanleDeleteGenre(genre._id, genre.numberOfSong ?? 0)
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
      {/* <PaginationTable /> */}
    </>
  )
}
export default GenreTable