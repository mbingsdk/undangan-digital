"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import {
  invitationStatuses,
  type InvitationActionState,
  type InvitationFormInput,
} from "../schemas";
import { UploadField } from "./upload-field";

type InvitationFormProps = {
  action: (
    previousState: InvitationActionState,
    formData: FormData,
  ) => Promise<InvitationActionState>;
  defaultValues?: Partial<Record<keyof InvitationFormInput, string | null>>;
  submitLabel: string;
};

const emptyState: InvitationActionState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

export function InvitationForm({
  action,
  defaultValues,
  submitLabel,
}: InvitationFormProps) {
  const [state, formAction, isPending] = useActionState(action, emptyState);
  const values = {
    ...defaultValues,
    ...state.values,
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.errors?.form?.[0] ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.errors.form[0]}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="title">
            Judul undangan
          </label>
          <input
            className={adminInputClass}
            defaultValue={values.title ?? ""}
            id="title"
            name="title"
            required
          />
          <FieldError message={state.errors?.title?.[0]} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="slug">
            Slug
          </label>
          <input
            className={adminInputClass}
            defaultValue={values.slug ?? ""}
            id="slug"
            name="slug"
            placeholder="rizky-salsa"
            required
          />
          <FieldError message={state.errors?.slug?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="groomName"
          >
            Nama mempelai pria
          </label>
          <input
            className={adminInputClass}
            defaultValue={values.groomName ?? ""}
            id="groomName"
            name="groomName"
            required
          />
          <FieldError message={state.errors?.groomName?.[0]} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="brideName"
          >
            Nama mempelai wanita
          </label>
          <input
            className={adminInputClass}
            defaultValue={values.brideName ?? ""}
            id="brideName"
            name="brideName"
            required
          />
          <FieldError message={state.errors?.brideName?.[0]} />
        </div>

        <UploadField
          defaultValue={values.coverImage}
          error={state.errors?.coverImage?.[0]}
          label="Cover image URL"
          name="coverImage"
          placeholder="/uploads/cover.jpg"
        />

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="musicUrl"
          >
            Music URL
          </label>
          <input
            className={adminInputClass}
            defaultValue={values.musicUrl ?? ""}
            id="musicUrl"
            name="musicUrl"
            placeholder="/uploads/music.mp3"
          />
          <FieldError message={state.errors?.musicUrl?.[0]} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="openingText"
          >
            Teks pembuka
          </label>
          <textarea
            className={`${adminTextareaClass} min-h-28`}
            defaultValue={values.openingText ?? ""}
            id="openingText"
            name="openingText"
          />
          <FieldError message={state.errors?.openingText?.[0]} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-stone-800"
            htmlFor="closingText"
          >
            Teks penutup
          </label>
          <textarea
            className={`${adminTextareaClass} min-h-28`}
            defaultValue={values.closingText ?? ""}
            id="closingText"
            name="closingText"
          />
          <FieldError message={state.errors?.closingText?.[0]} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-800" htmlFor="status">
            Status
          </label>
          <select
            className={adminSelectClass}
            defaultValue={values.status ?? "DRAFT"}
            id="status"
            name="status"
          >
            {invitationStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <FieldError message={state.errors?.status?.[0]} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          className={adminButtonSecondaryClass}
          href="/admin/invitations"
        >
          Batal
        </Link>
        <button
          className={adminButtonPrimaryClass}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
