import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "送信完了",
};

export default function ContactThanksPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          お問い合わせありがとうございました
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          内容を確認のうえ、担当者よりご連絡いたします。
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
