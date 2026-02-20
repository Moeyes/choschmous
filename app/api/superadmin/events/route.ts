import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "src/data/mock/events.json");

async function readEvents() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}
async function writeEvents(data: any[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const events = await readEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = (await request.json()) as any;
  const events = await readEvents();
  const id = body.id ?? `evt-${Date.now()}`;
  const created = { ...body, id };
  events.push(created);
  await writeEvents(events);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as any;
  if (!body?.id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const events = await readEvents();
  const idx = events.findIndex((e: any) => e.id === body.id);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  events[idx] = { ...events[idx], ...body };
  await writeEvents(events);
  return NextResponse.json(events[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const events = await readEvents();
  const filtered = events.filter((e: any) => e.id !== id);
  await writeEvents(filtered);
  return NextResponse.json({ success: true });
}
