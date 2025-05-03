import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignInAuthButton from "./SignInAuthButton";
import { useAuthStore } from "../stores/useAuthStore";
import { LayoutDashboardIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
    backdrop-blur-sm z-10 rounded-md">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" alt="logo-spotify" className="size-8" />
        <span className="text-md font-semibold">Spotify</span>
      </div>
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Link to={'/admin'}
            className={cn(buttonVariants({ variant: "outline" }))}>
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin DashBoard
          </Link>
        )}

        <SignedOut>
          <SignInAuthButton />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  )
}

export default Topbar