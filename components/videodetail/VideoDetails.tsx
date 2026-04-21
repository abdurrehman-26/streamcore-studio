"use client";
import { useEffect, useState } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/streamcore-api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateVideoformSchema } from "@/zod-schemas/videos";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";
import VideoData from "../video-data";

export default function VideoDetails({ videoId }: { videoId: string }) {
  const query = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => api.videos.getVideo(videoId),
    enabled: Boolean(videoId),
  });

  const { reset } = useForm<z.infer<typeof updateVideoformSchema>>({
    resolver: zodResolver(updateVideoformSchema),
  });

  useEffect(() => {
    if (query.data) {
      reset({ title: query.data.title, description: query.data.description });
    }
  }, [query.data, reset]);

  const [activeTab, setActiveTab] = useState("Analytics");

  if (query.isLoading || !query.data) return <LoadingSkeleton />;

  return (
    <div className="px-6 py-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-xl border bg-black shadow-sm max-w-4xl">
            <MediaPlayer
              title={query.data?.title}
              src={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${query.data?.manifestId}`}
              className="aspect-video"
            >
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          </div>
          <VideoData video={query.data} />
        </div>

        <div className="flex items-center gap-8 border-b border-slate-200 px-2">
          {["Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-semibold transition-colors relative",
                activeTab === tab
                  ? "text-emerald-600"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 h-0.75 w-full rounded-t-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {/* Performance Section */}
        {activeTab === "Analytics" && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Performance</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Watch Time (hours)"
                value="284.6"
                trend="+12.5%"
              />
              <StatCard
                label="Average View Duration"
                value="5:32"
                trend="+0.4s"
              />
              <StatCard label="Click Through Rate" value="8.4%" trend="+1.2%" />
              <StatCard
                label="Audience Retention"
                value="62.3%"
                trend="+5.1%"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-1 text-xs font-bold text-emerald-500">
          {trend}{" "}
          <span className="font-medium text-slate-400">in previous 7 days</span>
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-3xl" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-125 rounded-3xl" />
      </div>
    </div>
  );
}
