import { API_ENDPOINT } from "@/constants/api-endpoint";
import { GetVideoResponse, GetVideosResponse } from "@/types/videos";

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
}