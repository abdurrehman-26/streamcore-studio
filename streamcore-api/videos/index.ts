import { API_ENDPOINT } from "@/constants/api-endpoint";
import { GetVideoResponse, GetVideosResponse, UpdateVideoResponse, GenerateUploadUrlResponse } from "@/types/videos";
import { updateVideoformSchema } from "@/zod-schemas/videos";
import * as z from "zod";

export class Videos {
  async getVideos(): Promise<GetVideosResponse> {
    const response = await fetch(`${API_ENDPOINT}/video/all`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return response.json();
  }
  async getVideo(videoId: string): Promise<GetVideoResponse> {
    const response = await fetch(`${API_ENDPOINT}/video/${videoId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    return response.json();
  }

  async updateVideo(videoId: string, data: z.infer<typeof updateVideoformSchema>): Promise<UpdateVideoResponse> {
    const response = await fetch(`${API_ENDPOINT}/video/${videoId}`, {
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

  async generateUploadUrl(): Promise<GenerateUploadUrlResponse> {
    const response = await fetch(`${API_ENDPOINT}/video/generate-upload-url`, {
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
}