import { useEffect, useState } from "react"
import { useUserStore } from "../../stores/useUserStore"
import { HeadphonesIcon, Music, PanelRightClose, PanelRightOpen, Users } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useChatStore } from "../../stores/useChatStore";
import MarqueeName from "./MarqueeName";

type RightSideType = {
  isCollapseRight: boolean;
  handleCollapse: () => void;
}

const RightSide = ({ isCollapseRight, handleCollapse }: RightSideType) => {
  const { onlineUsers, userActivities } = useChatStore();
  const { users, fetchUser } = useUserStore();
  const [isHover, setIsHover] = useState(false);

  const { user } = useUser();
  useEffect(() => {
    if (user) fetchUser();
  }, [fetchUser, user]);

  useEffect(() => {
    setIsHover(false);
  }, [isCollapseRight])

  const handleAvtName = (userName: string) => {
    const new_name = userName.split(' ');
    return `${new_name[0].charAt(0).toUpperCase()}${new_name[new_name.length - 1].charAt(0).toUpperCase()}`;
  }

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="p-4 flex justify-between items-center border-b border-zinc-800 mx-auto relative">
        <span className={`transition-all ease duration-300 absolute -left-[10px] ${isHover ? 'opacity-100 translate-x-2' : 'opacity-0 -translate-x-4'}`}>
          {!isCollapseRight &&
            <PanelRightClose className="size-5 shrink-0 cursor-pointer" onClick={handleCollapse} />
          }
        </span>
        <div className={`relative flex items-center gap-2 transition-all duration-300 ${isCollapseRight ? 'justify-center' : ''} ${isHover ? 'translate-x-2' : ''}`}>

          <PanelRightOpen className={`absolute size-5 shrink-0 cursor-pointer
          ${isCollapseRight && isHover ? 'opacity-100 -translate-x-3' : 'opacity-0 -translate-x-2 pointer-events-none'}
          transition-all duration-300 ease-in-out
          `}
            onClick={handleCollapse} />


          <Users className={`size-5 shrink-0  
            transition-all duration-300 ease-in-out
            ${isCollapseRight ? 'mx-auto' : ''}
            ${!isCollapseRight || !isHover ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'}
            `} />
          {!isCollapseRight &&
            <h2 className="font-semibold">What they're listening to</h2>
          }
        </div>
      </div>
      {!user &&
        <LoginPrompt />
      }

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {users.map((user) => {
            const activity = userActivities.get(user.clerkId);
            const isPlaying = activity && activity !== 'Idle';

            return (
              <div key={user._id} className="cursor-pointer hover:bg-zinc-800/50 rounded-md transition-colors group p-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="size-10 border border-zinc-800">
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{handleAvtName(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900  ${onlineUsers.has(user.clerkId) ? 'bg-green-500' : 'bg-zinc-500'}`}
                      aria-hidden='true' />
                  </div>
                  {!isCollapseRight &&
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MarqueeName>{user.fullName}</MarqueeName>
                        {isPlaying && <Music className="size-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      {isPlaying ?
                        <div className="mt-1">
                          <div className="mt-1 text-sm text-white font-medium truncate">
                            {activity.replace('Playing ', '').split('by')[0].trim()}
                          </div>
                          <div className="text-xs text-zinc-400 truncate">
                            {activity.replace('Playing ', '').split('by')[1].trim()}
                          </div>
                        </div>
                        :
                        <div className="mt-1 text-xs text-zinc-400">Idle</div>
                      }
                    </div>
                  }
                </div>
              </div>
            )
          }

          )}
        </div>
      </ScrollArea>
    </div>
  )
}
export default RightSide;


// Login Prompt
const LoginPrompt = () => (
  <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
    <div className='relative'>
      <div
        className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-80 animate-pulse'
        aria-hidden='true'
      />
      <div className='relative bg-zinc-900 rounded-full p-4'>
        <HeadphonesIcon className='size-8 text-emerald-400' />
      </div>
    </div>

    <div className='space-y-2 max-w-[250px]'>
      <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
      <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
    </div>
  </div>
);