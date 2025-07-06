import { useEffect, useState } from "react";
import { useUIStore } from "../stores/useUIStore";

const useUpdateMainSize = () => {
  const { mainSize } = useUIStore();
  const [typeSize, setTypeSize] = useState<string>("");

  console.log("Check main size: ", mainSize)

  useEffect(() => {
    if (mainSize === 88) {
      setTypeSize("large");
    } else if (mainSize === 74) {
      setTypeSize("medium");
    } else if (mainSize === 60) {
      setTypeSize("small");
    } else {
      setTypeSize("");
    }
  }, [mainSize]);

  return typeSize;
};

export default useUpdateMainSize;