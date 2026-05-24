import { z } from "zod";

export const invitationStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const invitationStatusSchema = z.enum(invitationStatuses);

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

const optionalUrlPathSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      if (value.startsWith("/") && !value.includes(" ")) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message: "Isi URL valid atau path lokal seperti /uploads/file.webp.",
    },
  );

const requiredUrlPathSchema = z
  .string()
  .trim()
  .min(1, "Image URL wajib diisi.")
  .refine(
    (value) => {
      if (value.startsWith("/") && !value.includes(" ")) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message: "Isi URL valid atau path lokal seperti /uploads/file.webp.",
    },
  );

const sortOrderSchema = z.coerce
  .number({
    message: "Sort order wajib berupa angka.",
  })
  .int("Sort order wajib berupa angka bulat.")
  .min(0, "Sort order minimal 0.");

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam harus HH:MM.");

const optionalTimeSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional()
  .refine((value) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), {
    message: "Format jam harus HH:MM.",
  });

const dateSchema = z
  .string()
  .trim()
  .min(1, "Tanggal wajib diisi.")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: "Tanggal tidak valid.",
  })
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

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
  coverImage: optionalUrlPathSchema,
  musicUrl: optionalUrlPathSchema,
  status: invitationStatusSchema,
});

export const eventFormSchema = z.object({
  title: z.string().trim().min(1, "Nama acara wajib diisi.").max(120),
  date: dateSchema,
  startTime: timeSchema,
  endTime: optionalTimeSchema,
  venueName: optionalTextSchema,
  address: optionalTextSchema,
  mapsUrl: optionalUrlPathSchema,
  sortOrder: sortOrderSchema,
});

export const galleryImageFormSchema = z.object({
  imageUrl: requiredUrlPathSchema,
  caption: optionalTextSchema,
  sortOrder: sortOrderSchema,
});

export const giftAccountFormSchema = z.object({
  providerName: z.string().trim().min(1, "Nama bank/e-wallet wajib diisi.").max(80),
  accountNumber: z.string().trim().min(1, "Nomor rekening wajib diisi.").max(80),
  accountHolder: z.string().trim().min(1, "Nama pemilik wajib diisi.").max(120),
  qrImage: optionalUrlPathSchema,
  note: optionalTextSchema,
  sortOrder: sortOrderSchema,
});

export type InvitationFormInput = z.infer<typeof invitationFormSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type GalleryImageFormInput = z.infer<typeof galleryImageFormSchema>;
export type GiftAccountFormInput = z.infer<typeof giftAccountFormSchema>;

export type InvitationFormErrors = Partial<
  Record<keyof InvitationFormInput | "form", string[]>
>;

export type InvitationActionState = {
  errors?: InvitationFormErrors;
  values?: Partial<Record<keyof InvitationFormInput, string>>;
};

export type EventFormValues = Record<keyof z.input<typeof eventFormSchema>, string>;
export type GalleryImageFormValues = Record<
  keyof z.input<typeof galleryImageFormSchema>,
  string
>;
export type GiftAccountFormValues = Record<
  keyof z.input<typeof giftAccountFormSchema>,
  string
>;

export type EventActionState = {
  errors?: Partial<Record<keyof EventFormValues | "form", string[]>>;
  values?: Partial<EventFormValues>;
};

export type GalleryImageActionState = {
  errors?: Partial<Record<keyof GalleryImageFormValues | "form", string[]>>;
  values?: Partial<GalleryImageFormValues>;
};

export type GiftAccountActionState = {
  errors?: Partial<Record<keyof GiftAccountFormValues | "form", string[]>>;
  values?: Partial<GiftAccountFormValues>;
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

export function formDataToEventInput(formData: FormData) {
  return {
    title: formData.get("title"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    venueName: formData.get("venueName"),
    address: formData.get("address"),
    mapsUrl: formData.get("mapsUrl"),
    sortOrder: formData.get("sortOrder"),
  };
}

export function formDataToEventValues(formData: FormData) {
  return Object.fromEntries(
    Object.entries(formDataToEventInput(formData)).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Partial<EventFormValues>;
}

export function formDataToGalleryImageInput(formData: FormData) {
  return {
    imageUrl: formData.get("imageUrl"),
    caption: formData.get("caption"),
    sortOrder: formData.get("sortOrder"),
  };
}

export function formDataToGalleryImageValues(formData: FormData) {
  return Object.fromEntries(
    Object.entries(formDataToGalleryImageInput(formData)).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Partial<GalleryImageFormValues>;
}

export function formDataToGiftAccountInput(formData: FormData) {
  return {
    providerName: formData.get("providerName"),
    accountNumber: formData.get("accountNumber"),
    accountHolder: formData.get("accountHolder"),
    qrImage: formData.get("qrImage"),
    note: formData.get("note"),
    sortOrder: formData.get("sortOrder"),
  };
}

export function formDataToGiftAccountValues(formData: FormData) {
  return Object.fromEntries(
    Object.entries(formDataToGiftAccountInput(formData)).map(([key, value]) => [
      key,
      typeof value === "string" ? value : "",
    ]),
  ) as Partial<GiftAccountFormValues>;
}
