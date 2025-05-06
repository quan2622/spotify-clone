import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "../../stores/useChatStore"
import { useEffect } from "react";
import Topbar from "../../components/Topbar";
import UserList from "./components/UserList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessage } = useChatStore();

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessage(selectedUser.clerkId);
  }, [fetchMessage, selectedUser]);


  return (
    <main className="h-full rounded-md bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UserList />

        {/* chat message */}
        <div className="flex flex-col h-full">
          {selectedUser ?
            (
              <>
                <ChatHeader />
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="p-4 space-y-4">
                    {messages.map((m) => (
                      <div key={m._id}
                        className={`flex items-start gap-3 ${m.senderId === user?.id ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="size-8">
                          <AvatarImage src={m.senderId === user?.id ? user.imageUrl : selectedUser.imageUrl} />
                        </Avatar>

                        <div className={`rounded-lg p-3 max-w-[70%]  
                          ${m.senderId === user?.id ? 'bg-green-500' : 'bg-zinc-800'}`}
                        >
                          <p className="text-sm">{m.content}</p>
                          <span className="text-xs text-zinc-300 mt-1 block">
                            {formatTime(m.createdAt)}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <MessageInput />
              </>
            )
            : (
              <NoConversationPlaceholder />
            )
          }
        </div>
      </div>
    </main>
  )
}

export default ChatPage;

const NoConversationPlaceholder = () => (
  <div className='flex flex-col items-center justify-center h-full space-y-6'>
    <img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' />
    <div className='text-center'>
      <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
      <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
    </div>
  </div>
);