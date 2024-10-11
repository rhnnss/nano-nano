import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    redirect("/login");
  }

  return { isAuth: true, user: session.user };
});
