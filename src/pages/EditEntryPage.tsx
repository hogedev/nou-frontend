import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEntry, useUpdateEntry } from "../hooks/useEntries";

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>();
  const entryId = Number(id);
  const { data: entry, isLoading } = useEntry(entryId);
  const updateEntry = useUpdateEntry();
  const navigate = useNavigate();

  const [text, setText] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | null>(
    null,
  );

  const displayText = text ?? entry?.text ?? "";
  const displayDate = date ?? entry?.entry_date ?? "";
  const displayTimeSlot = timeSlot ?? entry?.time_slot ?? "morning";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateEntry.mutateAsync({
        id: entryId,
        data: {
          text: displayText.trim() || undefined,
          entry_date: displayDate,
          time_slot: displayTimeSlot,
        },
      });
      toast.success("更新しました");
      navigate(`/entries/${entryId}`);
    } catch {
      toast.error("更新に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={displayText}
        onChange={(e) => setText(e.target.value)}
        placeholder="作業内容を記録..."
        rows={6}
        className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] focus:border-accent focus:outline-none resize-none"
      />

      <input
        type="date"
        value={displayDate}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-surface-1 border border-border rounded-lg px-3 py-2 text-sm text-[var(--c-text)] focus:border-accent focus:outline-none"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTimeSlot("morning")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
            displayTimeSlot === "morning"
              ? "bg-accent text-white border-accent"
              : "border-border text-[var(--c-text-muted)]"
          }`}
        >
          午前
        </button>
        <button
          type="button"
          onClick={() => setTimeSlot("afternoon")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
            displayTimeSlot === "afternoon"
              ? "bg-accent text-white border-accent"
              : "border-border text-[var(--c-text-muted)]"
          }`}
        >
          午後
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 border border-border rounded-lg py-3 text-sm hover:border-border-hover transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={updateEntry.isPending}
          className="flex-1 bg-accent text-white rounded-lg py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {updateEntry.isPending ? "更新中..." : "更新する"}
        </button>
      </div>
    </form>
  );
}
