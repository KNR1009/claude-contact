"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  contactFormSchema,
  type ContactFieldErrors,
} from "@/lib/contact-schema";
import { prisma } from "@/lib/prisma";

export type ContactFormState = {
  errors?: ContactFieldErrors;
  message?: string;
};

/** 確認画面から送信されたお問い合わせを保存する */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // クライアントでも検証しているが、Server Action は直接 POST できるためここでも必ず検証する
  const parsed = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "入力内容に誤りがあります。",
    };
  }

  const headerList = await headers();
  // プロキシ経由の場合、先頭が実際のクライアント IP
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = headerList.get("user-agent");

  try {
    await prisma.contact.create({
      data: { ...parsed.data, ipAddress, userAgent },
    });
  } catch (error) {
    console.error("お問い合わせの保存に失敗しました", error);
    return {
      message: "送信に失敗しました。時間をおいて再度お試しください。",
    };
  }

  // redirect は例外を投げて処理を中断するため try の外で呼ぶ
  redirect("/contact/thanks");
}
