import { HomeIcon, Library, MessageCircle, Music, PanelRightClose, PanelRightOpen, Plus, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import { buttonVariants } from "../../components/ui/button"
import { SignedIn, useAuth, useUser } from "@clerk/clerk-react"
import { ScrollArea } from "../../components/ui/scroll-area"
import PlayListSkeleton from "../../components/skeleton/PlayListSkeleton"
import { useMusicStore } from "../../stores/useMusicStore"
import { useEffect, useState } from "react"
import Fuse from "fuse.js"
import { Album } from "../../types"

type LeftSideBarType = {
  isCollapseLeft: boolean;
  handleCollapse: () => void;
}

const LeftSideBar = ({ isCollapseLeft, handleCollapse }: LeftSideBarType) => {
  const { user } = useUser();
  const { albumsUser, fetchAlbum, isLoading, createAlbumUser } = useMusicStore();
  const { userId } = useAuth();
  const [album_rd, setAlbum_rd] = useState<Album[] | null>(null);
  const [query, setQuery] = useState("");
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    fetchAlbum("USER");
  }, [fetchAlbum]);

  useEffect(() => {
    setAlbum_rd(albumsUser);
  }, [albumsUser]);

  useEffect(() => {
    setIsHover(false);
  }, [isCollapseLeft]);

  const handleCreateNew = async () => {
    await createAlbumUser();
  }

  const fuse = new Fuse(albumsUser, {
    keys: ['title', 'artist'],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query_sr = e.target.value;
    setQuery(query_sr);

    if (query_sr.length !== 0) {
      const results = fuse.search(query_sr);
      setAlbum_rd(results.map(result => result.item));
    } else {
      setAlbum_rd(albumsUser);
    }
  }

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: `w-full text-white hover:bg-zinc-800 ${isCollapseLeft ? 'flex items-center justify-center' : 'justify-start'}`
              })
            )}>
            <HomeIcon className={`size-5 ${isCollapseLeft ? 'mr-0' : 'mr-2'}`} />
            {!isCollapseLeft && <span className="hidden md:inline">Home</span>}
          </Link>

          <SignedIn>
            <Link
              to="/chats"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: `w-full text-white hover:bg-zinc-800 ${isCollapseLeft ? 'flex items-center justify-center' : 'justify-start'}`
                })
              )}>
              <MessageCircle className={`size-5 ${isCollapseLeft ? 'mr-0' : 'mr-2'}`} />
              {!isCollapseLeft && <span className="hidden md:inline">Message</span>}
            </Link>
          </SignedIn>

        </div>

      </div>
      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4 overflow-hidden"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex items-center justify-center mb-4 flex-col">
          <div className="flex justify-between items-center">
            <span className={`transition-all ease duration-300 absolute left-[300px] ${isHover ? 'opacity-100 -translate-x-8 right-3' : 'opacity-0 -translate-x-4'}`}>
              {!isCollapseLeft &&
                < PanelRightOpen className="size-5 shrink-0 cursor-pointer" onClick={handleCollapse} />
              }
            </span>
            <div className="flex items-center text-white px-2 mx-auto relative">
              <PanelRightClose
                className={` absolute
                size-5 shrink-0 cursor-pointer
                transition-all duration-300 ease-in-out
                ${isCollapseLeft && isHover ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 pointer-events-none'}
              `}
                onClick={handleCollapse}
              />

              <Library
                className={`
                size-5 
                transition-all duration-300 ease-in-out
                ${isCollapseLeft ? 'mr-0' : 'mr-2'}
                ${!isCollapseLeft || !isHover ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 pointer-events-none'}
              `}
              />

              {!isCollapseLeft && <span className="hidden md:inline">Playlists</span>}
            </div>
          </div>
          <div className="flex items-center justify-between w-full px-2 mt-2">
            {userId && !isCollapseLeft &&
              <>
                <div className="relative flex items-center group">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center -mr-5 z-10 border border-black">
                    <Search className="w-5 h-5 text-black" />
                  </div>

                  <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Album/Artist"
                    className={`transition-all border-none outline-none duration-300 ease-out transform bg-zinc-600 text-white placeholder-white pl-7 pr-4 py-2 w-[180px] rounded-r-full z-0 ${query.length !== 0
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                  />
                </div>

                <div className="p-2 rounded-full bg-zinc-600/50 relative" onClick={handleCreateNew}>
                  <Plus className="size-5 " />
                </div>
              </>
            }
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-303px)]">
          <div className="space-y-2">
            {isLoading ?
              <PlayListSkeleton /> :
              (album_rd && album_rd.map((album) =>
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className={`p-2 hover:bg-zinc-800 flex items-center gap-3 group cursor-pointer rounded-md ${isCollapseLeft ? 'p-[5px]' : ''}`}
                >
                  {album.imageUrl ?
                    <img src={album.imageUrl} alt={album._id} className="size-12 rounded-md flex-shrink-0 object-cover" />
                    :
                    <div className="size-12 rounded-md flex object-cover bg-zinc-500 items-center">
                      <Music className="m-auto size-5" />
                    </div>
                  }
                  {!isCollapseLeft &&
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">
                        {album.title}
                      </p>
                      <p className="text-sm text-zinc-400 truncate">
                        Album • {`${user?.lastName} ${user?.firstName}`}
                      </p>
                    </div>
                  }
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