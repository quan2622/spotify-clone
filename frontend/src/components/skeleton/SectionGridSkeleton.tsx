const SectionGridSkeleton = () => {
  return (
    <div className="mb-8">
      <div className="h-8 w-48 bg-zinc-700/50 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-800/40 rounded-md animate-pulse p-4">
            <div className="aspect-square bg-zinc-700 mb-4" />
            <div className="h-4 bg-zinc-700 w-3/4 mb-2 rounded-md" />
            <div className="h-4 bg-zinc-700 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SectionGridSkeleton