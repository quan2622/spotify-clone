import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/useUIStore";

const ChangeBGGradient = () => {
  const [currentBg, setCurrentBg] = useState("");
  const [nextBg, setNextBg] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { primColor } = useUIStore();


  useEffect(() => {
    if (primColor === currentBg) return;
    setIsTransitioning(true);
    setNextBg(primColor);

    const timeout = setTimeout(() => {
      setCurrentBg(primColor);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [primColor, currentBg]);

  return (
    <>
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-linear z-0"
        style={{ background: currentBg, }}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-linear z-0 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
        style={{ background: nextBg }}
      />
    </>
  )
}
export default ChangeBGGradient