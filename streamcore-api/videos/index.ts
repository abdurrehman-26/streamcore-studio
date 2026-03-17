import { API_ENDPOINT } from "@/constants/api-endpoint";
import { GetVideosResponse } from "@/types/videos";

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
}