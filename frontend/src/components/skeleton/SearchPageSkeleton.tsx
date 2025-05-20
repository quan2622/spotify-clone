const SearchPageSkeleton = () => {
  return (
    <div className="p-4">
      <div>
        <div className="h-12 w-[20%] bg-zinc-900 rounded-md mb-3 animate-pulse" />
        <div className="flex gap-6 bg-zinc-700/30 p-5 rounded-md">
          <div className="w-[35%] bg-zinc-900 p-4 rounded-md flex items-center justify-center min-h-[200px] animate-pulse" />
          <div className="w-[50%] p-4">
            <div className="font-bold text-3xl animate-pulse h-10 w-2/4 bg-zinc-900 rounded-md" />
            <div className="font-medium py-3 h-8 bg-zinc-900 w-3/4 rounded-md animate-pulse my-3" />
            <div className="text-sm pt-1 pb-5 bg-zinc-900 h-10 w-[160px] rounded-md animate-pulse" />
            <div className="flex gap-4 items-center">
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="h-12 w-[20%] bg-zinc-800 rounded-md mb-3 animate-pulse" />
        <div className="mt-3">
          <div className="h-10 w-full bg-zinc-800 rounded-md animate-pulse my-3" />
          <div className="h-10 w-full bg-zinc-800 rounded-md animate-pulse my-3" />
        </div>
      </div>
    </div>
  )
}
export default SearchPageSkeleton