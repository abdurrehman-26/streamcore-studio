import { Video } from "lucide-react";
import { AppNavButton } from "../app-nav-button";

export default function AppSidebar() {
  const navItems = [
    { href: "/videos", icon: <Video />, label: "Videos" },
  ]
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed p-4">
      <div className="mb-4 p-4 select-none">
        <h2 className="text-xl font-bold mb-4">StreamCore Studio</h2>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <AppNavButton key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </ul>
      </nav>
    </div>
  )
}