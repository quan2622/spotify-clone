import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import CardShowcase from "./CardShowcase"
import ModalInfoAlbum from "./ModalInfoAlbum"

interface CardData {
  id: string
  category: string
  title: string
  subtitle?: string
  image: string
  description: string
  fullContent: string
  color: string
}

const cardData: CardData[] = [
  {
    id: "travel",
    category: "TRAVEL",
    title: "5 Inspiring Apps",
    subtitle: "for Your Next Trip",
    image: "/placeholder.svg?height=400&width=600",
    description: "Discover amazing travel apps that will transform your journey",
    fullContent:
      "Love to travel? So do the makers of these five subscription apps. For a small monthly fee, they'll help you find the best deals on flights, hotels, and some other stuff we turn a blind eye to.\n\nPlan your perfect itinerary with intelligent recommendations based on your interests, time, and credit history.",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "howto",
    category: "HOW TO",
    title: "Contemplate the Meaning",
    subtitle: "of Life Twice a Day",
    image: "/placeholder.svg?height=400&width=600",
    description: "Mindfulness and meditation for modern life",
    fullContent:
      "In our fast-paced world, taking time to reflect and contemplate has become more important than ever. This collection of mindfulness apps will help you find peace and clarity in your daily routine.\n\nLearn meditation techniques, practice breathing exercises, and develop a deeper understanding of yourself through guided sessions and expert advice.",
    color: "from-green-400 to-green-600",
  },
  {
    id: "steps",
    category: "STEPS",
    title: "Urban Exploration Apps",
    subtitle: "for the Vertically-Inclined",
    image: "/placeholder.svg?height=400&width=600",
    description: "Navigate city landscapes with confidence",
    fullContent:
      "Whether you're scaling skyscrapers or exploring underground tunnels, these urban exploration apps will be your perfect companion. Get detailed maps, safety tips, and connect with fellow explorers.\n\nDiscover hidden gems in your city, find the best viewpoints, and document your adventures with professional photography tools built right into these applications.",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    id: "hats",
    category: "HATS",
    title: "Take Control of Your Hat Life",
    subtitle: "With This Stunning New App",
    image: "/placeholder.svg?height=400&width=600",
    description: "The ultimate hat collection and styling guide",
    fullContent:
      "From fedoras to baseball caps, this revolutionary app helps you organize, style, and care for your hat collection. Get personalized recommendations based on your face shape, style preferences, and occasion.\n\nConnect with hat enthusiasts worldwide, share your collection, and discover rare and vintage pieces through our integrated marketplace.",
    color: "from-purple-400 to-purple-600",
  },
]

const MainDisplay = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const navigate = useNavigate();

  const selectedCardData = cardData.find((card) => card.id === selectedCard)



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
              <CardShowcase cardData={cardData} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
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