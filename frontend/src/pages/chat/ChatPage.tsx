import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "../../stores/useChatStore"
import { useEffect } from "react";
import Topbar from "../../components/Topbar";
import UserList from "./components/UserList";

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
      </div>
    </main>
  )
}

export default ChatPage