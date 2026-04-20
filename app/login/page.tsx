import { LoginForm } from "@/components/login-form"
import Logo from "@/components/Logo"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="flex flex-col p-6 md:p-10 bg-white items-center">
        
        {/* Logo */}
        <Logo />

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