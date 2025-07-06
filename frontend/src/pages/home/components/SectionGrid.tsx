import { useNavigate } from "react-router-dom";
import SectionGridSkeleton from "../../../components/skeleton/SectionGridSkeleton";
import { Button } from "../../../components/ui/button";
import { Song } from "../../../types";
import PlayButton from "./PlayButton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { useUIStore } from "../../../stores/useUIStore";
import { useEffect, useState } from "react";
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

type SectionGrid = {
  title: string,
  songs: Song[],
  isLoading: boolean,
}

const SectionGrid = ({ songs, title, isLoading }: SectionGrid) => {
  const typeSize = useUpdateMainSize()

  const navigate = useNavigate();
  if (isLoading) return <SectionGridSkeleton />

  return (
    <div className="mb-8 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button variant={'link'} className="text-sm text-zinc-400 hover:text-white" onClick={() => navigate(`/${title}`)}>Show all</Button>
      </div>
      <div className="w-full max-w-full mx-auto px-4">
        <Carousel
          className="w-full"
          opts={{
            dragFree: false,
            align: "start",
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-2">
            {songs.slice(0, 8).map((song, index) => (
              <CarouselItem key={index} className={`pl-2 md:basis-1/2 ${typeSize === 'large' ? 'lg:basis-1/6' : ''} ${typeSize === 'medium' ? 'lg:basis-1/5' : ''} ${typeSize === 'small' ? 'lg:basis-1/4' : ''}`}>
                <Card className="group cursor-pointer">
                  <CardContent className="flex p-3 h-[230px] w-full flex-col">
                    <div className="w-full min-h-[150px] relative flex-1 overflow-hidden  transition-all ease-linear">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={song.imageUrl} alt={song.title} />
                      <PlayButton song={song} />
                    </div>
                    <div className="w-full mt-2 max-w-full relative">
                      <h3 className="font-semibold text-sm text-wrap truncate">{song.title}</h3>
                      <span className="text-sm w-full block max-w-20 truncate">
                        {song.artistId.map(item => item.name).join(" • ")}
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
      </div>

    </div>
  )
}
export default SectionGrid