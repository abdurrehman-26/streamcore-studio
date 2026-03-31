import { MAX_RETRIES, RETRY_DELAY } from "@/configs/multipart.config"

interface UploadPartJob {
  partNumber: number
  chunk: Blob
  url: string
  status: "pending" | "uploading" | "success" | "error"
  retries: number
  nextRetryTime?: number
  isLocked?: boolean
}
export class UploadPartsQueue {
  private jobs: UploadPartJob[];
  private fatalError: Error | null;
  constructor() {
    this.jobs = [];
    this.fatalError = null;
  }
  async addJob({partNumber, chunk, url}: Omit<UploadPartJob, "status">) {
    this.jobs.push({partNumber, chunk, url, status: "pending", retries: 0})
  }
  hasFatalError() {
    return this.fatalError !== null;
  }
  getFatalError() {
    return this.fatalError;
  }
  async getNextJob() {
    if (this.fatalError) return null;
    const now = Date.now();
    // Prioritize retrying failed jobs that are due for retry
    for (const job of this.jobs) {
      if (job.status === "error" && job.nextRetryTime && job.nextRetryTime <= now && !job.isLocked) {
        job.isLocked = true
        job.status = "uploading"
        return job;
      }
    }
     // Pick pending jobs
    for (const job of this.jobs) {
      if (job.status === "pending" && !job.isLocked) {
        job.isLocked = true
        job.status = "uploading"
        return job
      }
    }
    return null; // No jobs available
  }
  markJobSuccess(partNumber: number) {
    const job = this.jobs.find(j => j.partNumber === partNumber);
    if (job) {
      job.status = "success";
      job.isLocked = false; // Unlock the job
    }
  }
  markJobError(partNumber: number) {
    const job = this.jobs.find(j => j.partNumber === partNumber);
    console.log(`Marking part ${partNumber} as error ${job?.retries || 0} time(s)`);
    if (job) {
      if (job.retries >= MAX_RETRIES) {
        this.fatalError = new Error(`Part ${partNumber} failed after ${MAX_RETRIES} retries.`);
        job.isLocked = true // permanently lock the job since it won't be retried anymore
        return;
      }
      job.status = "error";
      job.isLocked = false; // Unlock the job so it can be retried
      job.retries = (job.retries || 0) + 1;
      job.nextRetryTime = Date.now() + RETRY_DELAY;
    }
  }
  markJobUploading(partNumber: number) {
    const job = this.jobs.find(j => j.partNumber === partNumber);
    if (job) job.status = "uploading";
  }
  isQueueEmpty() {
    return this.jobs.every(job => job.status === "success");
  }
  nextRetryDelay() {
    const now = Date.now();
    const retryJob = this.jobs.filter(job => job.status === "error" && job.nextRetryTime && job.nextRetryTime > now)
    if (retryJob.length === 0) return 0;
    const nextRetryTime = Math.min(...retryJob.map(job => job.nextRetryTime || RETRY_DELAY + now));
    return nextRetryTime - now;
  }
}