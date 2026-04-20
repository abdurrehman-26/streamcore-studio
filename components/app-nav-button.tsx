"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cloneElement, isValidElement } from "react";

export function AppNavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const path = usePathname()
  const isActive = path.includes(href)
  const styledIcon = isValidElement<{ className?: string }>(icon)
    ? cloneElement(icon, {
        className: `size-4 text-primary ${icon.props.className ?? ""}`.trim(),
      })
    : icon

  return (
    <div className="flex">
      <Button asChild size='lg' variant="ghost" className={`w-full py-5 mb-0.5 hover:bg-primary/20 ${isActive ? "bg-primary/20" : ""}`}>
          <Link href={href} className="flex gap-1 rounded text-left w-full">
            <span className="flex items-center mr-auto">
              {styledIcon}
              <span className="ml-2">{label}</span>
            </span>
          </Link>
      </Button>
    </div>
  )
}
