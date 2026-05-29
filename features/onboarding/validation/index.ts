import { z } from 'zod';

export const profileStepSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.').max(100),
  lastName: z.string().trim().min(1, 'Enter your last name.').max(100),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'At least 3 characters.')
    .max(30, 'At most 30 characters.')
    .regex(/^[a-z][a-z0-9_]+$/, 'Start with a letter; letters, numbers and _ only.'),
});

export const aboutStepSchema = z.object({
  dateOfBirth: z.string().min(1, 'Select your birthday.'),
  gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say'], {
    message: 'Select an option.',
  }),
});

export const locationStepSchema = z.object({
  latitude: z.number({ message: 'We need your location to continue.' }),
  longitude: z.number({ message: 'We need your location to continue.' }),
});

export const interestsStepSchema = z.object({
  interestIds: z.array(z.number()).min(1, 'Pick at least one.'),
});

export type ProfileStepInput = z.infer<typeof profileStepSchema>;
export type AboutStepInput = z.infer<typeof aboutStepSchema>;
