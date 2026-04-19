import { Link } from "react-router-dom";
import { photoUrl } from "../../api/client";
import { formatJstTime } from "../../lib/date-utils";
import type { Entry } from "../../types";

interface Props {
  entry: Entry;
}

export function EntryCard({ entry }: Props) {
  const hasPhotos = entry.photos.length > 0;
  const time = formatJstTime(entry.created_at);

  return (
    <Link
      to={`/entries/${entry.id}`}
      className="block bg-surface-1 rounded-lg border border-border hover:border-border-hover transition-colors overflow-hidden"
    >
      {hasPhotos && (
        <div className="flex gap-px overflow-hidden">
          {entry.photos.slice(0, 3).map((photo) => (
            <img
              key={photo.id}
              src={photoUrl(photo.id, true)}
              alt=""
              className="h-32 flex-1 object-cover min-w-0"
              loading="lazy"
            />
          ))}
          {entry.photos.length > 3 && (
            <div className="h-32 w-16 bg-surface-2 flex items-center justify-center text-sm text-[var(--c-text-muted)]">
              +{entry.photos.length - 3}
            </div>
          )}
        </div>
      )}
      <div className="p-3">
        {entry.text && (
          <p className="text-sm text-[var(--c-text)] line-clamp-2">
            {entry.text}
          </p>
        )}
        <p className="text-xs text-[var(--c-text-faint)] mt-1">{time}</p>
      </div>
    </Link>
  );
}
