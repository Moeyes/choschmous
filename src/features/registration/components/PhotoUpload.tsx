"use client";

import { useId, useRef, useMemo, useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import { UploadCloud, ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PHOTO_DIMENSIONS } from "@/src/config/constants";

async function resizeTo4x6(
  file: File,
  width = PHOTO_DIMENSIONS.width,
  height = PHOTO_DIMENSIONS.height,
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const scale = Math.max(width / bitmap.width, height / bitmap.height);
  const drawWidth = bitmap.width * scale;
  const drawHeight = bitmap.height * scale;
  const dx = (width - drawWidth) / 2;
  const dy = (height - drawHeight) / 2;

  ctx.drawImage(bitmap, dx, dy, drawWidth, drawHeight);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  );
  if (!blob) throw new Error("Failed to resize image");
  return new File([blob], `${Date.now()}-photo.jpg`, { type: "image/jpeg" });
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[power]}`;
}

export function PhotoUpload({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleFile = async (f: File) => {
    try {
      onChange(await resizeTo4x6(f));
    } catch {
      onChange(f);
    }
  };

  const hasFile = !!file;

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 text-slate-800">
          <ImageIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold">រូបថត (4x6)</h2>
        </div>
        <p className="text-sm text-slate-600">
          បញ្ចូលរូបថត 4x6 សម្រាប់ប័ណ្ណចុះឈ្មោះ។ សូមប្រើឯកសារ JPEG ឬ PNG
          និងរក្សាទំហំប្រហែល {PHOTO_DIMENSIONS.width}x{PHOTO_DIMENSIONS.height}{" "}
          px។
        </p>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {!hasFile ? (
          <label
            htmlFor={`photo-upload-${id}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const dropped = e.dataTransfer?.files?.[0];
              if (dropped) handleFile(dropped);
            }}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-slate-50/60 p-6 transition",
              "hover:border-indigo-300 hover:bg-indigo-50/60 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200",
              isDragging && "border-indigo-400 bg-indigo-50",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              id={`photo-upload-${id}`}
              onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                if (f) handleFile(f);
              }}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
              <UploadCloud className="h-6 w-6" aria-hidden />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-800">
                ចុចឬអូសឯកសារមកទីនេះ
              </p>
              <p className="text-xs text-slate-500">
                JPEG/PNG • ទំហំប្រហែល 4x6 • អតិបរមា 5MB
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              ជ្រើសរើសរូបថត
            </Button>
          </label>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group flex w-full flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image
                src={preview as string}
                alt="រូបថតដែលបានបញ្ចូល"
                width={PHOTO_DIMENSIONS.width}
                height={PHOTO_DIMENSIONS.height}
                className="h-full w-full object-cover"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/20 opacity-0 transition group-hover:opacity-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-semibold text-white">
                  បានផ្ទុករូបថត • ចុចដើម្បីប្តូរ
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm text-slate-700 shadow-xs">
              <span className="font-medium truncate" title={file?.name}>
                {file?.name}
              </span>
              <span className="text-xs text-slate-500">
                {file ? formatBytes(file.size) : ""}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ចុចលើរូបថតដើម្បីប្តូរ ឬ បញ្ចូលឡើងវិញ
            </p>
          </button>
        )}
      </div>
    </section>
  );
}
