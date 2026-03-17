import Link from "next/link";
import { Button } from "./ui/button";

export function AppNavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Button asChild variant="ghost" className="w-full mb-2 px-4 py-6">
      <li>
        <Link href={href} className="flex gap-1 rounded text-left w-full">
          {icon}
          <span className="ml-2">{label}</span>
        </Link>
      </li> 
    </Button>
  )
}