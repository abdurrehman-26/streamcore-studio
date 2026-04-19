import { LoginForm } from "@/components/login-form"
import { Play } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="flex flex-col p-6 md:p-10 bg-white items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 font-medium mb-10">
          <div className="flex size-8 items-center justify-center rounded-md bg-green-600 text-white">
            <Play className="size-4" />
          </div>
          <span className="text-lg">
            <span className="text-primary font-bold">StreamCore</span> Studio</span>
        </div>

        {/* Form */}
        <LoginForm />
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={1080}
          height={1080}
          src="/auth-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}