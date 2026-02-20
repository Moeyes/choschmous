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
