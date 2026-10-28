
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySession(token) : null;

  // Allow users to reach the login API.
  if (pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  // Logged-in users should not need the login page.
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Require authentication for all other pages and APIs.
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Only Admins can open the account-management page or call its API.
  if (
    pathname === "/admin/users" ||
    pathname.startsWith("/admin/users/") ||
    pathname === "/api/admin/users" ||
    pathname.startsWith("/api/admin/users/")
  ) {
    if (session.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Admin access required." },
          { status: 403 }
        );
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
