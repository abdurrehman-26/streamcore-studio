import {Check, Clipboard} from "lucide-react"
import { useState } from "react";
export default function CopyButton({copyContent}: {copyContent: string}) {
  const [copied, setCopied] = useState<boolean>(false)
  function onCopyClick() {
    navigator.clipboard.writeText(copyContent)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000);
  }
  if (copied) {
    return <Check className="h-4 w-4 cursor-pointer text-green-500" />
  }
  return <Clipboard onClick={onCopyClick} className="h-4 w-4 text-slate-400 cursor-pointer" />
}