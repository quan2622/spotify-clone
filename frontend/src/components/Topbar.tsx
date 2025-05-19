import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignInAuthButton from "./SignInAuthButton";
import { useAuthStore } from "../stores/useAuthStore";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { ChangeEvent } from "react";

type Topbar = {
  query: any,
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void
}

const Topbar = ({ query, handleSearch }: Topbar) => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
    backdrop-blur-sm z-10 rounded-md">
      <div className="flex gap-2 items-center">
        <img src="/spotify.png" alt="logo-spotify" className="size-8" />
        <span className="text-md font-semibold">Spotify</span>
        <div className="ml-3 relative group">
          <input type="text" className="py-2 px-5 pl-[40px] w-[160px] bg-zinc-800 text-white rounded-full
             border-none outline-none ring-0 shadow-none
             focus:outline-none focus:ring-0 focus:shadow-none
             focus:border-none focus:appearance-none
             hover:bg-zinc-700 focus:bg-zinc-700
             group-hover:w-[400px] focus:w-[400px]
             transition-all duration-300 ease-out"
            value={query} placeholder="Search..."
            onChange={handleSearch} />
          <div className="absolute top-2 left-2">
            <Search />
          </div>
        </div>
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