import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// simple endpoint to append survey data to a mock JSON file on disk
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const filePath = path.join(process.cwd(), "src/data/mock/surveys.json");
    // read existing array (file starts empty)
    let existing: any[] = [];
    try {
      const content = await fs.readFile(filePath, "utf-8");
      existing = content.trim() ? JSON.parse(content) : [];
    } catch (e) {
      // if file doesn't exist or isn't parseable, start with empty
      existing = [];
    }

    // body may be an array or a single object
    if (Array.isArray(body)) {
      existing.push(...body);
    } else {
      existing.push(body);
    }

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");
    return NextResponse.json({ success: true, count: existing.length });
  } catch (err) {
    console.error("/api/surveys POST error", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
