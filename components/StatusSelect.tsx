"use client";

import { useState, useTransition } from "react";

import { updateContactStatus } from "@/app/admin/actions";
import {
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_ORDER,
} from "@/lib/contact-status";
import type { ContactStatus } from "@/lib/generated/prisma/enums";

type Props = {
  contactId: string;
  currentStatus: ContactStatus;
};

/** ステータスをドロップダウンで変更する */
export function StatusSelect({ contactId, currentStatus }: Props) {
  const [status, setStatus] = useState<ContactStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as ContactStatus;
    const previousStatus = status;

    // 先に表示を更新し、失敗したら元に戻す
    setStatus(nextStatus);
    setError(null);

    startTransition(async () => {
      try {
        await updateContactStatus(contactId, nextStatus);
      } catch (updateError) {
        console.error("ステータスの更新に失敗しました", updateError);
        setStatus(previousStatus);
        setError("更新に失敗しました");
      }
    });
  }

  return (
    <div>
      <label
        htmlFor="status"
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        対応状況
      </label>
      <select
        id="status"
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {CONTACT_STATUS_ORDER.map((value) => (
          <option key={value} value={value}>
            {CONTACT_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {isPending ? (
        <span className="ml-2 text-sm text-slate-500">更新中...</span>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
