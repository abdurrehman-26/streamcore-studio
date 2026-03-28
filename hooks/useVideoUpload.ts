import { useUploadStore } from "@/store/store"
import { api } from "@/streamcore-api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useVideoUpload() {
  const queryClient = useQueryClient()
  const { setUpload, updateProgress, markSuccess } = useUploadStore()

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const BATCH_SIZE = 10;
      const PART_SIZE = 8 * 1024 * 1024;
      const totalParts = Math.ceil(file.size / PART_SIZE);
      let uploadedParts: {ETag: string, PartNumber: number}[] = [];
      // This object tracks how many bytes each part has successfully sent
      const partProgressMap: Record<number, number> = {};
      // create multipart upload
      const { uploadId, key, videoId } = await api.videos.createMultipartUpload()
      const updateGlobalProgress = () => {
        // Sum up all bytes currently recorded in our map
        const totalBytesSent = Object.values(partProgressMap).reduce((a, b) => a + b, 0);
        const overallPercent = Math.min(Math.round((totalBytesSent / file.size) * 100), 99); // Cap at 99 until completion
        updateProgress(videoId, overallPercent);
      };
      // Initialize store entry
      setUpload(videoId, { file, progress: 0, status: "uploading" })
      for (let start = 1; start <= totalParts; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, totalParts);
        const partNumbers = [];
        for (let p = start; p <= end; p++) partNumbers.push(p);
        const urlsRes = await api.videos.getMultipartUploadUrls(uploadId, key, partNumbers)
        await Promise.all(urlsRes.map(async (urlRes) => {
          const partNumber = urlRes.partNumber;
          const startByte = (partNumber - 1) * PART_SIZE;
          const endByte = Math.min(startByte + PART_SIZE, file.size);
          const chunk = file.slice(startByte, endByte);
          const { ETag } = await api.videos.uploadPart(urlRes.url, chunk, (percent) => {
            const bytesSentForThisPart = (percent / 100) * chunk.size;
            partProgressMap[partNumber] = bytesSentForThisPart;
            updateGlobalProgress();
          });
          uploadedParts.push({ETag, PartNumber: urlRes.partNumber})
        }))
      }
      uploadedParts = uploadedParts.sort((a,b) => a.PartNumber - b.PartNumber)
      await api.videos.completeMultipartUpload(uploadId, key, uploadedParts)
      // mark success
      markSuccess(videoId)
      await queryClient.invalidateQueries({ queryKey: ["videos"] })
    },
  })

  return { upload: mutation.mutate }
}