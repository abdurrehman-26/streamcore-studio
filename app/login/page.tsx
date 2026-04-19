"use client"

import { LoginForm } from "@/components/login-form"
import { Play } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      
      {/* LEFT SIDE */}
      <div className="flex flex-col p-6 md:p-10 bg-white">
        
        {/* Logo */}
        <div className="flex items-center gap-2 font-medium mb-10">
          <div className="flex size-8 items-center justify-center rounded-md bg-green-600 text-white">
            <Play className="size-4" />
          </div>
          <span className="text-lg">
            <span className="text-green-600 font-bold">StreamCore</span> Studio</span>
        </div>

        {/* Form */}
        <LoginForm />
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-center justify-center relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-10">
        
        <div className="max-w-md space-y-6">
          
          {/* Heading */}
          <h2 className="text-2xl font-semibold leading-snug">
            Your videos. <br />
            Your audience, <br />
            <span className="text-green-400">One powerful platform.</span>
          </h2>

          {/* Features */}
          <ul className="space-y-3 text-sm text-gray-300">
            <li>✔ Upload & manage videos</li>
            <li>✔ Powerful analytics</li>
            <li>✔ Engage your audience</li>
            <li>✔ Grow your platform</li>
          </ul>

          {/* Mock Card UI */}
          <div className="relative mt-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 shadow-xl border border-white/10">
              <div className="h-32 rounded-lg bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                  ▶
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 bg-white/30 rounded w-3/4"></div>
                <div className="h-2 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}