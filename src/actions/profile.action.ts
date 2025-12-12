"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "./auth.action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getProfileByUsername(username: string) {
  try {
    const response = await fetch(`${API_URL}/users/${username}`, {
        cache: "no-store"
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function getUserPosts(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/posts`, {
        cache: "no-store"
    });
    if(!response.ok) throw new Error("Failed");
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/likes`, {
        cache: "no-store"
    });
    if(!response.ok) throw new Error("Failed");
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const image = formData.get("image") as string;

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, bio, location, website, image })
    });

    if(!response.ok) throw new Error("Failed to update");

    const user = await response.json();
    revalidatePath(`/profile/${user.username}`);
    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}

export async function isFollowing(targetUserId: string) {
  try {
    const token = await getAuthToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/users/${targetUserId}/is_following`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if(!response.ok) return false;
    const data = await response.json();
    return data.is_following;
  } catch (error) {
    return false;
  }
}