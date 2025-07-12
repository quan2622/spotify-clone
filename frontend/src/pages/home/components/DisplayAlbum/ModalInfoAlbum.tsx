import { motion } from "framer-motion"
import { ChevronsRight, Ellipsis, ListMusic, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Album, AlbumCaching } from "../../../../types";
import { useAlbumStore } from "../../../../stores/useAlbumStore";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { formatDuraion } from "../../../../utils/formatDuration";
import ListAlbumModalSkeleton from "../../../../components/skeleton/ListAlbumModalSkeleton";

interface ModalInfoAlbum {
  selectedCard: string;
  selectedCardData: AlbumCaching;
  setSelectedCard: (id: string | null) => void;
}

const ModalInfoAlbum = ({ selectedCard, setSelectedCard, selectedCardData }: ModalInfoAlbum) => {
  const { fetchAlbumByIdv2 } = useAlbumStore();
  const [dataAlbum, setDataAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (selectedCard !== "") {
      handleFetchData(selectedCard);
    }
  }, [selectedCard])

  const handleFetchData = async (selectedCard: string) => {
    const res = await fetchAlbumByIdv2(selectedCard);
    if (res && !_.isEmpty(res)) {
      setDataAlbum(res.dataAlbum);
    }
  }

  return (
    <>
      <motion.div
        layoutId={selectedCard}
        className="fixed left-[400px] right-[400px] top-[120px] bottom-[140px] bg-white rounded-2xl overflow-hidden shadow-2xl z-50">
        <div className="relative h-full flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-zinc-600/20 backdrop-blur-sm hover:bg-zinc-600/40"
            onClick={() => setSelectedCard(null)}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative h-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br opacity-90`} />
            <div
              className="absolute inset-0 bg-cover bg-center object-contain object-center"
              style={{ backgroundImage: `url(${selectedCardData.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />

            <div className="relative h-full p-4 flex flex-col justify-between text-white">
              <div className="inline-flex gap-2 bg-zinc-600/20 backdrop-blur-sm py-2 px-3 rounded-sm w-max transition-all ease-linear duration-150">
                <div className="w-[65px] overflow-hidden">
                  <img src={selectedCardData.imageUrl} alt={selectedCardData.title} loading="lazy"
                    className="rounded-sm aspect-square object-cover w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-md font-bold leading-tight">{selectedCardData.title}</h2>
                  <div className="text-sm font-medium opacity-80 mb-2">Playlist • Spotify</div>
                </div>
              </div>
            </div>

          </div>
          <motion.div
            className="flex-1 p-6 overflow-y-auto absolute bottom-0 m-4 rounded-md w-[calc(100%-2rem)] bg-zinc-600/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{
              delay: 0,
              duration: 0.4,
              ease: "linear",
            }}
          >
            <div className="overflow-hidden hide-scrollbar h-[300px] ">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 cursor-default">
                  <ListMusic className="animate-pulse repeat-infinite" />
                  <div className="text-white font-semibold">List songs</div>
                </div>
                <div className="px-2 py-1 text-white font-semibold bg-gradient-to-l from-zinc-600/30 via-zinc-600/30 to-green-500 bg-[length:300%_100%] bg-right hover:bg-left transition-all duration-500 ease-in-out rounded-md flex cursor-pointer">
                  <ChevronsRight size={20} />
                  <span className="font-thin text-sm pr-1">More</span>
                </div>

              </div>

              <motion.div
                className="mt-4 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <div className="h-[225px] overflow-y-scroll hide-scrollbar scroll-smooth">
                  {!dataAlbum &&
                    <ListAlbumModalSkeleton />
                  }
                  {dataAlbum && dataAlbum.songs.length > 0 &&
                    dataAlbum.songs.slice(0, 6).map((item, index) => (
                      <div key={index} className="grid grid-cols-[50px_1fr_70px] gap-4 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-500/30 rounded-md group cursor-pointer bg-zinc-600/30 my-1">
                        <div className="w-[50px] overflow-hidden rounded-sm">
                          <img src={item.imageUrl} alt={item.title} loading="lazy" className="aspect-square object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <div className=" text-white font-semibold">{item.title}</div>
                          <div className="text-zinc-300">
                            {item.artistId.map((artist, index) => (
                              <React.Fragment key={index}>
                                <span className="inline-block cursor-pointer hover:underline">
                                  {artist.name}
                                </span>
                                {index < item.artistId.length - 1 && ` | `}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 items-center ">
                          <div className="text-white font-semibold text-sm">
                            {formatDuraion(item.duration)}
                          </div>
                          <div>
                            <Ellipsis size={20} />
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            </div>
          </motion.div >
        </div >
      </motion.div >
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
    </>
  )
}
export default ModalInfoAlbum