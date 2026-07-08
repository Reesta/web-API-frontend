"use server";

import { cookies } from "next/headers";
import { YetiTrekUser } from "./api/auth";

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth_token",
    value: token,
    path: "/", // 🔥 REQUIRED
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function getTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
}

export async function storeUserData(userData: YetiTrekUser) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(userData),
    path: "/", // 🔥 REQUIRED
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function getStoredUserData(): Promise<YetiTrekUser | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get("user_data")?.value;

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as YetiTrekUser;
  } catch {
    return null;
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
  cookieStore.set({
    name: "auth_token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
  });
  cookieStore.set({
    name: "user_data",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
  });
}
