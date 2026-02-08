"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

interface NationalityDocumentUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

export function NationalityDocumentUpload({
  file,
  onChange,
}: NationalityDocumentUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div className="space-y-4 flex flex-col items-start">
      <div className="w-32 h-32 rounded-md bg-slate-100 overflow-hidden relative border border-slate-200">
        {preview ? (
          <Image
            src={preview}
            alt="ឯកសារជាតិសញ្ជាតិ"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            មិនទាន់បញ្ចូលឯកសារ
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id={`nationality-document-upload-${id}`}
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        បញ្ចូលឯកសារជាតិសញ្ជាតិ
      </Button>
    </div>
  );
}
