import Image from "next/image";
import Link from "next/link";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react";

import { formatDate } from "@/lib/format-date";
import { Video } from "@/types/videos";
import { useUploadStore } from "@/store/store";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function VideoItem({ video }: { video: Video }) {
  const { uploads } = useUploadStore();
  
  const uploadState = uploads[video.videoId];
  const progress = uploadState?.progress ?? 0;
  const isUploading = uploadState?.status === "uploading";
  const isFailed = uploadState?.status === "error";
  
  const isReady = video.status === "ready";
  const isProcessing = video.status === "processing";

  return (
    <div className="w-full max-w-70 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail Container: Forced 16:9 Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-muted cursor-default">
        {isReady ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${video.thumbnailId}`}
            alt={video.title}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground">
            {isUploading ? `Uploading ${progress}%` : 
             isFailed ? "Upload Failed" : 
             isProcessing ? "Processing..." : "Queued..."}
          </div>
        )}

        {/* Timestamp Overlay */}
        {isReady && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
            9:15
          </span>
        )}

        {/* Minimalist Progress Bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-secondary">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex p-3 gap-2">
        <div className="flex flex-1 flex-col min-w-0">
          <Link
            href={`/videos/${video.videoId}`}
            className="truncate text-sm font-semibold leading-none hover:text-primary transition-colors"
          >
            {video.title}
          </Link>

          <div className="mt-1.5 flex flex-col gap-0.5">
            {isUploading && (
              <span className="text-[11px] font-medium text-blue-600">Uploading...</span>
            )}
            {isFailed && (
              <span className="text-[11px] font-medium text-destructive">Upload failed</span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {formatDate(video.createdAt)}
            </span>
          </div>
        </div>

        <VideoActionsMenu />
      </div>
    </div>
  );
}

function VideoActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}