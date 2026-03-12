import { Activity } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LogActivityPayload {
  type: "Deposit" | "Withdraw";
  address: string;
  amount: string;
  txHash: string;
}

// ── Activity Service for fetching user activity history ──
export async function fetchActivityHistory(
  address: string,
): Promise<Activity[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/activity/history?address=${address}`,
      { credentials: "include" },
    );
    if (!res.ok) throw new Error("Failed to fetch activity history");

    const data = await res.json();
    return data.data as Activity[];
  } catch (error) {
    console.error("Error fetching activity history:", error);
    throw error;
  }
}

// ── Activity Service for logging new activity events ──
export async function logActivity(payload: LogActivityPayload): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/api/activity/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      console.warn("Activity log failed:", data.message);
    }
  } catch (err) {
    console.warn("Activity log request failed:", err);
  }
}
