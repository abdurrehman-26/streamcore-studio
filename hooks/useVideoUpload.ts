import { useUploadStore } from "@/store/store"
import { api } from "@/streamcore-api"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

export function useVideoUpload() {
  const [progress, setProgress] = useState(0)
  const { setProgress: setUploadProgress } = useUploadStore()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setProgress(0)

      // Step 1: get presigned URL from your backend
      const { url, videoId } = await api.videos.generateUploadUrl()

      setUploadProgress(videoId, 0)

      // Step 2: upload raw binary with progress
      await api.videos.uploadVideo(url, file, percent => {
        setProgress(percent)
        setUploadProgress(videoId, percent)
      })
    },
  })

  return {
    upload: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error,
    progress,
    resetProgress: () => setProgress(0),
  }
}