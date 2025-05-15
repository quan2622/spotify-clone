import { useAuth } from "@clerk/clerk-react"
import React, { useEffect, useState } from "react";
import { axiosIntance } from "../lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";

const updateApiToken = (token: String | null) => {
  if (token) axiosIntance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axiosIntance.defaults.headers.common['Authorization'];
}


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdmin } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        updateApiToken(token);
        if (token) {
          await checkAdmin();
          // init socket
          if (userId) {
            // userId của Clerk <=> clerkId in DB
            initSocket(userId);
          }
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log('Error in auth porvider', error);
      } finally {
        setLoading(false);
      }
    }
    initAuth();

    // disconnect socket
    return () => disconnectSocket();

  }, [getToken, userId, checkAdmin, initSocket, disconnectSocket]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="size-8 text-emerald-500 animate-spin" />
    </div>
  )

  return (
    <div>{children}</div>
  )
}

export default AuthProvider