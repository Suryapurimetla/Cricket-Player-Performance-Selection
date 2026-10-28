
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";
import { createSession } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT user_id, name, email, password_hash, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const users = rows as {
      user_id: number;
      name: string;
      email: string;
      password_hash: string;
      role: "admin" | "analyst";
    }[];

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSession(user);

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { error: "Unable to process login right now." },
      { status: 500 }
    );
  }
}
