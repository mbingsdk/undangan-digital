import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Masukkan email admin yang valid.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password wajib diisi."),
});
