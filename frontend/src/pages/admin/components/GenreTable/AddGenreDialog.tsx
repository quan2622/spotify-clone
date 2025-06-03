import { useRef, useState } from "react";
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { CirclePlus, Upload } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useGenreStore } from "../../../../stores/genreStore";
import toast from "react-hot-toast";

const AddGenreDialog = () => {
  const { isLoading, createNewGenre, fetchDataGenre } = useGenreStore();
  const [genreDialog, setGenreDialog] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dataCreate, setDataCreate] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = async () => {
    console.log("Check data create: ", dataCreate, " - ", imageFile);
    if (!dataCreate.name || !dataCreate.description || !imageFile) {
      toast.error("Missing required params");
      return;
    }
    const formData = new FormData();
    formData.append("name", dataCreate.name);
    formData.append("description", dataCreate.description);
    formData.append('imageFile', imageFile);
    await createNewGenre(formData);
    if (!isLoading) {
      setDataCreate({ name: '', description: '' });
      setImageFile(null);
      await fetchDataGenre();
    }
  }

  return (
    <Dialog open={genreDialog} onOpenChange={setGenreDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center rounded-md bg-violet-500 hover:bg-violet-800 text-white">
          <CirclePlus className="h-4 w-4 mt-[3px]" />
          Add Genre
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add New Genre</DialogTitle>
          <DialogDescription>
            Add a new genre
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
                    <div className="h-[200px] flex items-center justify-center">
                      <img src={URL.createObjectURL(imageFile)} alt="image-upload" className="object-cover object-center max-h-full" />
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
              <Input type="text" value={dataCreate.name} onChange={(e) => setDataCreate({ ...dataCreate, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700" />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm">Description</label>
              <Input type="text" value={dataCreate.description} onChange={(e) => setDataCreate({ ...dataCreate, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setGenreDialog(false)}
            disabled={isLoading}>Cancel</Button>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? 'Uploading ...' : 'Add Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AddGenreDialog