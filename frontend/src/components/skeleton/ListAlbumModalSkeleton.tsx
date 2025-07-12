import { Ellipsis } from "lucide-react"

const ListAlbumModalSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="grid grid-cols-[50px_1fr_30px] gap-4 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-500/30 rounded-md group cursor-pointer bg-zinc-600/30 my-1">
          <div className="w-[50px] h-[50px] bg-zinc-800/80 rounded-sm animate-pulse" />

          <div className="flex flex-col gap-1 pt-1/2">
            <div className=" font-semibold h-5 w-1/3 bg-zinc-800/80 rounded-md animate-pulse" />
            <div className="bg-zinc-800/80 h-4 w-1/4 rounded-md animate-pulse">
              <div />
              <div />
            </div>
          </div>
          <div className="flex gap-1 items-center ">
            <Ellipsis size={20} />
          </div>
        </div>
      ))}
    </>
  )
}
export default ListAlbumModalSkeleton