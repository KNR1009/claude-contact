import { z } from "zod";

import { ContactStatus } from "@/lib/generated/prisma/enums";

// 前後の空白は保存前に落とす
const trimmed = z.string().trim();

/** お問い合わせフォームの入力値。クライアント / サーバーの双方で使う */
export const contactFormSchema = z.object({
  name: trimmed
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  email: trimmed
    .min(1, "メールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以内で入力してください")
    .pipe(z.email("メールアドレスの形式が正しくありません")),
  subject: trimmed
    .min(1, "件名を入力してください")
    .max(100, "件名は100文字以内で入力してください"),
  body: trimmed
    .min(1, "本文を入力してください")
    .max(2000, "本文は2000文字以内で入力してください"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** フィールドごとのエラーメッセージ */
export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues, string[]>
>;

/** ステータス。Prisma の enum を単一の情報源にする */
export const contactStatusSchema = z.enum(ContactStatus);

/** 管理者の対応メモ */
export const adminNoteSchema = z
  .string()
  .trim()
  .max(2000, "メモは2000文字以内で入力してください");

/** 詳細ページの更新（ID + ステータス）*/
export const contactIdSchema = z.string().min(1, "IDが不正です");
