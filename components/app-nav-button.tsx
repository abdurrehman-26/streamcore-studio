"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function AppNavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const path = usePathname()
  const isActive = path.includes(href)
  return (
    <li className="flex">
      <Button asChild variant="ghost" className={`w-full mb-2 px-4 py-6 hover:bg-gray-700 hover:text-white ${isActive ? "bg-gray-700" : ""}`}>
          <Link href={href} className="flex gap-1 rounded text-left w-full">
            <span className="flex items-center mr-auto">
              {icon}
              <span className="ml-2">{label}</span>
            </span>
          </Link>
      </Button>
    </li> 
  )
}