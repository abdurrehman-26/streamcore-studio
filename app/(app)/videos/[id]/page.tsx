import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VideoDetails from "@/components/videodetail/VideoDetails";
import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";

type VideoPageProps = {
  params: { id: string };
};

export default async function VideoPage({ params }: VideoPageProps) {
  const videoPageParams = await params;
  const videoId = videoPageParams?.id;
  return (
    <div>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background shadow-sm p-4">
        <Link href="/videos" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Back to Videos
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border bg-white shadow-sm"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <VideoDetails videoId={videoId} />
    </div>
  );
}
