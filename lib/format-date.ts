// サーバー側で文字列に変換してから描画し、タイムゾーン差によるハイドレーション不一致を避ける
const formatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** 日時を `2026/08/11 17:44` 形式にする */
export function formatDateTime(date: Date): string {
  return formatter.format(date);
}
