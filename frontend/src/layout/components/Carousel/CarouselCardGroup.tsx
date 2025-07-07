import clsx from "clsx";
import useUpdateMainSize from "../../../hooks/useUpdateMainSize";
import CarouselCard from "./CarouselCard"

const CarouselCardGroup = ({ group }: { group: any }) => {
  const typeSize = useUpdateMainSize()
  return (
    <div className={clsx("shrink-0 flex flex-col snap-start",
      typeSize === 'small' ? 'w-[270px]' : '',
      typeSize === 'medium' ? 'w-[250px]' : '',
      typeSize === 'large' ? 'w-[306px]' : '')
    }>
      <CarouselCard {...group[0]} />
      <CarouselCard {...group[1]} />
    </div>
  )
}
export default CarouselCardGroup