import { z } from 'zod';
import { emailSchema, nameSchema } from '../../../shared/validation';

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional()
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;