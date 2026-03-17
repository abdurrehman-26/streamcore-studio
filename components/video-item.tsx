import { formatDate } from "@/lib/format-date";
import { Video } from "@/types/videos";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVertical } from "lucide-react";

export function VideoItem({ video }: { video: Video }) {
  return (
    <div className="gap-4 border rounded w-60 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="w-full h-40 overflow-hidden">
        <Image width={1920} height={1080} src={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${video.thumbnailId}`} alt="Video Thumbnail" className="rounded" />
      </div>
      <div className="p-2 flex">
        <div className="flex flex-col h-20 flex-1">
          <h3 className="text-lg font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-600 mt-auto">Uploaded at: {formatDate(video.createdAt)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full size-8" variant="ghost"><EllipsisVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}