import type { AppUser } from "@/lib/types";
import { apiGet } from "@/lib/api";

export async function getAdminUsers() {
  return apiGet<{ users: AppUser[] }>("/admin/users");
}
