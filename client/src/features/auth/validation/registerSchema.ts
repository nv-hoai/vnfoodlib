import { z } from 'zod';
import {
  emailSchema, 
  passwordSchema, 
  nameSchema, 
  confirmPasswordSchema,
  acceptTermsSchema
} from '../../../shared/validation';

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  acceptTerms: acceptTermsSchema
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>;
