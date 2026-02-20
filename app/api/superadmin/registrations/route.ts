import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE = path.join(process.cwd(), "src/data/mock/registrations.json");

async function readUserRegistrations() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
async function writeUserRegistrations(data: any[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const getAll = searchParams.get("all") === "true";

  const allUsers = await readUserRegistrations();

  if (getAll) {
    const allRegistrations: any[] = [];
    allUsers.forEach((userRecord: any) => {
      userRecord.registrations.forEach((reg: any) => {
        allRegistrations.push({
          ...reg,
          userId: userRecord.userId,
          userAccessTime: userRecord.accessTime,
        });
      });
    });
    return NextResponse.json({
      registrations: allRegistrations,
      total: allRegistrations.length,
    });
  }

  if (userId) {
    const userIdNum = parseInt(userId, 10);
    const userRecord = allUsers.find((u: any) => u.userId === userIdNum);
    if (userRecord) {
      return NextResponse.json({
        userId: userRecord.userId,
        accessTime: userRecord.accessTime,
        registrations: userRecord.registrations,
      });
    }
    return NextResponse.json({
      userId: userIdNum,
      accessTime: new Date().toISOString(),
      registrations: [],
    });
  }

  return NextResponse.json(allUsers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const userId = body.userId ?? Date.now();
  const allUsers = await readUserRegistrations();
  let userRecord = allUsers.find((u: any) => u.userId === userId);
  const id = body.id ?? `REG-${Date.now()}`;
  const created = { ...body, id, registeredAt: new Date().toISOString() };
  if (userRecord) {
    userRecord.registrations.push(created);
  } else {
    userRecord = {
      userId,
      accessTime: new Date().toISOString(),
      registrations: [created],
    };
    allUsers.push(userRecord);
  }
  await writeUserRegistrations(allUsers);
  return NextResponse.json(
    { registration: created, userRegistrations: userRecord.registrations },
    { status: 201 },
  );
}

export async function PUT(request: Request) {
  const body = await request.json();
  const id = body.id;
  if (!id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const allUsers = await readUserRegistrations();
  let updatedReg = null;
  for (const user of allUsers) {
    const idx = user.registrations.findIndex((r: any) => r.id === id);
    if (idx !== -1) {
      user.registrations[idx] = { ...user.registrations[idx], ...body };
      updatedReg = user.registrations[idx];
      break;
    }
  }
  if (!updatedReg)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  await writeUserRegistrations(allUsers);
  return NextResponse.json({ registration: updatedReg });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "id required" }, { status: 400 });
  const allUsers = await readUserRegistrations();
  let removed = false;
  for (const user of allUsers) {
    const before = user.registrations.length;
    user.registrations = user.registrations.filter((r: any) => r.id !== id);
    if (user.registrations.length !== before) removed = true;
  }
  if (!removed)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  await writeUserRegistrations(allUsers);
  return NextResponse.json({ success: true });
}
