import { useEffect, useState } from "react";
import { getAdminUsers } from "@/features/admin/users/api";
import type { AppUser } from "@/lib/types";

export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAdminUsers()
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Users</h2>
      <div className="space-y-2">
        {users.length === 0 && <div>No users found</div>}
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded border p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm text-muted-foreground">{u.email}</div>
            </div>
            <div className="text-sm">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
