import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../components/ui/carousel";
import { Card, CardContent } from "../../../components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlayButton from "./PlayButton";
import type { AlbumCaching } from "../../../types";
import albumService from "../../../services/album.service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CarouselDouble from "../../../layout/components/Carousel/Carousel";
import useUpdateMainSize from "../../../hooks/useUpdateMainSize";
import _ from "lodash";
import { useAlbumStore } from "../../../stores/useAlbumStore";

const CustomArrow = ({ direction }: { direction: "prev" | "next" }) => {
  const Component = direction === "prev" ? CarouselPrevious : CarouselNext;
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <Component className="bg-zinc-700 text-white hover:bg-zinc-600 hover:shadow-[0_0_6px] hover:shadow-neutral-200 border-none ">
      <Icon className="w-6 h-6" />
    </Component>
  );
};

const AlbumSectionGrid = ({ title, type }: { title: string, type: string }) => {
  const { isLoading, recommendAlbum, popularAlbum, fetchDataAlbum } = useAlbumStore();
  const [typePath, setTypePath] = useState<string>("");
  const [albums, setAlbums] = useState<null | AlbumCaching[]>(null);


  const navigate = useNavigate();
  const typeSize = useUpdateMainSize();

  const typeAlbum = (title === 'Recommend Album') ? 'recommended' : 'popular_albums';

  useEffect(() => {
    if (title !== '') {
      handleFetchData(typeAlbum);
      setTypePath(typeAlbum);
    }
  }, [title])

  useEffect(() => {
    if (typeAlbum === 'popular_albums' && !_.isEmpty(popularAlbum)) {
      setAlbums(popularAlbum);
    } else if (typeAlbum === 'recommended' && !_.isEmpty(recommendAlbum)) {
      setAlbums(recommendAlbum);
    }
  }, [popularAlbum, recommendAlbum])


  const handleFetchData = async (albumFetching: string) => {
    await fetchDataAlbum(albumFetching);
  }

  if (isLoading) {
    return <></>
  }

  return (
    <div className="mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button variant={'link'} className="text-sm text-zinc-400 hover:text-white" onClick={() => navigate(`/show-all-albums/${typePath}`)}>Show all</Button>
      </div>

      <div>
        {type === "double" && albums && albums.length > 0 ?
          <CarouselDouble data={albums} />
          :
          <div className="w-full max-w-full mx-auto px-4">
            {albums && albums.length > 0 &&

              <Carousel
                className="w-full"
                opts={{
                  dragFree: false,
                  align: "start",
                  containScroll: "trimSnaps",
                }}
              >
                <CarouselContent className="-ml-2">
                  {albums.slice(0, 8).map((album, index) => (
                    <CarouselItem key={index} className={`pl-2 md:basis-1/2 ${typeSize === 'large' ? 'lg:basis-1/6' : ''} ${typeSize === 'medium' ? 'lg:basis-1/5' : ''} ${typeSize === 'small' ? 'lg:basis-1/4' : ''}`}>
                      <Card className="group cursor-pointer">
                        <CardContent className="flex p-3 h-[230px] w-full flex-col">
                          <div className="w-full min-h-[150px] relative flex-1 overflow-hidden  transition-all ease-linear">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              src={album.imageUrl} alt={album.title} />
                            {/* <PlayButton song={album} /> */}
                          </div>
                          <div className="w-full mt-2 max-w-full relative">
                            <h3 className="font-semibold text-sm text-wrap truncate">{album.title}</h3>
                            <span className="text-sm w-full block max-w-20 truncate">
                              {album?.genreId?.name}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CustomArrow direction="prev" />
                <CustomArrow direction="next" />
              </Carousel>
            }
          </div>
        }
      </div>
    </div>
  )
}
export default AlbumSectionGrid