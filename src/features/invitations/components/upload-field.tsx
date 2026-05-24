"use client";

import type { ChangeEvent } from "react";
import { useId, useRef, useState } from "react";

type UploadFieldProps = {
  defaultValue?: string | null;
  error?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
};

export function UploadField({
  defaultValue,
  error,
  label,
  name,
  placeholder,
  required,
}: UploadFieldProps) {
  const inputId = useId();
  const fileInputId = useId();
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      url?: string;
    };

    setIsUploading(false);
    event.target.value = "";

    if (!response.ok || !data.url) {
      setUploadError(data.error ?? "Upload gagal.");
      return;
    }

    if (urlInputRef.current) {
      urlInputRef.current.value = data.url;
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-800" htmlFor={inputId}>
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="h-11 min-w-0 flex-1 border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
          defaultValue={defaultValue ?? ""}
          id={inputId}
          name={name}
          placeholder={placeholder}
          ref={urlInputRef}
          required={required}
        />
        <label
          className="inline-flex h-11 cursor-pointer items-center justify-center border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
          htmlFor={fileInputId}
        >
          {isUploading ? "Upload..." : "Upload"}
        </label>
        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id={fileInputId}
          onChange={handleFileChange}
          type="file"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {uploadError ? <p className="text-sm text-red-700">{uploadError}</p> : null}
    </div>
  );
}
