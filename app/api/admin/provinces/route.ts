import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const REGISTRATIONS_FILE = path.join(
  process.cwd(),
  "src/data/mock/registrations.json",
);

async function readRegistrations() {
  try {
    const raw = await fs.readFile(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function GET() {
  const registrationsData = await readRegistrations();
  const participants: any[] = [];
  registrationsData.forEach((user: any) => {
    user.registrations?.forEach((reg: any) => participants.push(reg));
  });

  const provincesMap: Record<string, any> = {};
  participants.forEach((p) => {
    const name =
      p.province ||
      p.organization?.province ||
      p.organization?.name ||
      "Unknown";
    if (!provincesMap[name])
      provincesMap[name] = { name, participants: 0, total: 0 };
    provincesMap[name].participants += 1;
  });

  const provinces = Object.values(provincesMap).map((p: any) => ({
    ...p,
    total: p.participants,
  }));
  provinces.sort((a: any, b: any) => b.participants - a.participants);
  return NextResponse.json(provinces);
}
