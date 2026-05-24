"use client";

import { useActionState } from "react";
import type {
  EventActionState,
  EventFormValues,
  GalleryImageActionState,
  GalleryImageFormValues,
  GiftAccountActionState,
  GiftAccountFormValues,
} from "../schemas";
import { UploadField } from "./upload-field";

type Action<State> = (
  previousState: State,
  formData: FormData,
) => Promise<State>;

const emptyEventState: EventActionState = {};
const emptyGalleryImageState: GalleryImageActionState = {};
const emptyGiftAccountState: GiftAccountActionState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
      {message}
    </p>
  );
}

export function EventForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action<EventActionState>;
  defaultValues?: Partial<EventFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, emptyEventState);
  const values = {
    sortOrder: "0",
    ...defaultValues,
    ...state.values,
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.errors?.form?.[0]} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="event-title">
            Nama acara
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.title ?? ""}
            id="event-title"
            name="title"
            required
          />
          <FieldError message={state.errors?.title?.[0]} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="event-date">
            Tanggal
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.date ?? ""}
            id="event-date"
            name="date"
            required
            type="date"
          />
          <FieldError message={state.errors?.date?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-start-time"
          >
            Jam mulai
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.startTime ?? ""}
            id="event-start-time"
            name="startTime"
            required
            type="time"
          />
          <FieldError message={state.errors?.startTime?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-end-time"
          >
            Jam selesai
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.endTime ?? ""}
            id="event-end-time"
            name="endTime"
            type="time"
          />
          <FieldError message={state.errors?.endTime?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-venue"
          >
            Nama venue
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.venueName ?? ""}
            id="event-venue"
            name="venueName"
          />
          <FieldError message={state.errors?.venueName?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-sort-order"
          >
            Sort order
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.sortOrder ?? "0"}
            id="event-sort-order"
            min="0"
            name="sortOrder"
            type="number"
          />
          <FieldError message={state.errors?.sortOrder?.[0]} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-address"
          >
            Alamat
          </label>
          <textarea
            className="min-h-24 w-full border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.address ?? ""}
            id="event-address"
            name="address"
          />
          <FieldError message={state.errors?.address?.[0]} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="event-maps-url"
          >
            Google Maps URL
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.mapsUrl ?? ""}
            id="event-maps-url"
            name="mapsUrl"
            placeholder="https://maps.google.com/..."
          />
          <FieldError message={state.errors?.mapsUrl?.[0]} />
        </div>
      </div>

      <button
        className="inline-flex h-10 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}

export function GalleryImageForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action<GalleryImageActionState>;
  defaultValues?: Partial<GalleryImageFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    emptyGalleryImageState,
  );
  const values = {
    sortOrder: "0",
    ...defaultValues,
    ...state.values,
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.errors?.form?.[0]} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <UploadField
            defaultValue={values.imageUrl}
            error={state.errors?.imageUrl?.[0]}
            label="Image URL"
            name="imageUrl"
            placeholder="/uploads/gallery.webp"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gallery-caption"
          >
            Caption
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.caption ?? ""}
            id="gallery-caption"
            name="caption"
          />
          <FieldError message={state.errors?.caption?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gallery-sort-order"
          >
            Sort order
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.sortOrder ?? "0"}
            id="gallery-sort-order"
            min="0"
            name="sortOrder"
            type="number"
          />
          <FieldError message={state.errors?.sortOrder?.[0]} />
        </div>
      </div>

      <button
        className="inline-flex h-10 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}

export function GiftAccountForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action<GiftAccountActionState>;
  defaultValues?: Partial<GiftAccountFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    emptyGiftAccountState,
  );
  const values = {
    sortOrder: "0",
    ...defaultValues,
    ...state.values,
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.errors?.form?.[0]} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gift-provider"
          >
            Bank/e-wallet
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.providerName ?? ""}
            id="gift-provider"
            name="providerName"
            required
          />
          <FieldError message={state.errors?.providerName?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gift-account-holder"
          >
            Nama pemilik
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.accountHolder ?? ""}
            id="gift-account-holder"
            name="accountHolder"
            required
          />
          <FieldError message={state.errors?.accountHolder?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gift-account-number"
          >
            Nomor tujuan
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.accountNumber ?? ""}
            id="gift-account-number"
            name="accountNumber"
            required
          />
          <FieldError message={state.errors?.accountNumber?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="gift-sort-order"
          >
            Sort order
          </label>
          <input
            className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.sortOrder ?? "0"}
            id="gift-sort-order"
            min="0"
            name="sortOrder"
            type="number"
          />
          <FieldError message={state.errors?.sortOrder?.[0]} />
        </div>

        <div className="md:col-span-2">
          <UploadField
            defaultValue={values.qrImage}
            error={state.errors?.qrImage?.[0]}
            label="QR image URL"
            name="qrImage"
            placeholder="/uploads/qr.webp"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="gift-note">
            Catatan
          </label>
          <textarea
            className="min-h-24 w-full border border-stone-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-stone-900"
            defaultValue={values.note ?? ""}
            id="gift-note"
            name="note"
          />
          <FieldError message={state.errors?.note?.[0]} />
        </div>
      </div>

      <button
        className="inline-flex h-10 items-center justify-center bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
