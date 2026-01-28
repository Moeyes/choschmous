import { NextResponse } from "next/server";
import organizations from "@/src/data/mock/organizations.json";

export async function GET() {
  return NextResponse.json(organizations);
}
