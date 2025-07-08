import { useNavigate, useParams } from "react-router-dom"
import { ScrollArea } from "../../components/ui/scroll-area";
import { useEffect, useState } from "react";
import PlayButtonAlbum from "./components/PlayButtonAlbum";
import { useAlbumStore } from "../../stores/useAlbumStore";
import type { AlbumCaching } from "../../types";
import _ from "lodash";

const ShowAllAlbum = () => {
  const { recommendAlbum, popularAlbum, fetchDataAlbum } = useAlbumStore();
  const { type } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [albums, setAlbums] = useState<null | AlbumCaching[]>();


  useEffect(() => {
    if (type !== "") {
      if (type === 'recommended') setTitle("Recommended Albums");
      else if (type === 'popular_albums') setTitle("Popular Albums");
      else setTitle("Undefined");
    }
  }, [type]);

  useEffect(() => {
    if (typeof type === 'string' && type !== '') {
      if (
        (type === 'recommended' && !_.isEmpty(recommendAlbum)) ||
        (type === 'popular_albums' && !_.isEmpty(popularAlbum))
      ) { return; }

      (async () => { await fetchDataAlbum(type) })();
    }
  }, [type, fetchDataAlbum, recommendAlbum, popularAlbum]);

  useEffect(() => {
    if (type === 'recommended' && !_.isEmpty(recommendAlbum)) {
      setAlbums(recommendAlbum);
    } else if (type === 'popular_albums' && !_.isEmpty(popularAlbum)) {
      setAlbums(popularAlbum);
    }
  }, [type, recommendAlbum, popularAlbum]);

  const handleRedirectToAlbumDetail = (albumId: string) => {
    navigate(`/show-all-albums/detail/${albumId}`)
  }

  console.log("Check albums: ", albums);

  return (
    <div className="h-full ">
      <ScrollArea className="h-full rounded-md px-6 py-6">
        <div className="text-xl font-semibold"> {title} </div>
        <div className="grid grid-cols-2 md:grid-cols-10 mt-6 gap-3">
          {!_.isEmpty(albums) && albums?.map(album => (
            <div key={album._id} className="col-span-2 p-2 min-h-[270px] bg-zinc-800 rounded-md group">
              <div className="h-[200px] w-full overflow-hidden rounded-md relative">
                <img className="object-center object-cover w-full h-full group-hover:scale-105 transition-all ease-linear"
                  src={album.imageUrl} alt={album.title} />
                <PlayButtonAlbum albumId={album._id} />
              </div>
              <div className="pt-1 cursor-pointer group-hover:underline" onClick={() => handleRedirectToAlbumDetail('31')}>
                <h2 className="font-semibold text-lg">{album.title}</h2>
                <h4 className="text-sm text-zinc-300">{album?.genreId?.name || "not found"}</h4>
              </div>
            </div>
          ))}


        </div>
      </ScrollArea>
    </div>
  )
}
export default ShowAllAlbum