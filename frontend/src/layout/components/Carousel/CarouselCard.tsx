import clsx from "clsx";
import { useState } from "react"
import useUpdateMainSize from "../../../hooks/useUpdateMainSize";

type CarouselCardType = {
  title: string,
  subtitle: string,
  imageUrl: string,
}


const CarouselCard = ({ title, subtitle, imageUrl }: CarouselCardType) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const typeSize = useUpdateMainSize();

  return (
    <div className={clsx("flex gap-3 bg-zinc-900/80 rounded-md hover:bg-zinc-800"
      ,
      typeSize === 'small' ? 'm-3' : '',
      typeSize === 'medium' ? 'm-2' : '',
      typeSize === 'large' ? 'm-2' : ''
    )}>
      <img
        src={imageUrl}
        alt={title}
        // className="w-20 h-20 object-cover rounded-md lazy-image"
        className={clsx("w-20 h-20 object-cover rounded-md transition duration-500", imgLoaded ? "blur-0" : "blur-md")}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
      />
      <div className="text-sm text-white pt-2 pr-2">
        <div className={clsx("font-semibold uppercase text-xs text-gray-400 truncate",
          typeSize === 'small' ? 'max-w-[140px]' : '',
          typeSize === 'medium' ? 'max-w-[135px]' : '',
          typeSize === 'large' ? 'max-w-[187px]' : ''
        )}>
          {subtitle}</div>
        <div className="font-bold text-base leading-tight max-w-[160px] text-wrap truncate ">{title}</div>
      </div>
      <style>
        {`
        /* styles.css */
          .lazy-image {
            filter: blur(10px);
            transition: filter 0.3s ease-out;
          }
          .lazy-image-loaded {
            filter: blur(0);
          }
        `}
      </style>
    </div>
  )
}
export default CarouselCard