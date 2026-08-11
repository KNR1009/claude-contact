"use client";

import { useActionState, useState } from "react";
import { z } from "zod";

import { submitContact, type ContactFormState } from "@/app/contact/actions";
import {
  contactFormSchema,
  type ContactFieldErrors,
  type ContactFormValues,
} from "@/lib/contact-schema";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  body: "",
};

const FIELD_LABELS: Record<keyof ContactFormValues, string> = {
  name: "名前",
  email: "メールアドレス",
  subject: "件名",
  body: "本文",
};

const FIELD_ORDER = ["name", "email", "subject", "body"] as const;

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-rose-100";

export function ContactForm() {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(submitContact, {});

  // クライアント側の検証結果に、サーバーから返ったエラーを重ねる
  const errors: ContactFieldErrors = { ...clientErrors, ...state.errors };

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // 送信はせず、確認画面に進めるだけ
  function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      setClientErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    // 空白を落とした値を確定させ、確認画面と送信内容を一致させる
    setValues(parsed.data);
    setClientErrors({});
    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <form action={formAction} className="space-y-6">
        <p className="text-sm text-slate-600">
          以下の内容で送信します。よろしければ「送信する」を押してください。
        </p>

        {state.message ? (
          <p
            role="alert"
            className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200"
          >
            {state.message}
          </p>
        ) : null}

        <dl className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {FIELD_ORDER.map((field) => (
            <div key={field} className="px-4 py-3 sm:flex sm:gap-4">
              <dt className="w-40 shrink-0 text-sm font-medium text-slate-500">
                {FIELD_LABELS[field]}
              </dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap text-slate-900 sm:mt-0">
                {values[field]}
              </dd>
            </div>
          ))}
        </dl>

        {/* 送信内容は hidden で持たせ、JavaScript 無効でも Server Action に届くようにする */}
        {FIELD_ORDER.map((field) => (
          <input key={field} type="hidden" name={field} value={values[field]} />
        ))}

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "送信中..." : "送信する"}
          </button>
          <button
            type="button"
            onClick={() => setStep("input")}
            disabled={isPending}
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            修正する
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleConfirm} noValidate className="space-y-5">
      {FIELD_ORDER.map((field) => {
        const fieldErrors = errors[field];
        const errorId = `${field}-error`;

        return (
          <div key={field}>
            <label
              htmlFor={field}
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {FIELD_LABELS[field]}
              <span className="ml-1 text-rose-600">*</span>
            </label>

            {field === "body" ? (
              <textarea
                id={field}
                name={field}
                rows={8}
                value={values[field]}
                onChange={(event) => handleChange(field, event.target.value)}
                aria-invalid={Boolean(fieldErrors)}
                aria-describedby={fieldErrors ? errorId : undefined}
                className={inputClass}
              />
            ) : (
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={values[field]}
                onChange={(event) => handleChange(field, event.target.value)}
                aria-invalid={Boolean(fieldErrors)}
                aria-describedby={fieldErrors ? errorId : undefined}
                className={inputClass}
              />
            )}

            {fieldErrors ? (
              <p id={errorId} className="mt-1 text-sm text-rose-600">
                {fieldErrors[0]}
              </p>
            ) : null}
          </div>
        );
      })}

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
      >
        確認画面へ
      </button>
    </form>
  );
}
