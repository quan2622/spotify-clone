import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import CardShowcase from "./CardShowcase"
import ModalInfoAlbum from "./ModalInfoAlbum"
import useCachingAlbumLazy from "../../../../hooks/useCachingAlbumLazy"


const MainDisplay = () => {
  const {
    data: albums,
    loading,
    initialLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    retry,
    triggerRef,
    isEmpty,
    isEnd,
    currentPage,
    totalItems,
  } = useCachingAlbumLazy({
    pageSize: 2,
    threshold: 0.1,
    rootMargin: "200px",
  });


  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const navigate = useNavigate();
  const selectedCardData = albums.find((album) => album._id === selectedCard)

  return (
    <>
      <div className="w-full min-h-screen p-3 mt-2">
        <LayoutGroup>
          <div className="max-w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl sm:text-2xl font-bold">Album For Day</h1>
              <Button variant={'link'} className="text-sm text-zinc-400 hover:text-white"
              // onClick={() => navigate(`/${title}`)}
              >
                Show all
              </Button>
            </div>

            <AnimatePresence>
              <CardShowcase
                cardData={albums}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                loading={loading}
                hasMore={hasMore}
                loadMore={loadMore}
                triggerRef={triggerRef}
                isEnd={isEnd}
                initialLoading={initialLoading}
                isEmpty={isEmpty}
                error={error}
                refresh={refresh}
                retry={retry}
                currentPage={currentPage}
                totalItems={totalItems}
              />
            </AnimatePresence>

            <AnimatePresence>
              {selectedCard && selectedCardData && (
                <ModalInfoAlbum selectedCard={selectedCard} setSelectedCard={setSelectedCard} selectedCardData={selectedCardData} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedCard(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </>
  )
}

export default MainDisplay;