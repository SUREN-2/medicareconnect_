import { z } from "zod";


export const uuidSchema = z.string().uuid("Invalid UUID");


export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100);


export const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .trim();

export const nameSchema = z
  .string()
  .min(2, "Name too short")
  .max(50, "Name too long")
  .trim();



export const notificationSchema = z.object({
  schedule_time: z
    .string()
    .min(1, "Schedule time is required")
    .transform((val) => val.slice(0, 5)) 
    .refine(
      (val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
      "Invalid time format (HH:MM)"
    ),

  remainder_hours: z
    .number()
    .min(0, "Cannot be negative")
    .max(72, "Max 72 hours"),

  email: emailSchema,

  email_subject: z
    .string()
    .min(3, "Subject too short")
    .max(100),

  email_body: z
    .string()
    .min(10, "Body must be at least 10 characters"),

  reminder_enabled: z.boolean().default(false),
});


export const takeMedicationSchema = z.object({
  patientId: z.string().uuid(),
  medicationId: z.string().uuid(),

  photoUrl: z
    .string()
    .url("Invalid photo URL")
    .optional()
    .refine((url) => {
      if (!url) return true;

     
      return (
        url.startsWith("https://") &&
        (
          url.includes("supabase.co") ||
          url.includes("yourdomain.com")
        )
      );
    }, "Untrusted image source"),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});



export const createPatientSchema = z.object({
  name: nameSchema,
  age: z.number().int().min(0, "Invalid age").max(120, "Invalid age"),
});

export const updatePatientSchema = z.object({
  id: uuidSchema,
  name: nameSchema.optional(),
  age: z.number().int().min(0).max(120).optional(),
});



export const assignCaretakerSchema = z.object({
  caretakerId: uuidSchema,
  patientId: uuidSchema,
});

export const listCaretakerSchema = z.object({
  patientId: uuidSchema,
});



export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    throw new Error(JSON.stringify(errors));
  }

  return result.data;
};
