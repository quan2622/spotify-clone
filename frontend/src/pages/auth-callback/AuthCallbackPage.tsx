import { Loader } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { useEffect, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import { axiosIntance } from "../../lib/axios"
import { useNavigate } from "react-router-dom"


const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;

      try {
        // syncAttempted -> true to post api once
        syncAttempted.current = true;

        await axiosIntance.post("auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.log("Error in auth callback", error);
      } finally {
        navigate('/');
      }
    }
    syncUser();
  }, [isLoaded, user]);

  return (
    <div className="h-screen flex bg-black items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="size-6 text-emerald-500 animate-spin" />
          <h3 className="text-zinc-400 text-xl font-bold">Login you in</h3>
          <p className="text-zinc-400 text-sm">Loading ....</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage