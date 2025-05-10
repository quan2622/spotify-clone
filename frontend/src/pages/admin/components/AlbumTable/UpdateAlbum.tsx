import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { PencilLine } from "lucide-react";
import { Album, Song } from "../../../../types";
import Fuse from 'fuse.js'
import { useMusicStore } from "../../../../stores/useMusicStore";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { axiosIntance } from "../../../../lib/axios";
import toast from "react-hot-toast";

type UpdateAlbum = {
  album: Album
}

const UpdateAlbum = ({ album }: UpdateAlbum) => {
  const { songs, fetchAlbum, fetchAlbumById, currentAlbum } = useMusicStore();

  const [albumDialog, setAlbumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);

  // console.log('check songs admin: ', songs, availableSongs);

  useEffect(() => {
    fetchAlbumById(album._id);
  }, [albumDialog]);
  useEffect(() => {
    // console.log('Check current album: ', currentAlbum);
    if (currentAlbum?._id !== album._id) return;

    setAvailableSongs(songs.filter(song =>
      !currentAlbum.songs.some(item => item._id === song._id)
    ));

    setAlbumSongs([...currentAlbum.songs]);
  }, [currentAlbum]);

  const fuse = new Fuse(songs, {
    keys: ['title', 'artist'],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });

  const handleSearch = (e: any) => {
    const sr_query = e.target.value;
    setQuery(sr_query);

    if (sr_query.length === 0) {
      setAvailableSongs(songs)
    } else {
      const results = fuse.search(sr_query);
      setAvailableSongs(results.map(result => result.item))
    }
  }

  const addToAlbum = (song: Song) => {
    setAlbumSongs([song, ...albumSongs]);
    setAvailableSongs(availableSongs.filter(s => s._id !== song._id))
  }
  const removeFromAlbum = (song: Song) => {
    setAlbumSongs(albumSongs.filter(s => s._id !== song._id));
    setAvailableSongs([song, ...availableSongs]);
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const songIds = albumSongs.map(item => item._id);
      await axiosIntance.put(`admin/albums/update/${album._id}`, { songIds })
      toast.success('Update album successed');
      await fetchAlbum();
      setAlbumDialog(false);
    } catch (error: any) {
      toast.error('Had an error when update album', error.message);
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <Dialog open={albumDialog} onOpenChange={setAlbumDialog}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'sm'} className="text-yellow-500 hover:text-yellow-300 hover:bg-red-400/10">
          <PencilLine className="h-4 w-4 mt-[3px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[90vh] overflow-auto sm:max-w-4xl min-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{album.title} </DialogTitle>
          <DialogDescription>
            Add new song to album.
          </DialogDescription>
        </DialogHeader>
        <div className="container mx-auto p-4 pt-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Cột trái: Danh sách bài hát có sẵn */}
            <div className="w-full md:w-1/2 rounded-lg shadow-md p-3 border border-zinc-700">
              <h2 className="text-lg font-semibold mb-3 ml-2">Songs list</h2>
              <input
                type="text"
                placeholder="Search for song or artist ..."
                value={query}
                onChange={handleSearch}
                className="w-[92%] p-3 border rounded-md mb-4 mx-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-800"
              />
              <ScrollArea className="h-60">
                <ul className="px-3">
                  {availableSongs.map((song) => (
                    <li
                      key={song._id}
                      className="flex justify-between items-center p-2 hover:bg-zinc-500 rounded-md"
                    >
                      <span className="flex-1 pr-4 text-sm break-words">
                        {song.title} - {song.artist}
                      </span>
                      <Button size={'icon'}
                        onClick={() => addToAlbum(song)}
                        className="bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        +
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            {/* Cột phải: Bài hát trong album */}
            <div className="w-full md:w-1/2 rounded-lg p-3 border border-zinc-700">
              <h2 className="text-lg font-semibold mb-2">Song in album</h2>
              <p className="text-sm text-gray-600 mb-4">
                Total: {albumSongs.length} songs
              </p>
              <ScrollArea className="h-60">
                <ul className="px-3">
                  {albumSongs.length === 0 ? (
                    <li className="text-gray-500">No songs yet</li>
                  ) : (
                    albumSongs.map((song) => (
                      <li
                        key={`${song._id}-album`}
                        className="flex justify-between items-center p-2 hover:bg-zinc-500 rounded-md"
                      >
                        <span className="flex-1 pr-4 text-sm break-words">
                          {song.title} - {song.artist}
                        </span>
                        <Button size={'icon'}
                          onClick={() => removeFromAlbum(song)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        >
                          -
                        </Button>
                      </li>
                    ))
                  )}
                </ul>
              </ScrollArea>
            </div>
          </div>
        </div>


        <DialogFooter>
          <Button variant={"outline"} onClick={() => setAlbumDialog(false)}
            disabled={isLoading}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Uploading ...' : 'Add Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
export default UpdateAlbum