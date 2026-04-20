import { Play } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-medium mb-10 select-none cursor-default">
      <div className="flex size-8 items-center justify-center rounded-md bg-green-600 text-white">
        <Play className="size-4" />
      </div>
      <span className="text-lg">
        <span className="text-primary font-bold">StreamCore</span> Studio
      </span>
    </div>
  );
}
