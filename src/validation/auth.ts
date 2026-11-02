import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z
    .string({ required_error: "Escribe tu correo." })
    .trim()
    .min(1, { message: "Escribe tu correo." })
    .email({ message: "Escribe un correo válido." })
    .max(254, { message: "El correo es demasiado largo." }),
  password: z
    .string({ required_error: "Escribe una contraseña." })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(72, { message: "La contraseña es demasiado larga." }),
});

export const signUpFormSchema = authCredentialsSchema
  .extend({
    confirmPassword: z
      .string({ required_error: "Confirma la contraseña." })
      .min(1, { message: "Confirma la contraseña." }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden.",
      });
    }
  });

export type AuthCredentials = z.output<typeof authCredentialsSchema>;
