"use client";
import { useState, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/streamcore-api";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoItem } from "@/components/video-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { Search, Filter } from "lucide-react";
import AppHeader from "@/components/app-header";

export default function VideosPage() {
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { upload } = useVideoUpload();
  const [inputKey, setInputKey] = useState(0);

  const query = useQuery({
    queryKey: ["videos"],
    queryFn: () => api.videos.getVideos(),
  });

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadOpen(false);
    setInputKey((k) => k + 1);

    upload(file, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["videos"] });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background max-w-7xl mx-auto">
      {/* 1. Global Top Navigation (Mockup Style) */}
      <AppHeader />

      <div className="px-3 py-6">
        {/* 2. Page Title and Upload Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
            <p className="text-muted-foreground">
              Manage your videos, upload, or edit options.
            </p>
          </div>

          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Upload Video</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload a Video</DialogTitle>
                <DialogDescription>
                  Select a video file to upload.
                </DialogDescription>
              </DialogHeader>
              <label className="flex flex-col items-center justify-center h-40 cursor-pointer border-2 border-dashed rounded-xl bg-muted/30 hover:bg-muted/50 transition">
                <Input
                  key={inputKey}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <span className="text-sm font-medium">
                  Click to choose a video
                </span>
              </label>
            </DialogContent>
          </Dialog>
        </div>

        {/* 3. Secondary Search and Filter Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search videos..." />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* 4. Video Grid (Changed to grid-cols-3 to match image) */}
        {query.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        )}

        {query.isError && (
          <div className="p-8 text-center border rounded-xl text-destructive">
            Error loading videos. Please try again.
          </div>
        )}

        {query.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {query.data.map((video) => (
              <VideoItem key={video.videoId} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
