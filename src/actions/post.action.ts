"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "./auth.action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getPosts() {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/posts/`, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (!response.ok) throw new Error("Failed to fetch posts from backend");

    return await response.json();
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
}

export async function createPost(content: string, image: string) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: "Unauthorized" };

    const response = await fetch(`${API_URL}/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify({ content, image }),
    });

    if (!response.ok) throw new Error("Backend failed to create post");

    const newPost = await response.json();
    revalidatePath("/");
    return { success: true, post: newPost };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function toggleLike(postId: string) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: "Unauthorized" };

    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to toggle like");

    const data = await response.json();
    revalidatePath("/");
    return { success: true, liked: data.liked };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: "Unauthorized" };

    // Assumes Python has: POST /api/v1/posts/{id}/comments
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error("Failed to create comment");

    const comment = await response.json();
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: "Unauthorized" };

    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete post");

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}