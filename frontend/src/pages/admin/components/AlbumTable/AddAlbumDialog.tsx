import { useRef, useState } from "react"
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button";
import { CirclePlus, Upload } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import toast from "react-hot-toast";
import { axiosIntance } from "../../../../lib/axios";
import { useMusicStore } from "../../../../stores/useMusicStore";

const AddAlbumDialog = () => {
  const { fetchAlbum } = useMusicStore();
  const [albumDialog, setAlbumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [newAlbum, setNewAlbum] = useState<{ title: string, artist: string, releaseYear: number }>({
    title: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
  })
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmitCreate = async () => {
    setIsLoading(true);
    try {
      if (!imageFile) {
        return toast.error('Please upload image file');
      }

      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('artist', newAlbum.artist);
      formData.append('releaseYear', (newAlbum.releaseYear).toString());
      formData.append('imageFile', imageFile);

      await axiosIntance.post('admin/albums', formData, {
        headers: { 'Content-Type': 'multipart/from-data' }
      });

      setNewAlbum({
        title: '',
        artist: '',
        releaseYear: new Date().getFullYear(),
      })
      setImageFile(null);
      toast.success('Song added successfully');
      await fetchAlbum();
    } catch (error: any) {
      toast.error('Failed to add song: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={albumDialog} onOpenChange={setAlbumDialog}>
      <DialogTrigger>
        <Button className="flex items-center rounded-md bg-violet-500 hover:bg-violet-800 text-white">
          <CirclePlus className="h-4 w-4 mt-[3px]" />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
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
        <div className="space-y-2">
          <label className="font-medium text-sm">Title</label>
          <Input value={newAlbum.title} onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
            className="bg-zinc-800 border-zinc-700" />
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm">Artist</label>
          <Input value={newAlbum.artist} onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
            className="bg-zinc-800 border-zinc-700" />
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm">Release Year</label>
          <Input type="number" min={2000} max={new Date().getFullYear()} value={newAlbum.releaseYear} onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
            className="bg-zinc-800 border-zinc-700" />
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setAlbumDialog(false)}
            disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmitCreate} disabled={isLoading}>
            {isLoading ? 'Uploading ...' : 'Add Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddAlbumDialog