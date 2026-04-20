import React from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: UserProps) {
  return (
    <DropdownMenu>
      {/* The Trigger: The pill-shaped button in the sidebar */}
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-hover hover:bg-sidebar-accent hover:text-sidebar-accent-foreground outline-none">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      {/* The Content: The floating menu */}
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="right"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal text-black">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Sparkles className="mr-2 size-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck className="mr-2 size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="mr-2 size-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem variant="destructive" className="cursor-pointer">
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}