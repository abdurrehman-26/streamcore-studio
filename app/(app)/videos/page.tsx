"use client"
import { useState, type ChangeEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoItem } from "@/components/video-item"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useVideoUpload } from "@/hooks/useVideoUpload"

export default function VideosPage() {
  const queryClient = useQueryClient()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const { upload } = useVideoUpload()
  const [inputKey, setInputKey] = useState(0)

  const query = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.getVideos(),
  })

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadOpen(false)
    setInputKey(k => k + 1)

    upload(file, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["videos"] })
      },
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-4 bg-accent rounded-lg border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Videos</h1>
          <p className="text-sm text-muted-foreground">
            Manage your videos. Upload, preview, or delete anytime.
          </p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="px-5">Upload Video</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Upload a Video</DialogTitle>
              <DialogDescription>
                Select a video file to upload. We’ll handle everything securely.
              </DialogDescription>
            </DialogHeader>

            {/* Upload Zone */}
            <label className="flex flex-col items-center justify-center h-36 cursor-pointer border-2 border-dashed border-muted-foreground/40 bg-muted/40 rounded-lg transition hover:border-muted-foreground px-4 mt-2">
              <Input
                key={inputKey}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              <span className="text-sm font-medium">Click to choose a video</span>
              <span className="text-xs text-muted-foreground mt-1">
                MP4, MOV, MKV supported
              </span>
            </label>

          </DialogContent>
        </Dialog>
      </div>

      {/* Loading Skeleton */}
      {query.isLoading && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="text-red-500 text-sm">Error loading videos.</div>
      )}

      {/* Videos */}
      {query.data && (
        <ul className="grid grid-cols-4 gap-4">
          {query.data.map((video) => (
            <VideoItem key={video.videoId} video={video} />
          ))}
        </ul>
      )}
    </div>
  )
}
