import { motion } from "framer-motion"
import { X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CardData {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  fullContent: string;
  color: string;
}
interface ModalInfoAlbum {
  selectedCard: string;
  selectedCardData: CardData;
  setSelectedCard: (id: string | null) => void;
}

const ModalInfoAlbum = ({ selectedCard, setSelectedCard, selectedCardData }: ModalInfoAlbum) => {
  return (
    <>
      <motion.div
        layoutId={selectedCard}
        className="fixed left-[400px] right-[400px] top-[120px] bottom-[140px] bg-white rounded-2xl overflow-hidden shadow-2xl z-50">
        <div className="relative h-full flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={() => setSelectedCard(null)}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative h-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedCardData.color} opacity-90`} />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedCardData.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />

            <div className="relative h-full p-8 flex flex-col text-white">
              <div className="text-sm font-medium opacity-80 mb-2">{selectedCardData.category}</div>
              <h1 className="text-4xl font-bold leading-tight mb-2">{selectedCardData.title}</h1>
              {selectedCardData.subtitle && (
                <h2 className="text-4xl font-bold leading-tight">{selectedCardData.subtitle}</h2>
              )}
            </div>

          </div>
          <motion.div
            className="flex-1 p-6 overflow-y-auto absolute bottom-0 bg-white"
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{
              delay: 0,
              duration: 0.4,
              ease: "linear",
            }}
          >
            <div className="overflow-hidden hide-scrollbar max-h-[100px]">
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedCardData.fullContent}
              </p>

              {/* <motion.div
                          className="mt-6 pt-6 border-t border-gray-200"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.5,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        >
                          <Button size="lg" className="w-full md:w-auto">
                            Get Started
                          </Button>
                        </motion.div> */}
            </div>
          </motion.div>
        </div>
      </motion.div>
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