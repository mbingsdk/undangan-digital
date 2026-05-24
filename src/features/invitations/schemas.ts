import { z } from "zod";

export const invitationStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const invitationStatusSchema = z.enum(invitationStatuses);

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

export const invitationFormSchema = z.object({
  title: z.string().trim().min(1, "Judul undangan wajib diisi.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug wajib diisi.")
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
    ),
  groomName: z.string().trim().min(1, "Nama mempelai pria wajib diisi.").max(120),
  brideName: z
    .string()
    .trim()
    .min(1, "Nama mempelai wanita wajib diisi.")
    .max(120),
  openingText: optionalTextSchema,
  closingText: optionalTextSchema,
  coverImage: optionalTextSchema,
  musicUrl: optionalTextSchema,
  status: invitationStatusSchema,
});

export type InvitationFormInput = z.infer<typeof invitationFormSchema>;

export type InvitationFormErrors = Partial<
  Record<keyof InvitationFormInput | "form", string[]>
>;

export type InvitationActionState = {
  errors?: InvitationFormErrors;
  values?: Partial<Record<keyof InvitationFormInput, string>>;
};

export function formDataToInvitationInput(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    groomName: formData.get("groomName"),
    brideName: formData.get("brideName"),
    openingText: formData.get("openingText"),
    closingText: formData.get("closingText"),
    coverImage: formData.get("coverImage"),
    musicUrl: formData.get("musicUrl"),
    status: formData.get("status"),
  };
}

export function formDataToInvitationValues(formData: FormData) {
  return Object.fromEntries(
    Object.entries(formDataToInvitationInput(formData)).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Partial<Record<keyof InvitationFormInput, string>>;
}
