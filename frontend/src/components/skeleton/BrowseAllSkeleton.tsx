const BrowseAllSkeleton = () => {
  return (
    <div className="p-6">
      <div className="text-2xl font-bold mb-6 h-10 w-1/5 bg-zinc-900/80 rounded-md animate-pulse" />
      <div className="flex items-center mb-4 flex-wrap justify-between">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-[calc(100%/3-8px)] h-[150px] bg-zinc-800 rounded-md overflow-hidden animate-pulse relative mb-4">
            <div className="absolute left-3 bottom-3 z-10 cursor-default">
              <div className="h-8 w-[160px] rounded-md bg-zinc-900/70 animate-pulse mb-3" />
              <div className="h-7 w-[100px] bg-zinc-900/70 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default BrowseAllSkeleton