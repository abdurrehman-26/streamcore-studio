import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Video } from "@/types/videos";
import { Check, Copy, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VideoData({ video }: { video: Video }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(video.description || "");
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!descriptionRef.current) return;

    const el = descriptionRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [description, editingDescription]);

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [editingDescription]);

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus();
    }
  }, [editingTitle]);

  return (
    <div className="pt-2">
      <table className="w-full text-sm border-collapse">
        <tbody className="[&_tr]:h-10 [&_td]:align-top">
          <tr>
            <td className="w-40 font-semibold text-slate-800">Video ID</td>
            <td className="text-slate-800">{video.videoId}</td>
            <td className="px-3">
              <Copy className="h-4 w-4 text-slate-400" />
            </td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Title</td>
            <td className="text-slate-800">
              <input
                type="text"
                autoFocus
                ref={titleRef}
                placeholder="Add a title"
                {...(!editingTitle && { disabled: true })}
                defaultValue={video.title}
                onBlur={() => setEditingTitle(false)}
                className={cn(
                  "w-full py-1 text-sm focus:outline-none border-b transition-colors duration-300",
                  editingTitle ? "border-primary" : "border-transparent",
                )}
              />
            </td>
            <td className="px-3">
              {editingTitle ? (
                <Check
                  onClick={() => setEditingTitle(false)}
                  className="h-4 w-4 text-slate-400"
                />
              ) : (
                <Pencil
                  onClick={() => setEditingTitle(true)}
                  className="h-4 w-4 text-slate-400"
                />
              )}
            </td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Description</td>
            <td className="text-slate-800">
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.replace(/\r?\n|\r/g, ""))
                }
                rows={1}
                autoFocus={editingDescription}
                disabled={!editingDescription}
                placeholder="Add a description..."
                onBlur={() => setEditingDescription(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingDescription(false);
                  }
                }}
                className={cn(
                  "w-full py-1 text-sm focus:outline-none border-b transition-all duration-200 resize-none overflow-hidden",
                  "placeholder:text-slate-400",
                  editingDescription ? "border-primary" : "border-transparent",
                )}
              />
            </td>
            <td className="px-3">
              {editingDescription ? (
                <Check
                  onClick={() => setEditingDescription(false)}
                  className="h-4 w-4 text-slate-400"
                />
              ) : (
                <Pencil
                  onClick={() => setEditingDescription(true)}
                  className="h-4 w-4 text-slate-400"
                />
              )}
            </td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Uploaded On</td>
            <td className="text-slate-800">{formatDate(video.createdAt)}</td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Status</td>
            <td>
              <span className="text-primary">
                {video.status.replace(/^./g, (char) => char.toUpperCase())}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
