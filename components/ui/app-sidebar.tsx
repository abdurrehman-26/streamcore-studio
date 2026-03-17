import { Settings2, User, Video } from "lucide-react";
import { AppNavButton } from "../app-nav-button";

export default function AppSidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed p-4">
      <div className="mb-4 p-4">
        <h2 className="text-xl font-bold mb-4">StreamCore Studio</h2>
      </div>
      <nav>
        <ul>
          <AppNavButton href="/videos" icon={<Video />} label="Videos" />
          <AppNavButton href="/profile" icon={<User />} label="Profile" />
          <AppNavButton href="/settings" icon={<Settings2 />} label="Settings" />
        </ul>
      </nav>
    </div>
  )
}