import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"
import type { FormData } from "@/types/registration"

const FILE = path.join(process.cwd(), "/lib/data/mock/registrations.json")

async function readRegistrations(): Promise<any[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8")
    const parsed = JSON.parse(raw || "[]")
    if (Array.isArray(parsed)) return parsed
    // If file contains a single object, normalize to an array
    if (parsed && typeof parsed === 'object') return [parsed]
    return []
  } catch (e) {
    return []
  }
}

async function writeRegistrations(data: any[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8")
}

export async function GET() {
  const regs = await readRegistrations()
  return NextResponse.json(regs)
}



export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: Partial<FormData> = {}
    let photoUrl: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const fd = await request.formData()
      const payload = fd.get('payload') as string | null
      if (payload) {
        try {
          body = JSON.parse(payload)
        } catch (e) {
          console.warn('Failed to parse payload JSON', e)
          body = {}
        }
      }

      // Save top-level photo (if present) and member photos (keys like memberPhoto_<id|index>)
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      const maxSize = 2 * 1024 * 1024 // 2MB

      const memberPhotoMap: Record<string, string> = {}

      for (const [key, val] of (fd as any).entries()) {
        if (key !== 'photo') continue;
        if (!val || typeof val !== 'object' || typeof val.arrayBuffer !== 'function') continue;
        const file = val as any;
        const mime = file.type || '';
        const buffer = Buffer.from(await file.arrayBuffer());
        if (mime && !mime.startsWith('image/')) {
          return new Response(JSON.stringify({ message: 'Uploaded file must be an image.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (buffer.length > maxSize) {
          return new Response(JSON.stringify({ message: 'Image size must be 2MB or smaller.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const filename = `${Date.now()}-${(file.name ?? 'upload.jpg').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);
        photoUrl = `/uploads/${filename}`;
      }


    } else {
      body = (await request.json()) as Partial<FormData>
    }

    const regsRaw = await readRegistrations()
    const regs = Array.isArray(regsRaw) ? regsRaw : []
    const id = String(Date.now())
    const now = new Date().toISOString()

    // Normalize the incoming payload so the stored data is consistent and easy to consume
    // Import normalization helper to keep mapping logic centralized
    const { normalizeRegistration } = await import('@/lib/data/normalizers/registrationNormalizer')
    const normalized = normalizeRegistration(body as Partial<FormData>)

    // Helpful debug output in dev to inspect normalized payload (safe-guarded)
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.debug('normalized registration:', JSON.stringify(normalized))
      } catch (_e) {
        // ignore serialization errors in debug
      }
    }



    const created = {
      id,
      registeredAt: now,
      photoUrl: photoUrl ?? (body.photoUrl ?? null),
      ...normalized,
      ...((body as any).extra ? (body as any).extra : {}),
    } as any

    regs.push(created)
    await writeRegistrations(regs)
    return new Response(JSON.stringify(created), { status: 201, headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Failed to save registration", err)
    return new Response(JSON.stringify({ message: "Failed to save registration" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
