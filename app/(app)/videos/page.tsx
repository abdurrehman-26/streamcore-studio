"use client"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoItem } from "@/components/video-item"

export default function VideosPage() {
  const query = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.getVideos(),
  })
  return (
    <div className="p-4">
      <div className="mb-4 bg-accent p-2 rounded">
        <h1 className="text-2xl font-bold">Videos</h1>
        <p className="text-sm text-muted-foreground">
          Manage your videos here. You can view, edit, or delete your videos.
        </p>
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