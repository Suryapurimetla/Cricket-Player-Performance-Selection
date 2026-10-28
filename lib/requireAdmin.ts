
import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (session.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      ),
    };
  }

  return {
    session,
    response: null,
  };
}
