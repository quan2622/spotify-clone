import { useEffect, useRef, useState } from "react"
import CarouselCardGroup from "./CarouselCardGroup";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import useUpdateMainSize from "../../../hooks/useUpdateMainSize";
import type { AlbumCaching } from "../../../types";

const CarouselDouble = ({ data }: { data: AlbumCaching[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const typeSize = useUpdateMainSize();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setAtStart(scrollLeft <= 0);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);


  const scroll = (dir: any) => {
    if (scrollRef && scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = 320;
      container.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }

  // console.log("CHECK: ", atStart, ' - ', atEnd);

  const chunkSize = 2;
  const reMakeData = data.reduce<AlbumCaching[][]>((acc, item, index) => {
    if (index % chunkSize === 0) {
      acc.push(data.slice(index, index + chunkSize));
    }
    return acc;
  }, []);



  return (
    <div className="max-w-[100%] w-full group">
      <div className="flex items-center justify-center">
        <button
          onClick={() => scroll("left")}
          disabled={atStart}
          className={`hover:bg-zinc-700 rounded-md h-20 transition-all ease duration-200 ${atStart ? 'invisible' : 'visible'} transition-all ease-in duration-100 group-hover:block hidden`}
        >
          <ChevronLeft />
        </button>
        <div
          ref={scrollRef}
          className={clsx("flex overflow-x-auto scroll-smooth snap-x snap-mandatory overflow-hidden hide-scrollbar group-hover:mx-0 mx-[24px]",
            typeSize === 'small' ? 'max-w-[805px]' : '',
            typeSize === 'medium' ? 'max-w-[1000px]' : '',
            typeSize === 'large' ? 'max-w-[1220px]' : ''
          )}
        >
          {
            reMakeData.map((group: any, i: number) => (
              <CarouselCardGroup key={i} group={group} />
            ))}
        </div>
        <button
          onClick={() => scroll("right")}
          disabled={atEnd}
          className={`hover:bg-zinc-700 rounded-md h-20 transition-all ease duration-200 ${atEnd ? 'invisible' : 'visible'}  transition-all ease-in duration-100 group-hover:block hidden`}
        >
          <ChevronRight />
        </button>
      </div>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Edge */
          }
        `}
      </style>
    </div >
  )
}

export default CarouselDouble