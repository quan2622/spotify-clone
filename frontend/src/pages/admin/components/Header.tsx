import { Link } from "react-router-dom"
import { UserButton } from "@clerk/clerk-react"

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3 mb-8">
        <Link to={'/'} className="rounded-lg">
          <img src="spotify.png" alt="logo-admin" className="size-10" />
        </Link>
        <div>
          <h1 className="font-bold text-2xl">Music Manager</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your music catalog</p>
        </div>
      </div>
      <div className="mb-10">
        <UserButton />
      </div>
    </div>
  )
}
export default Header