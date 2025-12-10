import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input";
import { useMusicStore } from "../../../../stores/useMusicStore"
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import toast from "react-hot-toast";
import { axiosIntance } from "../../../../lib/axios";
import { useArtistStore } from "../../../../stores/artistStore";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../../../../components/ui/command";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { CirclePlus, Upload } from "lucide-react";
import genreService from "../../../../services/genre.service";
import type { Genre } from "../../../../types";

// import type { FormProps } from 'antd';
// import { Button, Checkbox, Form, Input } from 'antd';

const AddSong = () => {
  const { artists, getAllArtist } = useArtistStore();
  const { albumsAdmin, getSongPaginate } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenArtist, setIsOpenArtist] = useState(false);
  const [listGenre, setListGenre] = useState<Genre[]>([]);

  const [newSong, setNewSong] = useState<{ title: string, artist: string[], album: string, duration: string, genre: string }>({
    title: '',
    album: '',
    artist: [],
    duration: '0',
    genre: '',
  });

  const titleRef = useRef<HTMLInputElement>(null);

  const [files, setFile] = useState<{ audio: File | null, image: File | null }>({
    audio: null,
    image: null,
  })

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
    const handleGetALlGenre = async () => {
      const res = await genreService.GetAllGenre();
      if (res && res.data && res.data.EC === 0) {
        setListGenre([...res.data.list]);
      } else {
        toast.error(res?.data.EM);
      }
    }

    getAllArtist();
    handleGetALlGenre();
  }, [getAllArtist]);


  const handleSelectArtist = (value: string) => {
    setNewSong((prev) => prev.artist.includes(value) ?
      { ...prev, artist: prev.artist.filter(v => v !== value) } : { ...prev, artist: [...prev.artist, value] })
  }

  const handleSubmitCreate = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        return toast.error('Please upload both audio and image files');
      }

      const formData = new FormData();
      formData.append('title', titleRef.current?.value ?? "");
      formData.append('artistId', JSON.stringify(newSong.artist));
      formData.append('duration', newSong.duration);
      formData.append('genreId', newSong.genre);
      if (newSong && newSong.album !== 'none') {
        formData.append('albumId', newSong.album);
      }
      formData.append('audioFile', files.audio);
      formData.append('imageFile', files.image);

      const res = await axiosIntance.post('admin/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.EC === 0) {
        setNewSong({
          title: '',
          duration: '0',
          album: '',
          artist: [],
          genre: '',
        })
        setFile({
          audio: null,
          image: null,
        });
        if (titleRef && titleRef.current) {
          titleRef.current.value = "";
        }
        toast.success('Song added successfully');
        await getSongPaginate();
      } else {
        toast.error(res.data.EM);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to add song: ' + error.message);
      } else {
        toast.error('Failed to add song: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">
          <CirclePlus className="h-4 w-4 mt-[3px]" />
          Add Song
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900  border-zinc-700 max-w-2xl overflow-auto p-0">
        <ScrollArea className="max-h-[80vh] p-8">
          <DialogHeader>
            <DialogTitle>Add New Song</DialogTitle>
            <DialogDescription>
              Add a new song to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-1">
            <input type="file" accept="audio/*" ref={audioInputRef} hidden
              onChange={(e) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                const audio = document.createElement("audio");
                audio.src = URL.createObjectURL(file);
                audio.addEventListener("loadedmetadata", () => {
                  setNewSong({ ...newSong, duration: (Math.floor(audio.duration)).toString() })
                });
                setFile({ ...files, audio: e.target.files![0] });
              }
              }
            />

            <input type="file" accept="image/*" ref={imageInputRef} hidden
              onChange={(e) => setFile({ ...files, image: e.target.files![0] })}
            />

            {/* Image upload area */}
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={() => imageInputRef.current?.click()}>
              <div className="text-center">

                {files.image ?
                  (
                    <div className="space-y-2">
                      <div className="text-sm text-emerald-500">Image selected:</div>
                      <div className="text-xs text-zinc-400">{files.image.name.slice(0, 20)}</div>
                    </div>
                  )
                  : (
                    <>
                      <div className="p-3 rounded-full inline-block">
                        <Upload className="h-10 w-10 text-zinc-600" />
                      </div>
                      <div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
                      <Button variant={'outline'} size={'sm'} className="text-xs">
                        Choose File
                      </Button>
                    </>
                  )
                }
              </div>
            </div>
            {/* audio upload area */}
            <div className="space-y-2">
              <label className="font-medium text-sm" >Audio File</label>
              <div className="flex items-center">
                <Button variant={'outline'} className="w-full" onClick={() => audioInputRef.current?.click()}>
                  {files.audio ? files.audio.name.slice(0, 20) : 'Choose Audio File'}
                </Button>
              </div>
            </div>

            {/* Other fields */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Title</label>
              <Input defaultValue={newSong.title} ref={titleRef} />
            </div>
            <div className="flex item-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="font-medium text-sm">Genre</label>
                <Select value={newSong.genre} onValueChange={(value) => {
                  setNewSong({ ...newSong, genre: value })
                }}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder='Select genre' />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none" disabled>Not Empty Here!</SelectItem>
                    {listGenre.map((genre) => (
                      <SelectItem key={genre._id} value={genre._id}>{genre.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
              <div className="w-[200px] flex flex-col space-y-2">
                <label className="font-medium text-sm">Artist</label>
                <Button size="lg" className="py-2" variant={'outline'}
                  onClick={() => setIsOpenArtist(true)}>
                  Select {newSong.artist.length} artists
                </Button>
                <CommandDialog open={isOpenArtist} onOpenChange={setIsOpenArtist}>
                  <DialogTitle></DialogTitle>
                  <CommandInput placeholder="Type a command or search..." />

                  <CommandList>
                    <ScrollArea className="h-72 rounded-md border py-2 px-3">
                      <CommandEmpty>No results found.</CommandEmpty>
                      {artists && artists.length > 0 && artists.map(item => {
                        const isSelected = newSong.artist.includes(item._id);
                        return (
                          <CommandItem key={item._id} onSelect={() => handleSelectArtist(item._id)}
                            className={isSelected ? 'bg-emerald-600 border-2 border-white' : ''}
                          >{item.name}</CommandItem>
                        )
                      })}
                    </ScrollArea>
                  </CommandList>
                </CommandDialog>
              </div>
            </div>


            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="">Album (options)</label>
                <Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder='Select album' />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none">No Album (Single)</SelectItem>
                    {albumsAdmin.map((album) => (
                      <SelectItem key={album._id} value={album._id}>{album.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px] space-y-2">
                <label className="font-medium text-sm">Duration (seconds)</label>
                <Input type="number" min={0} value={newSong.duration} disabled
                  onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            {/* <Button variant={'outline'} onClick={() => setSongDialogOpen(false)} disabled={isLoading}>Cancel</Button> */}
            <Button onClick={() => setSongDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmitCreate} disabled={isLoading}>
              {isLoading ? 'Uploading ...' : 'Add Song'}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog >
  )
}
export default AddSong