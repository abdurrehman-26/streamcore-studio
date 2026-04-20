import { ChartSpline, Gauge, Settings, Video } from "lucide-react";
import { AppNavButton } from "./app-nav-button";
import Logo from "./Logo";
import { NavUser } from "./Navuser";

export default function AppSidebar() {
  const navItems = [
    { href: "/dashboard", icon: <Gauge />, label: "Dashboard" },
    { href: "/videos", icon: <Video />, label: "Videos" },
    { href: "/analytics", icon: <ChartSpline />, label: "Analytics" },
    { href: "/settings", icon: <Settings />, label: "Settings" },
  ]
  return (
    <div className="flex flex-col w-64 bg-sidebar h-screen fixed p-4">
      <Logo />
      <nav className="flex-1">
        <div>
          {navItems.map((item) => (
            <AppNavButton key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </div>
      </nav>
      <NavUser user={{ name: "John Doe", email: "user1@example.com", avatar: "/avatars/john-doe.png" }} />
    </div>
  )
}