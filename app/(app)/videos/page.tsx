"use client"
import { useState, type ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoItem } from "@/components/video-item"
import { Button } from "@/components/ui/button"
import { API_ENDPOINT } from "@/constants/api-endpoint"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function VideosPage() {
  const queryClient = useQueryClient()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const query = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.getVideos(),
  })
  // This implementation of upload is just for demonstration purposes and is not working. we will implement it in the next steps.
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const presignResponse = await fetch(`${API_ENDPOINT}/video/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      })

      if (!presignResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl } = await presignResponse.json() as { uploadUrl: string }

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] })
      setIsUploadOpen(false)
      setSelectedFile(null)
    },
  })

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    uploadMutation.mutate(file)
    event.target.value = ''
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
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploadMutation.isPending}
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
            {uploadMutation.isPending && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
            {uploadMutation.isError && (
              <p className="text-sm text-destructive">
                {(uploadMutation.error as Error).message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  if (uploadMutation.isPending) return
                  setSelectedFile(null)
                  setIsUploadOpen(false)
                }}
                disabled={uploadMutation.isPending}
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
