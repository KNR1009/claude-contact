"use client";

import { useActionState } from "react";

import { updateAdminNote, type AdminNoteState } from "@/app/admin/actions";

type Props = {
  contactId: string;
  defaultValue: string;
};

/** 管理者の対応メモを編集する */
export function AdminNoteForm({ contactId, defaultValue }: Props) {
  const [state, formAction, isPending] = useActionState<
    AdminNoteState,
    FormData
  >(updateAdminNote, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={contactId} />

      <div>
        <label
          htmlFor="adminNote"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          対応メモ
        </label>
        <textarea
          id="adminNote"
          name="adminNote"
          rows={5}
          defaultValue={defaultValue}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "保存中..." : "メモを保存"}
        </button>
        {state.message ? (
          <span className="text-sm text-emerald-600">{state.message}</span>
        ) : null}
        {state.error ? (
          <span role="alert" className="text-sm text-rose-600">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
