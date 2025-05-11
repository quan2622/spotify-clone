import { Pen, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";
import { axiosIntance } from "../../lib/axios";
import { Album } from "../../types";
import { useMusicStore } from "../../stores/useMusicStore";


const UpdateAlbumUserDialog = ({ albumId, currentAlbum }: { albumId?: string, currentAlbum: Album | null }) => {
  const { albumsUser } = useMusicStore();
  const imageRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imgURL, setImgURL] = useState<string>("");
  const [info, setInfo] = useState({
    name: "",
    description: "",
  });

  const [infoClone, setInfoClone] = useState({
    name: "",
    description: "",
  });
  const [isUpload, setIsUpload] = useState(false);



  useEffect(() => {
    if (!currentAlbum) return;
    setInfo({
      name: currentAlbum.title,
      description: currentAlbum.description
    })
    setImgURL(currentAlbum.imageUrl)
  }, [currentAlbum]);

  useEffect(() => {
    if (!info) return;
    setInfoClone({ ...info })
  }, []);

  const handleUpload = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      console.log(file);
      setImgURL(URL.createObjectURL(file));
      setImage(file);
      setIsUpload(true);
    }

    event.target.value = null;
  }

  const handleUpdateInfo = async () => {
    const formData = new FormData();
    if (info.name !== infoClone.name)
      formData.append('title', info.name);
    if (info.description !== infoClone.description)
      formData.append('description', info.description);
    if (isUpload && image)
      formData.append('image', image);

    const isEmpty = [...formData.entries()].length === 0;
    if (isEmpty) {
      toast.error("You should edit infomation and try again");
      return;
    }

    const res = await axiosIntance.put(`albums/update/${albumId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    useMusicStore.setState({
      currentAlbum: { ...currentAlbum, ...res.data.newData },
      albumsUser: albumsUser.map(item => item._id === res.data.newData._id ? res.data.newData : item)
    });
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center justify-between hover:cursor-pointer absolute top-[25%] left-[25%]">
          <Pen className="size-20  text-white " />
          <div >Update Album</div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900  border-zinc-700 max-h-[80vh] sm:max-w-xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Infomation</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 px-3 pt-4 w-full">
          <input type="file" accept="image/*" hidden ref={imageRef} onChange={(e) => handleUpload(e)} />
          <div className="w-[40%] flex items-center justify-between group rounded-lg overflow-hidden "
            onClick={() => imageRef.current?.click()}>
            <div className="w-[280px] h-[209px] shadow-xl rounded bg-black/30 flex flex-col items-center justify-center  text-stone-400 group-hover:text-stone-300">
              {imgURL !== "" ?
                <img src={imgURL} alt='image-album' className="w-full h-full object-center shadow-xl rounded-lg" />
                :
                <>
                  <Upload className="size-12 " />
                  <span className="font-semibold text-md mt-2">Upload Image</span>
                </>
              }
            </div>
          </div>
          <div className="w-[60%] flex flex-col gap-3 text-white">
            <div className="mb-1">
              <div className="mb-2">Name:</div>
              <Input className="bg-stone-900/50 border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            </div>
            <div>
              <div className="mb-2">Description</div>
              <Textarea className="h-full border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
                value={info.description}
                onChange={(e) => setInfo({ ...info, description: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter className="p-3">
          <Button size={"lg"} onClick={handleUpdateInfo}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >

  )
}
export default UpdateAlbumUserDialog