import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { PenLine, Upload } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useGenreStore } from "../../../../stores/genreStore";
import toast from "react-hot-toast";
import { Genre } from "../../../../types";
import _ from "lodash";

const UpdateGenre = ({ genre }: { genre: Genre }) => {
  const { isLoading, updateDataGenre } = useGenreStore();
  const [genreDialog, setGenreDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dataUpdate, setDataUpdate] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!genre) return;
    setDataUpdate({
      name: genre.name,
      description: genre.description,
    });
    setImagePreview(genre.imageUrl);
  }, [genre]);


  const handleSubmit = async () => {
    if (_.isEqual(dataUpdate, { name: genre.name, description: genre.description })) {
      toast.error("Please change value and try again");
      return;
    }
    const formData = new FormData();
    formData.append("name", dataUpdate.name);
    formData.append("description", dataUpdate.description);
    if (imageFile) formData.append("imageFile", imageFile);
    await updateDataGenre(formData, genre._id);
    if (!isLoading) {
      setDataUpdate({ name: '', description: '' });
      setImageFile(null);
      setImagePreview("");
    }
  }

  return (
    <Dialog open={genreDialog} onOpenChange={setGenreDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={'sm'}
          className="text-yellow-500 hover:text-yellow-300 hover:bg-red-400/10" >
          <PenLine className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto max-w-5xl">
        <DialogHeader>
          <DialogTitle>Update Genre</DialogTitle>
          <DialogDescription>
            Update infomation of Genre
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
                {((imageFile || imagePreview)) ?
                  (
                    <div className="h-[200px] flex items-center justify-center">
                      <img src={imageFile !== null ? URL.createObjectURL(imageFile) : imagePreview} alt="image-upload" className="object-cover object-center max-h-full" />
                    </div>
                  )
                  :
                  (<>
                    <div className="p-3 rounded-full inline-block">
                      <Upload className="h-10 w-10 text-zinc-600 hover:text-zinc-400" />
                    </div>
                    <div className="text=sm text-zinc-400 mb-2">Upload artwork</div>
                    <Button variant={'outline'} size={'sm'} className="text-xs">
                      Choose file
                    </Button>
                  </>)
                }
              </div>
            </div>
          </div>
          <div className="w-[50%] space-y-4">
            <div className="space-y-2">
              <label className="font-medium text-sm">Name</label>
              <Input type="text" value={dataUpdate.name} onChange={(e) => setDataUpdate({ ...dataUpdate, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Description</label>
              <Input type="text" value={dataUpdate.description} onChange={(e) => setDataUpdate({ ...dataUpdate, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setGenreDialog(false)}
            disabled={isLoading}>Cancel</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Uploading ...' : 'Save Change'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default UpdateGenre