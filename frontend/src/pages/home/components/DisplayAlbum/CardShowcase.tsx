import { motion } from "framer-motion"

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

interface CardShowcase {
  cardData: CardData[];
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
        const isSelected = selectedCard === card.id
        if (isSelected) {
          return (
            <div
              key={`${card.id}-placeholder`}
              className={`${colSpan} h-80 opacity-0`}
            />
          )
        }

        return (
          <motion.div
            key={card.id}
            layoutId={card.id}
            className={`relative rounded-2xl overflow-hidden cursor-pointer h-[330px] ${colSpan}  ${selectedCard === card.id ? "opacity-0 pointer-events-none" : ""}`}
            onClick={() => setSelectedCard(card.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />

            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              <div>
                <div className="text-sm font-medium opacity-80 mb-2">{card.category}</div>
                <h2 className="text-2xl font-bold leading-tight">{card.title}</h2>
                {card.subtitle && <h3 className="text-2xl font-bold leading-tight">{card.subtitle}</h3>}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
export default CardShowcase