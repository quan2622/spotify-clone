import { PenLine, Upload } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { useMusicStore } from "../../../../stores/useMusicStore"
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import toast from "react-hot-toast";
import { Song } from "../../../../types";
import { useArtistStore } from "../../../../stores/artistStore";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../../../../components/ui/command";
import { ScrollArea } from "../../../../components/ui/scroll-area";

type UpdateSong = {
  song: Song,
}

type newSong = {
  title: string,
  artist: string[],
  album: string | undefined,
  duration: string
}

type dataFile = {
  audio: File | null,
  image: File | null
}

const urlToFile = async (url: string, filename: string, mimeType: string) => {
  const response = await fetch(url);
  const blod = await response.blob();

  return new File([blod], filename, { type: mimeType })
}

const UpdateSong = ({ song }: UpdateSong) => {
  const { artists, getAllArtist } = useArtistStore();
  const { albumsAdmin, getSongPaginate, updateSong } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenArtist, setIsOpenArtist] = useState(false);

  const [newSong, setNewSong] = useState<newSong>({
    title: '',
    artist: [],
    album: '',
    duration: '0',
  });

  const [files, setFile] = useState<dataFile>({
    audio: null,
    image: null,
  });

  const [isChange, setIsChange] = useState({
    cTitle: false,
    cArtist: false,
    cAlbum: false,
    cDuration: false,
    cAudio: false,
    cImage: false,
  })

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllArtist();
  }, [getAllArtist]);

  useEffect(() => {
    if (!song) return
    const fetchAudioFile = async () => {
      const audioFile = await urlToFile(song.audioUrl, song.title, 'audio/mpeg');
      const imageFile = await urlToFile(song.imageUrl, song.title, 'image/jpeg');
      setFile((prevFiles) => ({
        ...prevFiles,
        audio: audioFile,
        image: imageFile
      }));
      setNewSong({
        title: song.title,
        artist: song.artistId.map(item => item._id),
        album: song.albumId ?? undefined,
        duration: '',
      });
      handleDuration(audioFile)
    };

    fetchAudioFile();
  }, []);

  useEffect(() => {
    if (!files.audio) return;
    handleDuration(files.audio);
  }, [files.audio]);

  const handleDuration = (file: File) => {
    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.addEventListener("loadedmetadata", () => {
      setNewSong({ ...newSong, duration: (Math.floor(audio.duration)).toString() })
    });
  }

  const handleSelectArtist = (value: string) => {
    setNewSong((prev) => prev.artist.includes(value) ?
      { ...prev, artist: prev.artist.filter(v => v !== value) } : { ...prev, artist: [...prev.artist, value] })
  }

  const handleSubmitUpdate = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        return toast.error('Please upload both audio and image files');
      }

      const formData = new FormData();
      if (isChange.cTitle)
        formData.append('title', newSong.title);
      if (isChange.cArtist)
        formData.append('artistId', JSON.stringify(newSong.artist));
      if (isChange.cDuration)
        formData.append('duration', newSong.duration);
      if (newSong && newSong.album !== 'none' && isChange.cAlbum) {
        if (newSong.album) {
          formData.append('albumId', newSong.album);
        }
      }
      if (isChange.cAudio)
        formData.append('audioFile', files.audio);
      if (isChange.cImage)
        formData.append('imageFile', files.image);

      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }
      await updateSong(formData, song._id)
      await getSongPaginate();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to update song: ' + error.message);
      } else {
        toast.error('Failed to update song: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={'sm'}
          className="text-yellow-500 hover:text-yellow-300 hover:bg-red-400/10" >
          <PenLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900  border-zinc-700 overflow-auto max-w-2xl p-0">
        <ScrollArea className="max-h-[80vh] p-8">
          <DialogHeader>
            <DialogTitle>Update Song</DialogTitle>
            <DialogDescription>
              Update song to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input type="file" accept="audio/*" ref={audioInputRef} hidden
              onChange={(e) => {
                if (!e.target.files) return;
                const file = e.target.files[0];
                handleDuration(file);
                setFile({ ...files, audio: e.target.files![0] });
                setIsChange({ ...isChange, cAudio: true, cDuration: true })
              }
              }
            />

            <input type="file" accept="image/*" ref={imageInputRef} hidden
              onChange={(e) => {
                setFile({ ...files, image: e.target.files![0] })
                setIsChange({ ...isChange, cImage: true })
              }}
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
              <Input value={newSong.title} onChange={(e) => {
                setNewSong({ ...newSong, title: e.target.value })
                setIsChange({ ...isChange, cTitle: true })
              }}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="flex item-center">
              <div className="w-2/5 space-y-2 mt-[6px]">
                <label className="font-medium text-sm">Artist</label>
                <Button className="ml-2" size={'default'} variant={'outline'}
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
                          <CommandItem key={item._id} onSelect={() => {
                            handleSelectArtist(item._id)
                            setIsChange({ ...isChange, cArtist: true });
                          }}
                            className={isSelected ? 'bg-emerald-600' : ''}
                          >{item.name}</CommandItem>
                        )
                      })}
                    </ScrollArea>
                  </CommandList>
                </CommandDialog>
              </div>
              <div className="w-3/5 space-y-2">
                <label className="font-medium text-sm">Duration (seconds)</label>
                <Input type="number" min={0} value={newSong.duration} disabled
                  onChange={(e) => {
                    setNewSong({ ...newSong, duration: e.target.value || "0" })
                    setIsChange({ ...isChange, cDuration: true })
                  }}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label >Album (options)</label>
              <Select value={newSong.album} onValueChange={(value) => {
                setNewSong({ ...newSong, album: value })
                setIsChange({ ...isChange, cAlbum: true })
              }}>
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
          </div>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => setSongDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmitUpdate} disabled={isLoading}>
              {isLoading ? 'Uploading ...' : 'Add Song'}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
export default UpdateSong