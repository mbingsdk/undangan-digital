"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  error?: string;
  fields?: {
    email?: string[];
    password?: string[];
  };
};

function getSafeRedirect(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin";
  }

  return nextPath;
}

type LoginFormProps = {
  nextPath?: string | null;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginResponse["fields"]>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors(undefined);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = (await response.json().catch(() => ({}))) as LoginResponse;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Login gagal. Coba lagi.");
      setFieldErrors(data.fields);
      return;
    }

    router.replace(getSafeRedirect(nextPath ?? null));
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800" htmlFor="email">
          Email admin
        </label>
        <input
          autoComplete="email"
          className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
          id="email"
          name="email"
          required
          type="email"
        />
        {fieldErrors?.email?.[0] ? (
          <p className="text-sm text-red-700">{fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-stone-800"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className="h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-900"
          id="password"
          name="password"
          required
          type="password"
        />
        {fieldErrors?.password?.[0] ? (
          <p className="text-sm text-red-700">{fieldErrors.password[0]}</p>
        ) : null}
      </div>

      {error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        className="h-11 w-full bg-stone-950 px-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
