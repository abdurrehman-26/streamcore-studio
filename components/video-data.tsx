import { formatDate } from "@/lib/format-date";
import { Video } from "@/types/videos";

export default function VideoData({ video }: { video: Video }) {
  return (
    <div>
      <table className="w-full text-sm border-collapse">
        <tbody className="[&_tr]:h-10">
          <tr>
            <td className="w-40 font-semibold text-slate-600">Video ID</td>
            <td className="text-slate-800">{video.videoId}</td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Title</td>
            <td className="text-slate-800">
              {video.title || "Video Title"}
            </td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Description</td>
            <td className="text-slate-800">
              <p className="line-clamp-1 text-slate-700">
                {video.description}
              </p>
            </td>
          </tr>

          <tr>
            <td className="font-semibold text-slate-600">Uploaded On</td>
            <td className="text-slate-800">
              {formatDate(video.createdAt)}
            </td>
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
