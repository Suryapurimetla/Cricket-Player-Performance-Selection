
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/requireAdmin";

// GET: List users — Admin only.
export async function GET() {
  const { session, response } = await requireAdmin();

  if (response || !session) {
    return response ?? NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );
  }

  try {
    const [rows] = await pool.query(`
      SELECT user_id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error("List users API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch users." },
      { status: 500 }
    );
  }
}

// POST: Create a user — Admin only.
export async function POST(request: NextRequest) {
  const { session, response } = await requireAdmin();

  if (response || !session) {
    return response ?? NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";
    const role = body.role;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    if (
      email.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 12 || password.length > 72) {
      return NextResponse.json(
        { error: "Password must be between 12 and 72 characters." },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "analyst") {
      return NextResponse.json(
        { error: "Role must be admin or analyst." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role]
    );

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: { name, email, role },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const dbError = error as { code?: string };

    if (dbError.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("Create user API error:", error);

    return NextResponse.json(
      { error: "Unable to create the account right now." },
      { status: 500 }
    );
  }
}
