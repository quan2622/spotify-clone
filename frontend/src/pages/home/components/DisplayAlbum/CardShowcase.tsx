import { motion } from "framer-motion"
import type { AlbumCaching } from "../../../../types";
import { CirclePlus, Ellipsis, Play, VolumeX } from "lucide-react";
import _ from "lodash";
import type { RefObject } from "react";

interface CardShowcase {
  cardData: AlbumCaching[];
  selectedCard: string | null;
  setSelectedCard: (id: string) => void;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  isEnd: boolean;
  initialLoading: boolean;
  isEmpty: boolean;
  error: string | null;
  refresh: () => void;
  retry: () => void;
  currentPage: number;
  totalItems: number;
}


const CardShowcase = ({ cardData, selectedCard, setSelectedCard, loading, hasMore, loadMore, triggerRef, isEnd, initialLoading, isEmpty, error, refresh, retry, currentPage, totalItems }: CardShowcase) => {

  console.log("Check data: ", cardData);

  if (initialLoading && _.isEmpty(cardData)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Đang tải album...</span>
      </div>
    );
  }


  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có album nào</p>
        <button
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tải lại
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Lỗi: {error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Thử lại
        </button>
      </div>
    );
  }


  return (
    <>
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
              key={index}
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

      {hasMore && triggerRef && (
        <div
          ref={triggerRef}
          className="h-20 flex items-center justify-center pt-8"
        >
          {loading ?
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2">Đang tải thêm...</span>
            </div>
            :
            <span className="text-gray-400 text-lg font-semibold">Cuộn xuống để tải thêm...</span>
          }
        </div>
      )}

      {hasMore && loadMore && (
        <div className="text-center py-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-5 py-2 bg-zinc-600 text-white rounded hover:rounded-md hover:bg-emerald-500 disabled:opacity-50 transition-all ease-out duration-200 shadow-[0_0_10px_rgba(255,255,255,0.8)] hover:shadow-[0_0_16px_rgba(255,255,255)] font-semibold"
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}

      {isEnd && (
        <div className="flex justify-center items-center cursor-default">
          <p className="text-emerald-600/50 p-10 pb-0 hover:text-emerald-500 transition-all ease-linear duration-200">You've reached the end — all albums have been loaded.</p>
        </div>
      )}
    </>
  )
}
export default CardShowcase