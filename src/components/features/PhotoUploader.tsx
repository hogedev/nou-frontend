import { useRef } from "react";

export interface PhotoItem {
  file: File;
  caption: string;
}

interface Props {
  items: PhotoItem[];
  onChange: (items: PhotoItem[]) => void;
}

export function PhotoUploader({ items, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newItems = Array.from(e.target.files).map((file) => ({
        file,
        caption: "",
      }));
      onChange([...items, ...newItems]);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateCaption(index: number, caption: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, caption } : item)));
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-lg py-6 text-center text-[var(--c-text-muted)] hover:border-accent transition-colors"
      >
        <span className="text-2xl block mb-1">📷</span>
        <span className="text-sm">写真を追加</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      {items.length > 0 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
          {items.map((item, i) => (
            <div key={i} className="shrink-0 w-28">
              <div className="relative">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt=""
                  className="w-28 h-28 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--c-danger)] text-white rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
              <input
                type="text"
                value={item.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="キャプション"
                className="w-full mt-1 bg-surface-1 border border-border rounded px-2 py-1 text-xs text-[var(--c-text)] placeholder:text-[var(--c-text-faint)] focus:border-accent focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
