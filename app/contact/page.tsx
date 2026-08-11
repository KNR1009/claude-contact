import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">お問い合わせ</h1>
      <p className="mt-2 text-sm text-slate-600">
        以下のフォームに入力し、確認画面へお進みください。
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </main>
  );
}
