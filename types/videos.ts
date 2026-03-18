export type GetVideosResponse  = Video[]

export type Video = {
  videoId: string;
  title: string;
  description: string;
  status: string;
  url: string;
  thumbnailId: string;
  createdAt: string;
};

export type GetVideoResponse = Video