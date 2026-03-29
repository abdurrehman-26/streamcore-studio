import { formatDate } from "@/lib/format-date";
import { Video } from "@/types/videos";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useUploadStore } from "@/store/store";

export function VideoItem({ video }: { video: Video }) {
  const { uploads } = useUploadStore();
  const progress = uploads[video.videoId]?.progress;

  const isUploading = video.status === "uploading";
  const isProcessing = video.status === "processing";
  const isReady = video.status === "ready";

  const videoOptions = [
    { label: "View", icon: <Eye className="size-4 mr-2" /> },
    { label: "Edit", icon: <Pencil className="size-4 mr-2" /> },
    { label: "Delete", icon: <Trash className="size-4 mr-2" />, variant: "destructive" },
  ];

  return (
    <div className="w-58 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      {/* Thumbnail */}
      <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
        {isReady ? (
          <Image
            width={1920}
            height={1080}
            src={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${video.thumbnailId}`}
            alt="Video Thumbnail"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
            {isUploading
              ? `Uploading... ${progress ?? 0}%`
              : isProcessing
              ? "Processing..."
              : "Pending..."}
          </div>
        )}

        {/* Upload progress bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full bg-blue-100 h-1">
            <div
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progress ?? 0}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex">
        <div className="flex flex-col flex-1 min-w-0">
          <Link
            href={`/videos/${video.videoId}`}
            className="font-semibold text-sm line-clamp-2 hover:text-gray-600 transition-colors"
          >
            {video.title}
          </Link>

          {isUploading && (
            <span className="text-xs text-blue-600 mt-1">
              Uploading… {progress ?? 0}%
            </span>
          )}

          <p className="text-xs text-muted-foreground mt-auto pt-1">
            Uploaded at {formatDate(video.createdAt)}
          </p>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full size-8 ml-1 hover:bg-blue-50 text-muted-foreground cursor-pointer"
            >
              <EllipsisVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-50">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="select-none">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {videoOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  className="cursor-pointer"
                  {...(option.variant === "destructive" && {
                    variant: option.variant,
                  })}
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}