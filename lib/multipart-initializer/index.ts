// multipart-initializer.ts
import { api } from "@/streamcore-api";
import { UploadPartsQueue } from "@/lib/upload-queue";
import { PART_SIZE } from "@/configs/multipart.config";

export async function initMultipartUpload(file: File) {
  const totalParts = Math.ceil(file.size / PART_SIZE);

  const { uploadId, key, videoId } =
    await api.videos.createMultipartUpload();

  const urlsRes = await api.videos.getMultipartUploadUrls(
    uploadId,
    key,
    Array.from({ length: totalParts }, (_, i) => i + 1)
  );

  const uploadQueue = new UploadPartsQueue();

  for (let p = 1; p <= totalParts; p++) {
    uploadQueue.addJob({
      partNumber: p,
      chunk: file.slice(
        (p - 1) * PART_SIZE,
        Math.min(p * PART_SIZE, file.size),
      ),
      url: urlsRes[p - 1].url,
      retries: 0,
    });
  }

  return {
    uploadId,
    key,
    videoId,
    totalParts,
    uploadQueue,
  };
}