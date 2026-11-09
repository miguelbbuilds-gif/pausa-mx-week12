import { z } from "zod";

export const FEEDBACK_MAX_CHARS = 400;

const emailLike = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

export const feedbackSchema = z
  .object({
    sessionId: z
      .string()
      .regex(
        /^[A-Za-z0-9_-]{16,64}$/,
        "No se pudo preparar el envío en este navegador.",
      ),
    confusingPart: z.string().max(FEEDBACK_MAX_CHARS).optional().default(""),
    wouldReturn: z.enum(["yes", "maybe", "no"]).optional(),
    company: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.company.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company"],
        message: "rejected",
      });
    }
    const comment = data.confusingPart.trim();
    if (emailLike.test(comment)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confusingPart"],
        message: "No incluyas un correo ni otros datos de contacto.",
      });
    }
    if (comment.length === 0 && !data.wouldReturn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confusingPart"],
        message: "Escribe qué confundió o elige si volverías.",
      });
    }
  });

export type FeedbackInput = z.infer<typeof feedbackSchema>;
