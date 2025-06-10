/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button";
import { BadgeAlert, CirclePlus, Upload } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import toast from "react-hot-toast";
import { axiosIntance } from "../../../../lib/axios";
import { useMusicStore } from "../../../../stores/useMusicStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useGenreStore } from "../../../../stores/genreStore";
import { useArtistStore } from "../../../../stores/artistStore";
import { Textarea } from "../../../../components/ui/textarea";
import { ScrollArea } from "../../../../components/ui/scroll-area";

const AddAlbumDialog = () => {
  const { fetchAlbum } = useMusicStore();
  const { genres, fetchDataGenre } = useGenreStore();
  const { artists, getAllArtist } = useArtistStore();
  const [albumDialog, setAlbumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [newAlbum, setNewAlbum] = useState<{ title: string, artist: string, genre: string, description: string, releaseYear: number }>({
    title: '',
    artist: '',
    genre: '',
    description: '',
    releaseYear: new Date().getFullYear(),
  })
  const [imageFile, setImageFile] = useState<File | null>(null);
  const wordCount = newAlbum.description.trim().split(/\s+/).length > 50;

  useEffect(() => {
    fetchDataGenre();
    getAllArtist();
  }, []);


  const handleSubmitCreate = async () => {
    console.log("check state: ", newAlbum);
    setIsLoading(true);
    try {
      if (!imageFile) {
        return toast.error('Please upload image file');
      }

      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('description', newAlbum.description);
      formData.append('artistId', newAlbum.artist);
      formData.append('genreId', newAlbum.genre);
      formData.append('type', 'admin');
      formData.append('releaseYear', (newAlbum.releaseYear).toString());
      formData.append('imageFile', imageFile);

      await axiosIntance.post('admin/albums', formData, {
        headers: { 'Content-Type': 'multipart/from-data' }
      });

      setNewAlbum({
        title: '',
        artist: '',
        genre: '',
        description: '',
        releaseYear: new Date().getFullYear(),
      })
      setImageFile(null);
      toast.success('Song added successfully');
      await fetchAlbum("ADMIN");
    } catch (error: any) {
      toast.error('Failed to add song: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={albumDialog} onOpenChange={setAlbumDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center rounded-md bg-violet-500 hover:bg-violet-800 text-white">
          <CirclePlus className="h-4 w-4 mt-[3px]" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 overflow-auto max-w-5xl py-10">
        <ScrollArea className="max-h-[80vh] px-5">
          <DialogHeader>
            <DialogTitle>Add New Album</DialogTitle>
            <DialogDescription>
              Add a new album to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <input type="file" accept="image/*" ref={imageInputRef} hidden
              onChange={(e) => setImageFile(e.target.files![0])} />
          </div>
          <div className="flex w-full gap-6">
            <div className="w-[40%] pt-2">
              {/* Image upload area */}
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg border-zinc-700 cursor-pointer"
                onClick={() => imageInputRef.current?.click()}>
                <div className="text-center">
                  {imageFile ?
                    (
                      <div className="space-y-2">
                        <div className="text-sm text-emerald-400">Image selected: </div>
                        <div className="tetx-xs text-zinc-400">{imageFile.name.slice(0, 20)}</div>
                      </div>
                    )
                    :
                    (<>
                      <div className="p-3 rounded-full inline-block">
                        <Upload className="h-10 w-10 text-zinc-600" />
                      </div>
                      <div className="text=sm text-zinc-400 mb-2">Upload artwork</div>
                      <Button variant={'outline'} size={'sm'} className="text-xs">
                        Choose file
                      </Button>
                    </>)
                  }
                </div>
              </div>
              {/* other fields */}
            </div>
            <div className="flex-1 w-[50%] pr-2">
              <div className="space-y-2">
                <label className="font-medium text-sm">Title</label>
                <Input value={newAlbum.title} onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="py-4">
                <div className="flex gap-3">
                  <div className="w-1/2 space-y-2">
                    <label className="font-medium text-sm">Genre</label>
                    <Select onValueChange={(value) => setNewAlbum({ ...newAlbum, genre: value })}>
                      <SelectTrigger className="w-full h-10 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select Artist" />
                      </SelectTrigger>
                      <SelectContent className="py-4 bg-zinc-700">
                        <SelectItem value="no_genre">-- Default --</SelectItem>
                        {genres && genres.length > 0 && genres.map((item) => (
                          <SelectItem key={item._id ?? ''} value={item._id ?? ''} className="py-2">{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2 space-y-2">
                    <label className="font-medium text-sm">Artist</label>
                    <Select onValueChange={(value) => setNewAlbum({ ...newAlbum, artist: value })}>
                      <SelectTrigger className="w-full h-10 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select Artist" />
                      </SelectTrigger>
                      <SelectContent className="py-4 bg-zinc-700">
                        <SelectItem value="no_artist">-- Default --</SelectItem>
                        {artists && artists.length > 0 && artists.map((item) => (
                          <SelectItem key={item._id} value={item._id} className="py-2">{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-medium text-sm">Release Year</label>
                <Select onValueChange={(value) => setNewAlbum({ ...newAlbum, releaseYear: +value })}>
                  <SelectTrigger className="w-full  h-10 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Get year" />
                  </SelectTrigger>
                  <SelectContent className="shadow-lg shadow-neutral-600">
                    {
                      Array.from({ length: 3 }).map((_, i) => {
                        const currentYear = new Date().getFullYear()
                        return (
                          <SelectItem value={`${currentYear - i}`} key={i} className=" hover:bg-zinc-800">
                            {currentYear - i}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 py-3">
                <label className="font-medium text-sm">Descriptions</label>
                <Textarea placeholder="Type description for album here ...." className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                />
                <span className={`flex space-y-2 gap-1 items-center  font-thin cursor-default ${wordCount ? "text-red-700/80" : "text-amber-300/50"}`}><BadgeAlert className="size-5 mt-0.5" />  {wordCount ? "Exceeding 50 characters" : "Write a short description of no more than 50 words."} </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setAlbumDialog(false)}
              disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmitCreate} disabled={isLoading}>
              {isLoading ? 'Uploading ...' : 'Add Album'}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
export default AddAlbumDialog