import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEntry, useDeleteEntry } from "../hooks/useEntries";
import { photoUrl } from "../api/client";
import { formatJstDateTime } from "../lib/date-utils";

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const entryId = Number(id);
  const { data: entry, isLoading } = useEntry(entryId);
  const deleteEntry = useDeleteEntry();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-[var(--c-text-muted)]">
        読み込み中...
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12 text-[var(--c-danger)]">
        投稿が見つかりません
      </div>
    );
  }

  async function handleDelete() {
    if (!confirm("この投稿を削除しますか？")) return;
    try {
      await deleteEntry.mutateAsync(entryId);
      toast.success("削除しました");
      navigate("/");
    } catch {
      toast.error("削除に失敗しました");
    }
  }

  const date = new Date(entry.entry_date + "T00:00:00");
  const dow = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  const dateLabel = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${dow}）`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--c-text-strong)]">
          {dateLabel}
        </p>
        <div className="flex items-center gap-2">
          <Link
            to={`/entries/${entryId}/edit`}
            className="text-xs text-accent border border-accent rounded px-2 py-1 hover:bg-accent hover:text-white transition-colors"
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs text-[var(--c-danger)] border border-[var(--c-danger)] rounded px-2 py-1 hover:bg-[var(--c-danger)] hover:text-white transition-colors"
          >
            削除
          </button>
        </div>
      </div>

      {entry.photos.length > 0 && (
        <div className="space-y-2">
          {entry.photos.map((photo) => (
            <img
              key={photo.id}
              src={photoUrl(photo.id)}
              alt={photo.original_filename || ""}
              className="w-full rounded-lg"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {entry.text && (
        <p className="text-sm text-[var(--c-text)] whitespace-pre-wrap leading-relaxed">
          {entry.text}
        </p>
      )}

      <p className="text-xs text-[var(--c-text-faint)]">
        {formatJstDateTime(entry.created_at)}
      </p>
    </div>
  );
}
