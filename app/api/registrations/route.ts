import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import type { FormData } from "@/src/types/registration";
import { UPLOAD_LIMITS } from "@/src/config/constants";

const FILE = path.join(process.cwd(), "src/data/mock/registrations.json");

interface RegistrationRecord {
  id: string;
  registeredAt: string;
  photoUrl: string | null;
  [key: string]: unknown;
}

interface UserRegistrations {
  userId: number;
  accessTime: string;
  registrations: RegistrationRecord[];
}

async function readUserRegistrations(): Promise<UserRegistrations[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

async function writeUserRegistrations(
  data: UserRegistrations[],
): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET: Fetch registrations for a specific user or all registrations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const getAll = searchParams.get("all") === "true";

  const allUsers = await readUserRegistrations();

  // If 'all' param is true, return all registrations from all users
  if (getAll) {
    const allRegistrations: any[] = [];
    allUsers.forEach((userRecord) => {
      userRecord.registrations.forEach((reg) => {
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
    const userRecord = allUsers.find((u) => u.userId === userIdNum);

    if (userRecord) {
      return NextResponse.json({
        userId: userRecord.userId,
        accessTime: userRecord.accessTime,
        registrations: userRecord.registrations,
      });
    }

    // Return empty registrations for new user
    return NextResponse.json({
      userId: userIdNum,
      accessTime: new Date().toISOString(),
      registrations: [],
    });
  }

  // Return all registrations (admin view)
  return NextResponse.json(allUsers);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Partial<FormData> & { userId?: number } = {};
    let photoUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      const payload = fd.get("payload") as string | null;
      if (payload) {
        try {
          body = JSON.parse(payload);
        } catch {
          console.warn("Failed to parse payload JSON");
          body = {};
        }
      }

      // Save uploaded photo
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      for (const [key, val] of fd.entries()) {
        if (key !== "photo") continue;
        if (!val || typeof val !== "object" || !("arrayBuffer" in val))
          continue;

        const file = val as File;
        const mime = file.type || "";
        const buffer = Buffer.from(await file.arrayBuffer());

        if (mime && !mime.startsWith("image/")) {
          return NextResponse.json(
            { message: "Uploaded file must be an image." },
            { status: 400 },
          );
        }
        if (buffer.length > UPLOAD_LIMITS.maxImageSize) {
          return NextResponse.json(
            { message: "Image size must be 2MB or smaller." },
            { status: 400 },
          );
        }

        const filename = `${Date.now()}-${(file.name ?? "upload.jpg").replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);
        photoUrl = `/uploads/${filename}`;
      }
    } else {
      body = (await request.json()) as Partial<FormData> & { userId?: number };
    }

    // Extract userId from body
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 },
      );
    }

    const allUsers = await readUserRegistrations();
    const id = String(Date.now());
    const now = new Date().toISOString();

    // Use body directly (normalization removed as normalizer was deleted)
    const normalized = body;

    if (process.env.NODE_ENV !== "production") {
      console.debug("registration data:", JSON.stringify(normalized));
    }

    const created: RegistrationRecord = {
      ...normalized,
      id,
      registeredAt: now,
      // Override photoUrl with uploaded photo if available
      photoUrl: photoUrl ?? (normalized as any).photoUrl ?? null,
    };

    // Find or create user record
    let userRecord = allUsers.find((u) => u.userId === userId);

    if (userRecord) {
      // Update access time and add registration
      userRecord.accessTime = now;
      userRecord.registrations.push(created);
    } else {
      // Create new user record
      userRecord = {
        userId,
        accessTime: now,
        registrations: [created],
      };
      allUsers.push(userRecord);
    }

    await writeUserRegistrations(allUsers);

    // Return the newly created registration along with user's full list
    return NextResponse.json(
      {
        registration: created,
        userRegistrations: userRecord.registrations,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to save registration", err);
    return NextResponse.json(
      { message: "Failed to save registration" },
      { status: 500 },
    );
  }
}

// PUT: Update an existing registration
export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Partial<FormData> & { id?: string } = {};
    let photoUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      const payload = fd.get("payload") as string | null;
      if (payload) {
        try {
          body = JSON.parse(payload);
        } catch {
          console.warn("Failed to parse payload JSON");
          body = {};
        }
      }

      // Save uploaded photo
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      for (const [key, val] of fd.entries()) {
        if (key !== "photo") continue;
        if (!val || typeof val !== "object" || !("arrayBuffer" in val)) continue;
        
        const file = val as File;
        const mime = file.type || "";
        const buffer = Buffer.from(await file.arrayBuffer());
        
        if (mime && !mime.startsWith("image/")) {
          return NextResponse.json(
            { message: "Uploaded file must be an image." },
            { status: 400 }
          );
        }
        if (buffer.length > UPLOAD_LIMITS.maxImageSize) {
          return NextResponse.json(
            { message: "Image size must be 2MB or smaller." },
            { status: 400 }
          );
        }
        
        const filename = `${Date.now()}-${(file.name ?? "upload.jpg").replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);
        photoUrl = `/uploads/${filename}`;
      }
    } else {
      body = await request.json();
    }

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Registration ID is required" },
        { status: 400 },
      );
    }

    const allUsers = await readUserRegistrations();
    let updated = false;
    let updatedRegistration: RegistrationRecord | null = null;

    // Find and update the registration
    for (const userRecord of allUsers) {
      const index = userRecord.registrations.findIndex((r) => r.id === id);
      if (index !== -1) {
        // Update the registration while preserving the id and registeredAt
        userRecord.registrations[index] = {
          ...userRecord.registrations[index],
          ...body,
          id: userRecord.registrations[index].id, // Preserve original ID
          registeredAt: userRecord.registrations[index].registeredAt, // Preserve original registration date
          // Override photoUrl with uploaded photo if available
          photoUrl: photoUrl ?? (body as any).photoUrl ?? userRecord.registrations[index].photoUrl,
        };
        updatedRegistration = userRecord.registrations[index];
        updated = true;
        break;
      }
    }

    if (!updated) {
      return NextResponse.json(
        { message: "Registration not found" },
        { status: 404 },
      );
    }

    await writeUserRegistrations(allUsers);

    return NextResponse.json({
      message: "Registration updated successfully",
      registration: updatedRegistration,
    });
  } catch (err) {
    console.error("Failed to update registration", err);
    return NextResponse.json(
      { message: "Failed to update registration" },
      { status: 500 },
    );
  }
}
