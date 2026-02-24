import { API_ENDPOINTS } from "@/src/config/constants";
import type { DashboardSport } from "../types";

export const sportsService = {
  async getAll() {
    const res = await fetch(API_ENDPOINTS.superadmin.sports);
    if (!res.ok) throw new Error("Failed to fetch sports");
    return res.json();
  },

  async create(payload: Partial<DashboardSport>) {
    const res = await fetch(API_ENDPOINTS.superadmin.sports, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create sport");
    return res.json();
  },

  async update(payload: DashboardSport) {
    const res = await fetch(API_ENDPOINTS.superadmin.sports, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update sport");
    return res.json();
  },

  async remove(id: string) {
    const res = await fetch(
      API_ENDPOINTS.superadmin.sports + `?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (!res.ok) throw new Error("Failed to delete sport");
  },
};
