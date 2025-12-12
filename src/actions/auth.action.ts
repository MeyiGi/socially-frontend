// --- START OF FILE src/actions/auth.action.ts ---
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const COOKIE_NAME = "session_token";

export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // The OAuth2 form request usually expects 'username' and 'password' fields
    const body = new URLSearchParams();
    body.append("username", email as string);
    body.append("password", password as string);

    const res = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.detail || "Login failed" };
    }

    const data = await res.json();
    
    // Set HTTP-only cookie
    cookies().set(COOKIE_NAME, data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Connection error" };
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.detail || "Registration failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Connection error" };
  }
}

export async function logoutUser() {
  cookies().delete(COOKIE_NAME);
  redirect("/login");
}

export async function getAuthToken() {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function getAuthUser() {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}