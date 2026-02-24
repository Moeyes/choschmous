import { ROUTES } from "@/config/constants";
export const dropDownRegister = [
  { label: "ចុះប្រភេទកីឡា", href: ROUTES.survey, },
  { label: "ចុះចំនួនអ្នកចូលរួម", href: ROUTES.category, },
  { label: "ចុះឈ្មោះ", href: "/dashboard/register/athletes" },
] as const;

export const dropDownDashboard = [
  { label: "coach", href: "/dashboard" },
  { label: "leader", href: "/dashboard" },
] as const;

export function dropDownItems(value?: { label: string; href: string }[]) {
  if (!value) return [];
  return value.map((item) => ({
    label: item.label,
    href: item.href,
  }));
}
