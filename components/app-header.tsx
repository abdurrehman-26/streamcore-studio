import { Bell, Search, Settings } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AppHeader() {
  return (
    <div className="flex items-center justify-between shadow-sm p-4 sticky top-0 bg-background z-10">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search videos..."
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src="/avatars/user.png" alt="User Avatar" />
          <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
            U
          </AvatarFallback>
          </Avatar>
      </div>
    </div>
  );
}
