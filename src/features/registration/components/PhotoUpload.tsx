"use client"

import { useId, useRef, useMemo, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import Image from "next/image"

async function resizeTo4x6(file: File, width = 600, height = 900): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const scale = Math.max(width / bitmap.width, height / bitmap.height)
  const drawWidth = bitmap.width * scale
  const drawHeight = bitmap.height * scale
  const dx = (width - drawWidth) / 2
  const dy = (height - drawHeight) / 2

  ctx.drawImage(bitmap, dx, dy, drawWidth, drawHeight)

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  if (!blob) throw new Error('Failed to resize image')
  return new File([blob], `${Date.now()}-photo.jpg`, { type: 'image/jpeg' })
}

export function PhotoUpload({
  file,
  onChange,
}: {
  file: File | null
  onChange: (file: File | null) => void
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  
  const preview = useMemo(() => file ? URL.createObjectURL(file) : null, [file])

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const handleFile = async (f: File) => {
    try {
      onChange(await resizeTo4x6(f))
    } catch {
      onChange(f)
    }
  }

  return (
    <div className="space-y-4 flex flex-col items-start">
      <div className="w-32 h-48 rounded-sm bg-slate-100 overflow-hidden relative">
        {preview ? (
          <Image src={preview} alt="រូបថតដែលបានផ្ទុកឡើង" fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">គ្មានរូបថត</div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id={`photo-upload-${id}`}
        onChange={(e) => {
          const f = e.currentTarget.files?.[0]
          if (f) handleFile(f)
        }}
      />

      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        ផ្ទុកឡើងរូបថត (4x6)
      </Button>
    </div>
  )
}
