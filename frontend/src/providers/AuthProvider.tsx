import { useAuth } from "@clerk/clerk-react"
import React, { useEffect, useState } from "react";
import { axiosIntance } from "../lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const updateApiToken = (token: String | null) => {
  if (token) axiosIntance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axiosIntance.defaults.headers.common['Authorization'];
}


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdmin } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdmin();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log('Error in auth porvider', error);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [getToken]);

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