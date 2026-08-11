import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">お問い合わせフォーム</h1>
      <p className="mt-2 text-sm text-slate-600">
        お問い合わせの受付と、受け付けた内容の管理ができます。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/contact"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
        >
          <span className="block font-medium text-slate-900">
            お問い合わせする
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            入力 → 確認 → 送信
          </span>
        </Link>

        <Link
          href="/admin"
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400"
        >
          <span className="block font-medium text-slate-900">管理ページ</span>
          <span className="mt-1 block text-sm text-slate-600">
            一覧・詳細・ステータス管理
          </span>
        </Link>
      </div>
    </main>
  );
}
