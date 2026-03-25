export type GetVideosResponse  = Video[]

export type UpdateVideoResponse = Video

export type Video = {
  videoId: string;
  title: string;
  description: string;
  status: string;
  manifestId: string;
  thumbnailId: string;
  createdAt: string;
};

export type GetVideoResponse = Video

export type CreatePutUploadResponse = {
  url: string;
  videoId: string;
}