import * as z from 'zod'

export const signupformSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(32, "Name must be at most 32 characters."),
  email: z
    .email('Must be a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
}).refine((data) => 
  data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ["confirmPassword"]
  }
)