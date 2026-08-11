import type { Metadata } from "next";
import Link from "next/link";

import { StatusBadge } from "@/components/StatusBadge";
import { contactStatusSchema } from "@/lib/contact-schema";
import {
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_ORDER,
} from "@/lib/contact-status";
import { formatDateTime } from "@/lib/format-date";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "お問い合わせ一覧",
};

// 常に最新の受付状況を表示する
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { status } = await searchParams;

  // 不正な値が来たら絞り込みなしとして扱う
  const parsedStatus = contactStatusSchema.safeParse(status);
  const activeStatus = parsedStatus.success ? parsedStatus.data : null;

  const contacts = await prisma.contact.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">お問い合わせ一覧</h1>
      <p className="mt-2 text-sm text-slate-600">
        {contacts.length} 件のお問い合わせ
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        <FilterLink href="/admin" label="すべて" isActive={!activeStatus} />
        {CONTACT_STATUS_ORDER.map((value) => (
          <FilterLink
            key={value}
            href={`/admin?status=${value}`}
            label={CONTACT_STATUS_LABELS[value]}
            isActive={activeStatus === value}
          />
        ))}
      </nav>

      {contacts.length === 0 ? (
        <p className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          該当するお問い合わせはありません。
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">受信日時</th>
                <th className="px-4 py-3 font-medium">状況</th>
                <th className="px-4 py-3 font-medium">件名</th>
                <th className="px-4 py-3 font-medium">名前</th>
                <th className="px-4 py-3 font-medium">メールアドレス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {formatDateTime(contact.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={contact.status} />
                  </td>
                  <td className="px-4 py-3">
                    {/* 行全体ではなく件名をリンクにして、遷移先を明示する */}
                    <Link
                      href={`/admin/${contact.id}`}
                      className="font-medium text-slate-900 underline-offset-4 hover:underline"
                    >
                      {contact.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{contact.name}</td>
                  <td className="px-4 py-3 text-slate-500">{contact.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function FilterLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm ring-1 ring-inset transition ${
        isActive
          ? "bg-slate-900 text-white ring-slate-900"
          : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}
