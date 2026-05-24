"use client";

import { useActionState } from "react";
import {
  adminButtonPrimaryClass,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import type { GuestActionState, GuestFormValues } from "../schemas";

type GuestFormProps = {
  action: (
    previousState: GuestActionState,
    formData: FormData,
  ) => Promise<GuestActionState>;
  defaultValues?: Partial<GuestFormValues>;
  submitLabel: string;
};

function FieldError({ message }: { message?: string[] }) {
  if (!message?.[0]) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-700">{message[0]}</p>;
}

export function GuestForm({
  action,
  defaultValues,
  submitLabel,
}: GuestFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});
  const values = state.values ?? defaultValues ?? {};

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1 sm:col-span-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="name">
          Nama tamu
        </label>
        <input
          className={adminInputClass}
          defaultValue={values.name}
          id="name"
          maxLength={100}
          name="name"
          required
        />
        <FieldError message={state.errors?.name} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-stone-700" htmlFor="phone">
          Nomor WhatsApp
        </label>
        <input
          className={adminInputClass}
          defaultValue={values.phone ?? ""}
          id="phone"
          maxLength={30}
          name="phone"
          placeholder="62812..."
        />
        <FieldError message={state.errors?.phone} />
      </div>

      <div className="space-y-1">
        <label
          className="text-sm font-medium text-stone-700"
          htmlFor="maxGuest"
        >
          Maksimal tamu
        </label>
        <input
          className={adminInputClass}
          defaultValue={values.maxGuest ?? "1"}
          id="maxGuest"
          max="10"
          min="1"
          name="maxGuest"
          required
          type="number"
        />
        <FieldError message={state.errors?.maxGuest} />
      </div>

      <div className="space-y-1 sm:col-span-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="notes">
          Catatan
        </label>
        <textarea
          className={adminTextareaClass}
          defaultValue={values.notes ?? ""}
          id="notes"
          maxLength={300}
          name="notes"
        />
        <FieldError message={state.errors?.notes} />
      </div>

      {state.errors?.form?.[0] ? (
        <p className="text-sm text-red-700 sm:col-span-2">
          {state.errors.form[0]}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          className={`${adminButtonPrimaryClass} h-10`}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
