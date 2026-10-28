
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short.");
  }

  return new TextEncoder().encode(secret);
};

export async function createSession(user: {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "analyst";
}) {
  return new SignJWT({
    userId: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecret());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.userId !== "number" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "admin" && payload.role !== "analyst")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}
