import { MAX_CONCURRENT_UPLOADS } from "@/configs/multipart.config"
import { initMultipartUpload } from "@/lib/multipart-initializer"
import { createUploadWorker } from "@/lib/multipart-worker.ts"
import { useUploadStore } from "@/store/store"
import { api } from "@/streamcore-api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useVideoUpload() {
  const queryClient = useQueryClient()
  const { setUpload, updateProgress, markSuccess, markError } = useUploadStore()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // This array will hold the ETag and PartNumber for each successfully uploaded part, which we need to complete the multipart upload later
      let uploadedParts: Map<number, { ETag: string; PartNumber: number }> = new Map();
      // This object tracks how many bytes each part has successfully sent
      const partProgressMap: Map<number, number> = new Map();
      // create multipart upload
      const { uploadId, key, videoId, uploadQueue } = await initMultipartUpload(file)
      // invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["videos"] })
      const updateGlobalProgress = () => {
        // Sum up all bytes currently recorded in our map
        const totalBytesSent = Array.from(partProgressMap.values()).reduce((a, b) => a + b, 0);
        const overallPercent = Math.min(Math.round((totalBytesSent / file.size) * 100), 99); // Cap at 99 until completion
        updateProgress(videoId, overallPercent);
      };
      // Initialize store entry
      setUpload(videoId, { file, progress: 0, status: "uploading" })
      try {
        // Start workers
        const workers = [];
        for (let i = 0; i < MAX_CONCURRENT_UPLOADS; i++) {
          workers.push(createUploadWorker({
            uploadQueue,
            uploadedParts,
            partProgressMap,
            updateGlobalProgress,
          })());
        }
        await Promise.all(workers);
        // After all workers are done, we should have all parts either successfully uploaded or failed after retries. We can now complete the multipart upload.
        uploadedParts = new Map([...uploadedParts.entries()].sort((a, b) => a[0] - b[0]));
        await api.videos.completeMultipartUpload(uploadId, key, Array.from(uploadedParts.values()));
        // mark success
        markSuccess(videoId)
        await queryClient.invalidateQueries({ queryKey: ["videos"] })
      } catch (error) {
        markError(videoId, error instanceof Error ? error.message : "Unknown error");
      }
    },
  })

  return { upload: mutation.mutate }
}