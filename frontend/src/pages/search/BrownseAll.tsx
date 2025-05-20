import BrowseAllSkeleton from "../../components/skeleton/BrowseAllSkeleton"

const BrownseAll = () => {

  if (false) {
    return <BrowseAllSkeleton />
  }
  return (
    <div className="p-6">
      <div className="text-2xl font-bold mb-6">Browse All</div>
      <div className="flex items-center mb-4 flex-wrap justify-between">
        <div className="w-[calc(100%/3-8px)] h-[150px] bg-zinc-300 rounded-md hover:shadow-[1px_1px_10px_#fff] transition-all duration-300  border-solid border-zinc-900 flex items-end relative overflow-hidden mb-4 group">
          <img src="https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa" alt="" className=" h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 pointer-events-none"></div>
          <div className="absolute left-3 bottom-3 z-10 cursor-default">
            <div className="text-lg font-bold hover:underline">Deep RL Course</div>
            <p className="text-sm">Mo ta ....</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BrownseAll