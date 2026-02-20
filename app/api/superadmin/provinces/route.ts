import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "src/data/mock/provinces.json");

async function readProvinces() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}
async function writeProvinces(data: any[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const list = await readProvinces();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const list = await readProvinces();
  const created = {
    name: body.name,
    participants: body.participants || 0,
    total: body.total || 0,
  };
  list.push(created);
  await writeProvinces(list);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body?.name)
    return NextResponse.json({ message: "name required" }, { status: 400 });
  const list = await readProvinces();
  const idx = list.findIndex((p: any) => p.name === body.name);
  if (idx === -1)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  list[idx] = { ...list[idx], ...body };
  await writeProvinces(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name)
    return NextResponse.json({ message: "name required" }, { status: 400 });
  const list = await readProvinces();
  const filtered = list.filter((p: any) => p.name !== name);
  await writeProvinces(filtered);
  return NextResponse.json({ success: true });
}
