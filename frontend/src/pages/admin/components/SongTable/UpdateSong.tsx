import { Loader, PenLine, Upload } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { useMusicStore } from "../../../../stores/useMusicStore"
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import toast from "react-hot-toast";
import { Song, type Genre } from "../../../../types";
import { useArtistStore } from "../../../../stores/artistStore";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "../../../../components/ui/command";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import _ from "lodash";
import genreService from "../../../../services/genre.service";

type UpdateSong = {
  song: Song,
  handleRemoveEditSong: () => void
}

type newSong = {
  title: string,
  artist: string[],
  duration: string,
  genreId: string,
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

const UpdateSong = ({ song, handleRemoveEditSong }: UpdateSong) => {
  const { artists, getAllArtist } = useArtistStore();
  const { albumsAdmin, getSongPaginate, updateSong } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isOpenArtist, setIsOpenArtist] = useState(false);
  const [listGenre, setListGenre] = useState<Genre[]>([]);

  const [newSong, setNewSong] = useState<newSong>({
    title: '',
    artist: [],
    duration: '0',
    genreId: "",
  });

  const [files, setFile] = useState<dataFile>({
    audio: null,
    image: null,
  });

  const [isChange, setIsChange] = useState({
    cTitle: false,
    cArtist: false,
    cDuration: false,
    cAudio: false,
    cImage: false,
    cGenreId: false,
  })

  const titleRef = useRef<HTMLInputElement>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!_.isEmpty(song)) {
      setSongDialogOpen(true);
    }
  }, [song]);

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

  useEffect(() => {
    if (!song) return
    const fetchAudioFile = async () => {
      setIsLoadingData(true);
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
        duration: '',
        genreId: typeof song.genreId === 'string' ? song.genreId : song.genreId?._id ?? '',
      });
      handleDuration(audioFile);
      setIsLoadingData(false);
    }
    fetchAudioFile();
  }, [song._id]);

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
      if (newSong.title !== titleRef.current?.value && titleRef.current)
        formData.append('title', titleRef.current.value);
      if (isChange.cArtist)
        formData.append('artistId', JSON.stringify(newSong.artist));
      if (isChange.cGenreId)
        formData.append('genreId', newSong.genreId);
      if (isChange.cDuration)
        formData.append('duration', newSong.duration);
      if (isChange.cAudio)
        formData.append('audioFile', files.audio);
      if (isChange.cImage)
        formData.append('imageFile', files.image);

      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }
      // return;
      await updateSong(formData, song._id);
      await getSongPaginate();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to update song: ' + error.message);
      } else {
        toast.error('Failed to update song: Unknown error');
      }
    } finally {
      setIsLoading(false);
      handleCloseDialog();
    }
  }

  const handleCloseDialog = () => {
    setIsChange({
      cTitle: false,
      cArtist: false,
      cDuration: false,
      cAudio: false,
      cImage: false,
      cGenreId: false
    });
    setNewSong({
      title: '',
      artist: [],
      duration: '0',
      genreId: "",
    });
    setFile({
      audio: null,
      image: null,
    });
    handleRemoveEditSong();
    setSongDialogOpen(false);
  }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>

      <DialogContent className="bg-zinc-900  border-zinc-700 overflow-auto max-w-2xl p-0"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <ScrollArea className="max-h-[80vh] p-8">
          {isLoadingData ?
            <div className="h-[80vh] w-full flex flex-col items-center justify-center">
              <Loader className="size-8 text-emerald-500 animate-spin" />
              <span className="text-lg text-emerald-500 mt-2">Loading ...</span>
            </div>
            :
            <>
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
                  <Input defaultValue={newSong.title} ref={titleRef} className="bg-zinc-800 border-zinc-700" />
                </div>
                <div className="flex item-center gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="font-medium text-sm">Genre</label>
                    <Select value={newSong?.genreId} onValueChange={(value) => {
                      setNewSong({ ...newSong, genreId: value });
                      setIsChange({ ...isChange, cGenreId: true });
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

                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 flex flex-col space-y-2">
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
                              <CommandItem key={item._id} onSelect={() => {
                                handleSelectArtist(item._id)
                                setIsChange({ ...isChange, cArtist: true });
                              }}
                                className={isSelected ? 'bg-emerald-600 border-2 border-white' : ''}
                              >{item.name}</CommandItem>
                            )
                          })}
                        </ScrollArea>
                      </CommandList>
                    </CommandDialog>
                  </div>
                  <div className="w-[200px] space-y-2">
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
              </div>
              <DialogFooter>
                <Button variant={'outline'} onClick={handleCloseDialog} disabled={isLoading}>Cancel</Button>
                <Button onClick={handleSubmitUpdate} disabled={isLoading}>
                  {isLoading ? 'Uploading ...' : 'Add Song'}
                </Button>
              </DialogFooter>
            </>
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
export default UpdateSong