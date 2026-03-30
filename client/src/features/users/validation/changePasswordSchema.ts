import { z } from 'zod';
import { passwordSchema, confirmPasswordSchema } from '../../../shared/validation';

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: confirmPasswordSchema
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmNewPassword']
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;