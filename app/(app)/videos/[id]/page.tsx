import VideoDetails from "@/components/videodetail/VideoDetails";

type VideoPageProps = {
  params: { id: string };
};

export default async function VideoPage({ params }: VideoPageProps) {
  const videoPageParams = await params;
  const videoId = videoPageParams?.id;
  return <VideoDetails videoId={videoId} />;
}
