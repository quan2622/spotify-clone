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
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState<null | AlbumCaching[]>(null);
  const navigate = useNavigate();
  const typeSize = useUpdateMainSize();


  useEffect(() => {
    handleFetchData();
  }, [title])

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      const res = await albumService.getCachingAlbum('recommended');
      if (res && res.data && res.data.EC === 0) {
        setAlbums(res.data.data);
      } else {
        toast.error(res?.data.EM)
      }
      console.log("Check res return: ", res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <></>
  }

  console.log("Check album data: ", albums);

  const radioData = [
    [
      { title: "Oh? Canada!", subtitle: "STROMBO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1747929641/tmp-1-1747929636315_va5j7s.jpg" },
      { title: "10 Years of Apple Music", subtitle: "THE MATT WILKINSON SHOW", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351305/tmp-2-1749351303681_tnesqw.jpg" },
    ],
    [
      { title: "Don't Be Boring", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Oh? Canada1!", subtitle: "STROMBO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1747929641/tmp-1-1747929636315_va5j7s.jpg" },
      { title: "10 Years of Apple Music1", subtitle: "THE MATT WILKINSON SHOW", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351305/tmp-2-1749351303681_tnesqw.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],
    [
      { title: "Don't Be Boring2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749351403/tmp-1-1749351402170_pixi9n.jpg" },
      { title: "LIVE: 10 Years2", subtitle: "10 YEARS OF APPLE MUSIC RADIO", imageUrl: "https://res.cloudinary.com/dchv5jtrl/image/upload/v1749522824/tmp-1-1749522823524_yd9l3o.jpg" },
    ],

  ];


  return (
    <div className="mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button variant={'link'} className="text-sm text-zinc-400 hover:text-white" onClick={() => navigate(`/${title}`)}>Show all</Button>
      </div>

      <div>
        {type === "double" ?
          <CarouselDouble data={radioData} />
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
                              {/* {album.artistId.map(item => item.name).join(" • ")} */}
                              description
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