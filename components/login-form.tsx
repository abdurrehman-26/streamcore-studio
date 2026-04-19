'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { loginformSchema } from "@/zod-schemas/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof loginformSchema>>({
    resolver: zodResolver(loginformSchema),
  })
  const queryClient = useQueryClient();
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: (data: z.infer<typeof loginformSchema>) => api.auth.login(data),
    onSuccess: (response) => {
      console.log('Login successful', response)
      queryClient.setQueryData(['auth', 'access_token'], response.access_token)
      router.push('/videos')
    },
    onError: (error) => {
      console.error('Login failed', error)
    },
  })
  const handleLogin = (data: z.infer<typeof loginformSchema>) => {
    loginMutation.mutate(data)
  };
  return (
    <form onSubmit={handleSubmit(handleLogin)} className={cn("flex flex-col gap-6 container max-w-3xl", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Sign in to continue to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="bg-background"
            {...register('email', { required: true })}
          />
          {formState.errors.email && <FieldError className="text-xs" errors={[formState.errors.email]} />}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            className="bg-background"
            {...register('password', { required: true })}
          />
          {formState.errors.password && <FieldError errors={[formState.errors.password]} />}
        </Field>
        <Field>
          <Button size="lg" type="submit">Login</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href='/signup' className="underline underline-offset-4 text-primary">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
