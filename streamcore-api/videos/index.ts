import { API_ENDPOINT } from "@/constants/api-endpoint";
import { GetVideoResponse, GetVideosResponse, UpdateVideoResponse, CreatePutUploadResponse } from "@/types/videos";
import { updateVideoformSchema } from "@/zod-schemas/videos";
import * as z from "zod";

export class Videos {
  async getVideos(): Promise<GetVideosResponse> {
    const response = await fetch(`${API_ENDPOINT}/videos/all`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  }
  async getVideo(videoId: string): Promise<GetVideoResponse> {
    const response = await fetch(`${API_ENDPOINT}/videos/${videoId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    return response.json();
  }

  async updateVideo(videoId: string, data: z.infer<typeof updateVideoformSchema>): Promise<UpdateVideoResponse> {
    const response = await fetch(`${API_ENDPOINT}/videos/${videoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update video');
    }
    return response.json();
  }

  async createPutUpload(): Promise<CreatePutUploadResponse> {
    const response = await fetch(`${API_ENDPOINT}/videos/create-put-upload`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }
    return response.json();
  }

  async uploadVideo(
    url: string,
    file: File,
    onProgress: (percent: number) => void
  ): Promise<true> {
      return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open("PUT", url)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(true)
        else reject(new Error("Upload failed"))
      }

      xhr.onerror = () => reject(new Error("Network error during upload"))

      xhr.send(file)
    })
  }

  async createMultipartUpload(): Promise<{uploadId: string; key: string, videoId: string}> {
    const response = await fetch(`${API_ENDPOINT}/videos/create-multipart-upload`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to create multipart upload');
    }
    return response.json();
  }

  async getMultipartUploadUrls(uploadId: string, key: string, partNumbers: number[]): Promise<{ partNumber: number; url: string; }[]> {
    const response = await fetch(`${API_ENDPOINT}/videos/multipart-upload-urls`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        uploadId,
        key,
        partNumbers,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to get multipart upload URLs');
    }
    return response.json();
  }

  async uploadPart(
  url: string,
  blob: Blob,
  onProgress?: (percent: number) => void
  ): Promise<{ ETag: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("PUT", url)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const eTag = xhr.getResponseHeader("ETag")
          resolve({ ETag: eTag || "" })
        } else reject(new Error("Upload failed"))
      }

      xhr.onerror = () => reject(new Error("Network error"))

      xhr.send(blob)
    })
  }

  async completeMultipartUpload(uploadId: string, key: string, parts: {ETag: string, PartNumber: number}[]) {
    const response = await fetch(`${API_ENDPOINT}/videos/complete-multipart-upload`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        uploadId,
        key,
        parts
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to complete Multipart upload');
    }
    return response.json();
  }
}