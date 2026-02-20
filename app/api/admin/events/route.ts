import { NextResponse } from "next/server";
import events from "@/src/data/mock/events.json";

export async function GET() {
  return NextResponse.json(events);
}
