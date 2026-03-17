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
import { signupformSchema } from "@/zod-schemas/signup"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/streamcore-api"
import { useRouter } from "next/navigation"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof signupformSchema>>({
    resolver: zodResolver(signupformSchema),
  })
  const router = useRouter()
  const signupMutation = useMutation({
    mutationFn: api.auth.signup,
    onSuccess: (data) => {
      console.log('Signup Success', data)
      if (data._id) {
        router.push('/profile')
      }
    }  
  })
  const handleSignup = (data: z.infer<typeof signupformSchema>) => {
    signupMutation.mutate(data)
  }
  return (
    <form onSubmit={handleSubmit(handleSignup)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="bg-background"
            {...register('name', {required: true})}
          />
          {formState.errors.name && <FieldError errors={[formState.errors.name]} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            placeholder="Enter your email"
            className="bg-background"
            {...register('email', {required: true})}
          />
          {formState.errors.email && <FieldError errors={[formState.errors.email]} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            className="bg-background"
            placeholder="Enter password"
            {...register('password', {required: true})}
          />
          {formState.errors.password && <FieldError errors={[formState.errors.password]} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            className="bg-background"
            placeholder="Re-enter password"
            {...register('confirmPassword')}
          />
          {formState.errors.confirmPassword && <FieldError errors={[formState.errors.confirmPassword]} />}
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
