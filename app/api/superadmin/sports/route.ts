import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "src/data/mock/sports.json");

async function readSports() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}
async function writeSports(data: any[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const list = await readSports();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const list = await readSports();
  const id = body.id ?? String(Date.now());
  const created = { id, ...body };
  list.push(created);
  await writeSports(list);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body?.id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const list = await readSports();
  const idx = list.findIndex((s: any) => s.id === body.id);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  list[idx] = { ...list[idx], ...body };
  await writeSports(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const list = await readSports();
  const filtered = list.filter((s: any) => s.id !== id);
  await writeSports(filtered);
  return NextResponse.json({ success: true });
}
