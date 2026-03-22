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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // TODO: we can get rid of this local state and directly use the upload progress from the store in the VideoItem component
  const { upload, progress, isUploading, error, resetProgress } = useVideoUpload()
  const [inputKey, setInputKey] = useState(0)

  const query = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.getVideos(),
  })

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    upload(file, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["videos"] })
        setIsUploadOpen(false)
        setInputKey(k => k + 1)
        resetProgress()
      },
    })
  }

  return (
    <div className="p-4">
      <div className="mb-4 bg-accent p-3 rounded flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Videos</h1>
          <p className="text-sm text-muted-foreground">
            Manage your videos here. You can view, edit, or delete your videos.
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>Upload Video</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload video</DialogTitle>
              <DialogDescription>
                Choose a file to upload. We&apos;ll request a secure upload URL and start the transfer.
              </DialogDescription>
            </DialogHeader>

            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-muted/40 text-center transition hover:border-muted-foreground/70">
              <Input
                key={inputKey}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <span className="text-sm font-medium">
                Click to select a video file
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                MP4, MOV, MKV and more are supported.
              </span>
            </label>

            {selectedFile && (
              <p className="text-sm text-foreground">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
            {isUploading && (
              <p className="text-sm text-muted-foreground">Uploading {progress}%</p>
            )}
            {error && (
              <p className="text-sm text-destructive">
                {(error as Error).message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  if (isUploading) return
                  setSelectedFile(null)
                  setIsUploadOpen(false)
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {query.isLoading && (
        Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-65 w-60 mb-2" />
        ))
      )}
      {query.isError && <p>Error occurred while fetching videos.</p>}
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
