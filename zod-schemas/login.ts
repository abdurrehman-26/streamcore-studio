import * as z from 'zod'

export const loginformSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
})
