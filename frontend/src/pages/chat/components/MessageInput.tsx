import { useUser } from "@clerk/clerk-react";
import { useState } from "react"
import { useChatStore } from "../../../stores/useChatStore";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useUser();
  const { selectedUser, sendMessage } = useChatStore();

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) return;

    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage('');
  }


  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="bg-zinc-800 border-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button size={'icon'} onClick={handleSend} disabled={!newMessage.trim()} className="w-[60px] text-center">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
export default MessageInput