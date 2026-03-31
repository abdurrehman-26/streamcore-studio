import { api } from "@/streamcore-api";
import { UploadPartsQueue } from "@/lib/upload-queue";

export function createUploadWorker({
  uploadQueue,
  uploadedParts,
  partProgressMap,
  updateGlobalProgress,
}: {
  uploadQueue: UploadPartsQueue;
  uploadedParts: Map<number, { ETag: string; PartNumber: number }>;
  partProgressMap: Map<number, number>;
  updateGlobalProgress: () => void;
}) {
  return async function worker() {
    while (!uploadQueue.isQueueEmpty()) {
      if (uploadQueue.hasFatalError()) {
        throw uploadQueue.getFatalError()!;
      }
      const job = await uploadQueue.getNextJob();
      if (!job) {
        const nextRetry = uploadQueue.nextRetryDelay();
        await new Promise((resolve) => setTimeout(resolve, nextRetry));
        continue;
      }
      try {
        const { ETag } = await api.videos.uploadPart(
          job.url,
          job.chunk,
          (percent) => {
            const bytesSent = (percent / 100) * job.chunk.size;
            partProgressMap.set(job.partNumber, Math.max(partProgressMap.get(job.partNumber) || 0, bytesSent));
            updateGlobalProgress();
          }
        );

        uploadedParts.set(job.partNumber, {
          ETag,
          PartNumber: job.partNumber,
        });

        uploadQueue.markJobSuccess(job.partNumber);
      } catch {
        uploadQueue.markJobError(job.partNumber);
      }
    }
  };
}