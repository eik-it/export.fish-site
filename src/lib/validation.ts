import { z } from 'zod';

/**
 * Validation schema for company registration form
 */
export const registrationSchema = z.object({
  organizationNumber: z
    .string()
    .regex(/^\d{9}$/, 'Organization number must be exactly 9 digits')
    .transform((val) => val.replace(/\s/g, '')), // Remove any spaces

  companyName: z
    .string()
    .min(2, 'Company name is required')
    .max(200, 'Company name is too long'),

  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name is too long'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email is too long'),

  phone: z
    .string()
    .regex(
      /^(\+47|0047)?[2-9]\d{7}$/,
      'Please enter a valid Norwegian phone number (8 digits)'
    )
    .transform((val) => val.replace(/^(\+47|0047)/, '')), // Normalize to 8 digits

  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms of service'),

  turnstileToken: z.string().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;

/**
 * Validation schema for organization number lookup
 */
export const orgNumberSchema = z
  .string()
  .regex(/^\d{9}$/, 'Organization number must be exactly 9 digits')
  .transform((val) => val.replace(/\s/g, ''));
