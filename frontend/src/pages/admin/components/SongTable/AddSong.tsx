import { CirclePlus, Upload } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { useMusicStore } from "../../../../stores/useMusicStore"
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import toast from "react-hot-toast";
import { axiosIntance } from "../../../../lib/axios";


const AddSong = () => {
  const { albums, getSongPaginate } = useMusicStore();
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<{ title: string, artist: string, album: string, duration: string }>({
    title: '',
    artist: '',
    album: '',
    duration: '0',
  })

  const [files, setFile] = useState<{ audio: File | null, image: File | null }>({
    audio: null,
    image: null,
  })

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitCreate = async () => {
    setIsLoading(true);
    try {
      if (!files.audio || !files.image) {
        return toast.error('Please upload both audio and image files');
      }

      const formData = new FormData();
      formData.append('title', newSong.title);
      formData.append('artist', newSong.artist);
      formData.append('duration', newSong.duration);
      if (newSong && newSong.album !== 'none') {
        formData.append('albumId', newSong.album);
      }
      formData.append('audioFile', files.audio);
      formData.append('imageFile', files.image);

      await axiosIntance.post('admin/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNewSong({
        title: '',
        artist: '',
        duration: '0',
        album: '',
      })
      setFile({
        audio: null,
        image: null,
      })
      toast.success('Song added successfully');
      await getSongPaginate();
    } catch (error: any) {
      toast.error('Failed to add song: ' + error.message);
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
      <DialogContent className="bg-zinc-900  border-zinc-700 max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>
            Add a new song to your collection.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            <Input value={newSong.title} onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Artist</label>
            <Input value={newSong.artist} onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Duration (seconds)</label>
            <Input type="number" min={0} value={newSong.duration} disabled
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label >Album (options)</label>
            <Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder='Select album' />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="none">No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>{album.title}</SelectItem>
                ))}
              </SelectContent>

            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setSongDialogOpen(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmitCreate} disabled={isLoading}>
            {isLoading ? 'Uploading ...' : 'Add Song'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddSong