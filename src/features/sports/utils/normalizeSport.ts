import type { DashboardSport, SportStatus } from "../types";

const VALID_STATUS: SportStatus[] = ["upcoming", "ongoing", "completed"];

export function normalizeSport(input: any): DashboardSport {
  const status = String(input.status ?? "").toLowerCase();

  return {
    ...input,
    participants:
      typeof input.participants === "number"
        ? input.participants
        : Number(input.participants) || 0,
    status: VALID_STATUS.includes(status as SportStatus)
      ? (status as SportStatus)
      : "upcoming",
  };
}
