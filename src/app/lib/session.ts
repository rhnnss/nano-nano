import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { FormData } from "./definitions";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: {
  user: FormData | undefined;
  expiresAt: Date;
}) {
  return (
    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      // .setExpirationTime("1minute") // Set the expiration time to 1 minute for testing purposes.
      .setExpirationTime("1d") // Set the expiration time to 1 day for production.
      .sign(encodedKey)
  );
}

interface Session {
  user: FormData | undefined;
  expiresAt: Date;
}

export async function decrypt(
  session: string | undefined = "",
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    // Here you can map the payload to a Session type if needed.
    const sessionData: Session = {
      user: payload.user as FormData, // Assuming 'user' is stored in the JWT payload.
      expiresAt: new Date((payload.exp ?? 0) * 1000), // Assuming 'exp' is a UNIX timestamp.
    };

    return sessionData;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}

export async function createSession(user: FormData) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expiresAt });

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export function deleteSession() {
  cookies().delete("session");
}
