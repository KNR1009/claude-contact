import {
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_STYLES,
} from "@/lib/contact-status";
import type { ContactStatus } from "@/lib/generated/prisma/enums";

/** 一覧・詳細で対応状況を色分け表示する */
export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${CONTACT_STATUS_STYLES[status]}`}
    >
      {CONTACT_STATUS_LABELS[status]}
    </span>
  );
}
