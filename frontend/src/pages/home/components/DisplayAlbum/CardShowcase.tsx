import { motion } from "framer-motion"
import type { AlbumCaching } from "../../../../types";
import { CirclePlus, Ellipsis, Play, VolumeX } from "lucide-react";
import _ from "lodash";

interface CardShowcase {
  cardData: AlbumCaching[];
  selectedCard: string | null;
  setSelectedCard: (id: string) => void;
}

const CardShowcase = ({ cardData, selectedCard, setSelectedCard }: CardShowcase) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {cardData.map((card, index) => {
        // handle config layout
        const row = Math.floor(index / 2);
        const isLeft = index % 2 === 0;
        const rowLayout = row % 2 === 0 ? (isLeft ? 7 : 5) : (isLeft ? 5 : 7);
        const colSpan = rowLayout === 5 ? 'col-span-5' : 'col-span-7';
        // handle card selected
        const isSelected = selectedCard === card._id
        if (isSelected) {
          return (
            <div
              key={`${card._id}-placeholder`}
              className={`${colSpan} h-80 opacity-0`}
            />
          )
        }

        return (
          <motion.div
            key={card._id}
            layoutId={card._id}
            className={`group/box relative rounded-2xl overflow-hidden cursor-pointer h-[330px] ${colSpan}  ${selectedCard === card._id ? "opacity-0 pointer-events-none" : ""}`}
            onClick={() => setSelectedCard(card._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />

            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              <div className="inline-flex gap-2 group-hover/box:bg-zinc-600/20 group-hover/box:backdrop-blur-sm py-2 px-3 rounded-sm w-max transition-all ease-linear duration-150">
                <div className="w-[65px] overflow-hidden">
                  <img src={card.imageUrl} alt={card.title} loading="lazy"
                    className="rounded-sm aspect-square object-cover w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-md font-bold leading-tight">{card.title}</h2>
                  <div className="text-sm font-medium opacity-80 mb-2">Playlist • Spotify</div>
                </div>
              </div>
            </div>
            <div className="absolute h-max w-[calc(100%-1rem)] -bottom-20 px-6 pb-6 pt-3 group-hover/box:bottom-0 transition-all ease-linear duration-200 group-hover/box:bg-zinc-600/20 group-hover/box:backdrop-blur-sm rounded-md m-2">
              <div className="invisible group-hover/box:visible">
                <div className="text-base font-medium opacity-80 mb-8">{card.description}</div>
                <div className="flex justify-between">
                  <button
                    className="flex items-center gap-1 bg-zinc-800/40 text-white px-3 py-[6px] rounded-full transition-all group"
                  >
                    <VolumeX className="size-5 group-hover:animate-pulse duration-100 " />
                    <div className="font-semibold group-hover:animate-pulse duration-100">Preview</div>
                  </button>
                  <div className="flex gap-3 items-center">
                    <Ellipsis className="text-zinc-300 hover:text-white transition-all ease-out duration-150" />
                    <CirclePlus className="text-zinc-300 hover:text-white transition-all ease-out duration-150" />
                    <div className="bg-white p-3 rounded-full hover:scale-105 transition-all ease-out duration-150">
                      <Play className="size-5 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
export default CardShowcase