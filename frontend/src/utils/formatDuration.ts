export const formatDuraion = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const remainingSecond = duration % 60;
  return `${minutes}:${remainingSecond.toString().padStart(2, "0")}`;
};