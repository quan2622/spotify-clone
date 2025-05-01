import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignInAuthButton from "./SignInAuthButton";

const Topbar = () => {
  const isAdmin = false;
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
    backdrop-blur-sm z-10">
      <div className="flex gap-2 items-center">
        Spotify
      </div>
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Link to={'/admin'} className="size-4 mr-2">
            Admin DashBoard
          </Link>
        )}

        <SignedIn>
          <SignOutButton />
        </SignedIn>

        <SignedOut>
          <SignInAuthButton />
        </SignedOut>
      </div>
    </div>
  )
}

export default Topbar