import { z } from 'zod';

/**
 * Validation schema for company registration form
 */
export const registrationSchema = z.object({
  organizationNumber: z
    .string()
    .regex(/^\d{9}$/, 'Organisasjonsnummer må være nøyaktig 9 siffer')
    .transform((val) => val.replace(/\s/g, '')), // Remove any spaces

  companyName: z
    .string()
    .min(2, 'Bedriftsnavn er påkrevd')
    .max(200, 'Bedriftsnavn er for langt'),

  reportingContact: z.object({
    name: z
      .string()
      .min(2, 'Navn må være minst 2 tegn')
      .max(100, 'Navn er for langt'),
    email: z
      .string()
      .email('Vennligst oppgi en gyldig e-postadresse')
      .max(100, 'E-postadresse er for lang'),
  }),

  businessContact: z.object({
    name: z
      .string()
      .min(2, 'Navn må være minst 2 tegn')
      .max(100, 'Navn er for langt'),
    email: z
      .string()
      .email('Vennligst oppgi en gyldig e-postadresse')
      .max(100, 'E-postadresse er for lang'),
    phone: z
      .string()
      .regex(
        /^(\+47|0047)?[2-9]\d{7}$/,
        'Vennligst oppgi et gyldig norsk telefonnummer (8 siffer)'
      )
      .transform((val) => val.replace(/^(\+47|0047)/, '')), // Normalize to 8 digits
  }),

  subdomain: z
    .string()
    .min(3, 'Subdomene må være minst 3 tegn')
    .max(63, 'Subdomene kan ikke være lengre enn 63 tegn')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Subdomene kan kun inneholde små bokstaver, tall og bindestreker, og må starte og slutte med en bokstav eller tall'
    )
    .optional()
    .or(z.literal('')),

  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, 'Du må godta vilkårene for bruk'),

  captcha: z.string().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;

/**
 * Validation schema for organization number lookup
 */
export const orgNumberSchema = z
  .string()
  .regex(/^\d{9}$/, 'Organisasjonsnummer må være nøyaktig 9 siffer')
  .transform((val) => val.replace(/\s/g, ''));
