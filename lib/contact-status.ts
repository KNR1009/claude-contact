import { ContactStatus } from "@/lib/generated/prisma/enums";

/** 画面に出す日本語ラベル */
export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  [ContactStatus.NEW]: "新規",
  [ContactStatus.IN_PROGRESS]: "対応中",
  [ContactStatus.RESOLVED]: "解決済み",
};

/** ドロップダウンやフィルタでの並び順 */
export const CONTACT_STATUS_ORDER: readonly ContactStatus[] = [
  ContactStatus.NEW,
  ContactStatus.IN_PROGRESS,
  ContactStatus.RESOLVED,
];

/** バッジの配色 */
export const CONTACT_STATUS_STYLES: Record<ContactStatus, string> = {
  [ContactStatus.NEW]: "bg-rose-100 text-rose-700 ring-rose-200",
  [ContactStatus.IN_PROGRESS]: "bg-amber-100 text-amber-700 ring-amber-200",
  [ContactStatus.RESOLVED]: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};
