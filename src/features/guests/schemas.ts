import { z } from "zod";

const optionalTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .optional();

export const guestFormSchema = z.object({
  name: z.string().trim().min(1, "Nama tamu wajib diisi.").max(100),
  phone: optionalTextSchema(30),
  maxGuest: z.coerce
    .number({
      message: "Maksimal tamu wajib berupa angka.",
    })
    .int("Maksimal tamu wajib berupa angka bulat.")
    .min(1, "Maksimal tamu minimal 1.")
    .max(10, "Maksimal tamu maksimal 10."),
  notes: optionalTextSchema(300),
});

export type GuestFormInput = z.infer<typeof guestFormSchema>;
export type GuestFormValues = Record<keyof z.input<typeof guestFormSchema>, string>;

export type GuestActionState = {
  errors?: Partial<Record<keyof GuestFormValues | "form", string[]>>;
  values?: Partial<GuestFormValues>;
};

export function formDataToGuestInput(formData: FormData) {
  return {
    name: formData.get("name"),
    phone: formData.get("phone"),
    maxGuest: formData.get("maxGuest"),
    notes: formData.get("notes"),
  };
}

export function formDataToGuestValues(formData: FormData) {
  return Object.fromEntries(
    Object.entries(formDataToGuestInput(formData)).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Partial<GuestFormValues>;
}
