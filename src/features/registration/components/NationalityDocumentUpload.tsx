"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface NationalityDocumentUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
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

export function NationalityDocumentUpload({
  file,
  onChange,
}: NationalityDocumentUploadProps) {
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

  const handleFile = (f: File) => {
    onChange(f);
  };

  const hasFile = !!file;

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 text-slate-800">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold">ឯកសារជាតិសញ្ជាតិ</h2>
        </div>
        <p className="text-sm text-slate-600">
          បញ្ចូលសំបុត្រកំណើត សំបុត្រណែនាំ ឬឯកសារបញ្ជាក់ជាតិសញ្ជាតិ
          សម្រាប់ការផ្ទៀងផ្ទាត់។ រក្សាទំហំឯកសារតិចជាង 5MB។
        </p>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {!hasFile ? (
          <label
            htmlFor={`nationality-document-upload-${id}`}
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
              id={`nationality-document-upload-${id}`}
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
              <p className="text-xs text-slate-500">JPEG/PNG • អតិបរមា 5MB</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              ជ្រើសរើសឯកសារ
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
                alt="ឯកសារជាតិសញ្ជាតិ"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/20 opacity-0 transition group-hover:opacity-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-semibold text-white">
                  បានផ្ទុកឯកសារ • ចុចដើម្បីប្តូរ
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
              ចុចលើឯកសារដើម្បីប្តូរ ឬ បញ្ចូលឡើងវិញ
            </p>
          </button>
        )}
      </div>
    </section>
  );
}
