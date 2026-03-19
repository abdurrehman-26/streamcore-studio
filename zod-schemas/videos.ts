import * as z from 'zod'

export const updateVideoformSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long.').max(100, 'Title must be less than 100 characters long.'),
  description: z.string().max(200, 'Description must be less than 200 characters long.'),
})
