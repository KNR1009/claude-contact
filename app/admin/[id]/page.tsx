import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNoteForm } from "@/components/AdminNoteForm";
import { StatusSelect } from "@/components/StatusSelect";
import { formatDateTime } from "@/lib/format-date";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "お問い合わせ詳細",
};

// ステータス更新を即座に反映する
export const dynamic = "force-dynamic";

export default async function AdminContactDetailPage({
  params,
}: PageProps<"/admin/[id]">) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({ where: { id } });

  if (!contact) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="text-sm text-slate-600 underline-offset-4 hover:underline"
      >
        ← 一覧に戻る
      </Link>

      <h1 className="mt-4 text-2xl font-bold break-words text-slate-900">
        {contact.subject}
      </h1>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <StatusSelect contactId={contact.id} currentStatus={contact.status} />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <dl className="divide-y divide-slate-100">
          <DetailRow label="名前" value={contact.name} />
          <DetailRow label="メールアドレス" value={contact.email} />
          <DetailRow label="受信日時" value={formatDateTime(contact.createdAt)} />
          <DetailRow
            label="解決日時"
            value={
              contact.respondedAt ? formatDateTime(contact.respondedAt) : "—"
            }
          />
          <DetailRow label="本文" value={contact.body} />
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <AdminNoteForm
          contactId={contact.id}
          defaultValue={contact.adminNote ?? ""}
        />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-6 py-3 text-sm font-medium text-slate-500">
          送信元の情報
        </h2>
        <dl className="divide-y divide-slate-100">
          <DetailRow label="IP アドレス" value={contact.ipAddress ?? "—"} />
          <DetailRow label="User-Agent" value={contact.userAgent ?? "—"} />
          <DetailRow label="最終更新" value={formatDateTime(contact.updatedAt)} />
        </dl>
      </section>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-6 py-4 sm:flex sm:gap-6">
      <dt className="w-40 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm break-words whitespace-pre-wrap text-slate-900 sm:mt-0">
        {value}
      </dd>
    </div>
  );
}
