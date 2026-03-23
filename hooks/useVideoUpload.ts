import { useUploadStore } from "@/store/store"
import { api } from "@/streamcore-api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useVideoUpload() {
  const queryClient = useQueryClient()
  const { setUpload, updateProgress, markSuccess } = useUploadStore()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: presigned URL
      const { url, videoId } = await api.videos.generateUploadUrl()

      // Initialize store entry
      setUpload(videoId, { file, progress: 0, status: "uploading" })

      // Step 2: upload with progress callback
      await api.videos.uploadVideo(url, file, (percent) => {
        updateProgress(videoId, percent)
      })

      // Step 3: mark success
      markSuccess(videoId)
      await queryClient.invalidateQueries({ queryKey: ["videos"] })
    },
  })

  return { upload: mutation.mutate }
}