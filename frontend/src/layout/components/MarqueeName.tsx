import { useEffect, useRef, useState } from "react"

const MarqueeName = ({ children }: { children: any }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [showAnimate, setIsShowAnimate] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (container && text) {
      if (text.scrollWidth > container.clientWidth) {
        setIsShowAnimate(true);
        setDistance(text.scrollWidth - container.clientWidth);
      } else {
        setIsShowAnimate(false);
        setDistance(0);
      }
    }
  }, [children]);

  return (
    <div className="relative w-[160px] overflow-hidden" ref={containerRef}>
      <span
        className="inline-block whitespace-nowrap font-medium text-sm text-white"
        ref={textRef}
        style={
          showAnimate ?
            {
              animation: `marquee_name ${distance / 10}s linear infinite`
            } : {}
        }
      >
        {children}
      </span>
      <style>
        {`
          @keyframes marquee_name {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${distance + 5}px); }
          }
        `}
      </style>
    </div>
  )
}
export default MarqueeName