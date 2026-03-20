"use client"
import { useEffect, useMemo, useState } from "react"
import "@vidstack/react/player/styles/default/theme.css"
import "@vidstack/react/player/styles/default/layouts/video.css"
import { MediaPlayer, MediaProvider } from "@vidstack/react"
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/format-date"
import Image from "next/image"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import z from "zod"
import { updateVideoformSchema } from "@/zod-schemas/videos"
import { zodResolver } from "@hookform/resolvers/zod"

export default function VideoDetails({ videoId }: { videoId: string }) {
  const query = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => api.videos.getVideo(videoId),
    enabled: Boolean(videoId),
  })

  const {register, handleSubmit, reset} = useForm<z.infer<typeof updateVideoformSchema>>({
    resolver: zodResolver(updateVideoformSchema),
  })

  useEffect(() => {
  if (query.data) {
    reset({
      title: query.data.title,
      description: query.data.description
    });
  }
}, [query.data, reset]);

  const [editableField, setEditableField] = useState<"title" | "description" | null>(null)

  const thumbnailUrl = useMemo(() => {
    if (!query.data) return ""
    return `${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${query.data.thumbnailId}`
  }, [query.data])

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof updateVideoformSchema>) => api.videos.updateVideo(videoId, data),
    onSuccess: () => {
      query.refetch()
      setEditableField(null)
    },
    onError: () => {
      //TODO Handle error (e.g., show a notification)
    },
  })

  const handleUpdate = (data: z.infer<typeof updateVideoformSchema>) => {
    updateMutation.mutate(data)
  }

  const renderLeftPanel = () => {
    if (query.isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )
    }

    if (query.isError || !query.data) {
      return (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          Could not load this video. Please try again.
        </div>
      )
    }

    const isTitleLocked = editableField !== "title"
    const isDescriptionLocked = editableField !== "description"

    return (
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border bg-muted/40 shadow-sm">
          <MediaPlayer title={query.data.title} src={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${query.data.manifestId}`} poster={thumbnailUrl} className="aspect-video">
            <MediaProvider />
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
            />
          </MediaPlayer>
        </div>

        <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Video Details</h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleUpdate)}>
            <Field>
              <FieldLabel className="cursor-pointer" onClick={() => setEditableField("title")}>Title</FieldLabel>
              <FieldContent className="gap-2">
                <Input
                  readOnly={isTitleLocked}
                  onClick={() => setEditableField("title")}
                  {...register("title")}
                  className={cn(
                    "text-lg font-semibold", 
                    isTitleLocked && "cursor-pointer border-dashed bg-muted/40"
                  )}
                />
                <FieldDescription>Click to edit the title</FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="cursor-pointer" onClick={() => setEditableField("description")}>Description</FieldLabel>
              <FieldContent className="gap-2">
                <textarea
                  readOnly={isDescriptionLocked}
                  onClick={() => setEditableField("description")}
                  {...register("description")}
                  className={cn(
                    "min-h-28 w-full rounded-lg border bg-transparent p-3 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
                    isDescriptionLocked && "cursor-pointer border-dashed bg-muted/40"
                  )}
                />
                <FieldDescription>Tap to make quick edits</FieldDescription>
              </FieldContent>
            </Field>

            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditableField(null)} disabled={updateMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} size="sm">
                {updateMutation.isPending ? "Saving..." : "Update details"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderMetaPanel = () => {
    if (query.isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      )
    }

    if (!query.data) return null

    return (
      <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Meta</p>
            <h2 className="text-lg font-semibold">Quick facts</h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
            {query.data.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <MetaRow label="Video ID" value={`${query.data.videoId}`} />
          <MetaRow label="Uploaded" value={formatDate(query.data.createdAt)} />
          <MetaRow label="Source" value={`${process.env.NEXT_PUBLIC_S3_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/${query.data.manifestId}`} isLink />
          <MetaRow label="Thumbnail" value={thumbnailUrl} isLink />
        </div>

        {thumbnailUrl && (
          <div className="overflow-hidden rounded-xl border bg-muted/40">
            <Image
              src={thumbnailUrl}
              alt={query.data.title}
              width={640}
              height={360}
              className="h-52 w-full object-cover"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 rounded-2xl border bg-accent/40 p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Video Details</h1>
        <p className="text-sm text-muted-foreground">Review, preview, and update this video at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="min-w-0">{renderLeftPanel()}</div>
        <div className="min-w-0">{renderMetaPanel()}</div>
      </div>
    </div>
  )
}

function MetaRow({
  label,
  value,
  isLink,
}: {
  label: string
  value: string
  isLink?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-dashed border-muted px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      {isLink ? (
        <a className="truncate text-sm font-medium text-primary hover:underline" href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <span className="truncate text-sm font-medium">{value}</span>
      )}
    </div>
  )
}
