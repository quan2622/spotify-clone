import { HomeIcon, Library, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import { buttonVariants } from "../../components/ui/button"
import { SignedIn } from "@clerk/clerk-react"
import { ScrollArea } from "../../components/ui/scroll-area"
import PlayListSkeleton from "../../components/skeleton/PlayListSkeleton"
import { useMusicStore } from "../../stores/useMusicStore"
import { useEffect } from "react"

const LeftSideBar = () => {
  const { albums, fetchAlbum, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  console.log('>> check album', { albums }, 'status: ', isLoading);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link to={'/'} className={cn(buttonVariants({
            variant: "ghost",
            className: "w-full justify-start text-white hover: bg-zinc-800"
          }))}>
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link to={'/chats'} className={cn(buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover: bg-zinc-800"
            }))}>
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Message</span>
            </Link>
          </SignedIn>
        </div>
      </div>
      {/* Library section */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Playlists</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-209px)]">
          <div className="space-y-2">
            {isLoading ?
              <PlayListSkeleton /> :
              (albums.map((album) =>
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 flex items-center gap-3 group cursor-pointer"
                >
                  <img src={album.imageUrl} alt={album._id} className="size-12 rounded-md flex-shrink-0 object-cover" />
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">
                      {album.title}
                    </p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            }
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default LeftSideBar