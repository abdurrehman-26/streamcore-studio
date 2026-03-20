import { api } from "@/streamcore-api"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

export function useVideoUpload() {
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setProgress(0)

      // Step 1: get presigned URL from your backend
      const { url } = await api.videos.generateUploadUrl()

      // Step 2: upload raw binary with progress
      await api.videos.uploadVideo(url, file, percent => {
        setProgress(percent)
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