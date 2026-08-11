"use server";

import { revalidatePath } from "next/cache";

import {
  adminNoteSchema,
  contactIdSchema,
  contactStatusSchema,
} from "@/lib/contact-schema";
import { ContactStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type AdminNoteState = {
  message?: string;
  error?: string;
};

/** 管理ページで変更した対応状況を保存する */
export async function updateContactStatus(
  id: string,
  nextStatus: string,
): Promise<void> {
  const parsedId = contactIdSchema.safeParse(id);
  const parsedStatus = contactStatusSchema.safeParse(nextStatus);

  if (!parsedId.success || !parsedStatus.success) {
    throw new Error("ステータスの更新内容が不正です");
  }

  const contactId = parsedId.data;
  const status = parsedStatus.data;

  const current = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { respondedAt: true },
  });

  if (!current) {
    throw new Error("対象のお問い合わせが見つかりません");
  }

  // 「解決済み」にした時点を記録する。既に記録済みならそのまま残し、差し戻したらクリアする
  const respondedAt =
    status === ContactStatus.RESOLVED
      ? (current.respondedAt ?? new Date())
      : null;

  await prisma.contact.update({
    where: { id: contactId },
    data: { status, respondedAt },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/${contactId}`);
}

/** 管理者の対応メモを保存する */
export async function updateAdminNote(
  _prevState: AdminNoteState,
  formData: FormData,
): Promise<AdminNoteState> {
  const parsedId = contactIdSchema.safeParse(formData.get("id"));
  const parsedNote = adminNoteSchema.safeParse(formData.get("adminNote") ?? "");

  if (!parsedId.success) {
    return { error: "対象のお問い合わせが特定できません" };
  }

  if (!parsedNote.success) {
    return { error: parsedNote.error.issues[0]?.message ?? "メモが不正です" };
  }

  const contactId = parsedId.data;

  try {
    await prisma.contact.update({
      where: { id: contactId },
      // 空文字は「メモなし」として NULL で保存する
      data: { adminNote: parsedNote.data === "" ? null : parsedNote.data },
    });
  } catch (error) {
    console.error("対応メモの保存に失敗しました", error);
    return { error: "保存に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath(`/admin/${contactId}`);
  return { message: "メモを保存しました" };
}
