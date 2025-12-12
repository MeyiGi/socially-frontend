"use server";

import { getAuthToken } from "./auth.action";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function getNotifications() {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(`${API_URL}/notifications/`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
    });

    if(!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    const token = await getAuthToken();
    if(!token) return { success: false };

    await fetch(`${API_URL}/notifications/mark-read`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ids: notificationIds })
    });

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}