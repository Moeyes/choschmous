/**
 * Generate a unique registration ID based on role and date
 * Format: {ROLE_PREFIX}-{YYYYMMDD}-{SEQ}
 * Examples: ATH-20260206-001, LEAD-20260206-001
 */
export function generateRegistrationId(
  role: string | undefined,
  existingIds: string[],
): string {
  // Determine role prefix
  const rolePrefix = role === "Leader" ? "LEAD" : "ATH";

  // Get current date in YYYYMMDD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // Find the highest sequence number for today's date and role
  const pattern = new RegExp(`^${rolePrefix}-${dateStr}-(\\d+)$`);
  let maxSeq = 0;

  for (const id of existingIds) {
    const match = id.match(pattern);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  // Increment sequence
  const nextSeq = maxSeq + 1;
  const seqStr = String(nextSeq).padStart(3, "0");

  return `${rolePrefix}-${dateStr}-${seqStr}`;
}

/**
 * Parse a registration ID to extract role, date, and sequence
 */
export function parseRegistrationId(id: string): {
  role: "Athlete" | "Leader" | null;
  date: string | null;
  sequence: number | null;
} {
  const match = id.match(/^(ATH|LEAD)-(\d{8})-(\d{3})$/);

  if (!match) {
    return { role: null, date: null, sequence: null };
  }

  const [, rolePrefix, dateStr, seqStr] = match;

  return {
    role: rolePrefix === "LEAD" ? "Leader" : "Athlete",
    date: dateStr,
    sequence: parseInt(seqStr, 10),
  };
}
