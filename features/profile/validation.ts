import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.').max(100),
  lastName: z.string().trim().min(1, 'Enter your last name.').max(100),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'At least 3 characters.')
    .max(30, 'At most 30 characters.')
    .regex(/^[a-z][a-z0-9_]+$/, 'Start with a letter; letters, numbers and _ only.'),
  bio: z.string().trim().max(500, 'At most 500 characters.').optional().or(z.literal('')),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
