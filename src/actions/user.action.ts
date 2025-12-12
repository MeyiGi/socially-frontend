"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken, getAuthUser } from "./auth.action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function syncUser() {
  // Logic to sync user is likely handled by register endpoint in Python now.
  // We can keep this empty or use it to update data if needed.
  return;
}

export async function getUserByClerkId(clerkId: string) {
    // This function name is legacy, but we can adapt it to fetch by ID from Python
  try {
    const response = await fetch(`${API_URL}/users/${clerkId}`, {
        cache: "no-store"
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getDbUserId() {
  const user = await getAuthUser();
  if (!user) return null;
  return user.id;
}

export async function getRandomUsers() {
  try {
    const token = await getAuthToken();
    // Pass token if endpoint is protected, otherwise just fetch
    const response = await fetch(`${API_URL}/users/suggestions`, { 
        cache: "no-store",
        headers: token ? { "Authorization": `Bearer ${token}` } : {} 
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.log("Error fetching random user", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const token = await getAuthToken();
    if (!token) return;

    // Assumes Python has: POST /api/v1/users/{id}/follow
    const response = await fetch(`${API_URL}/users/${targetUserId}/follow`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if(!response.ok) throw new Error("Failed to toggle follow");

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}