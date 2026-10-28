
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "analyst";
  created_at: string;
};

export default function CreateUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "analyst">("analyst");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch users.");
      }

      setUsers(data.users);
    } catch (err) {
      setUsersError(
        err instanceof Error ? err.message : "Unable to load users."
      );
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create account.");
      }

      setMessage(`Account created for ${data.user.email}.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("analyst");

      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Administration
            </p>

            <h1 className="mt-3 text-3xl font-bold">Create Account</h1>

            <p className="mt-2 text-sm text-slate-400">
              Create a user and assign their system role.
            </p>

            {message && (
              <div
                role="status"
                className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
              >
                {message}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                  Email address (login username)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={150}
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                  Temporary password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={12}
                  maxLength={72}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="At least 12 characters"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Use at least 12 characters. Share the password securely.
                </p>
              </div>

              <div>
                <label htmlFor="role" className="mb-2 block text-sm text-slate-300">
                  Account role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "analyst")
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option value="analyst">Analyst — view data and reports</option>
                  <option value="admin">Admin — administrative access</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  User Management
                </p>
                <h2 className="mt-3 text-2xl font-bold">Registered Users</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {users.length} account{users.length === 1 ? "" : "s"} registered
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchUsers()}
                disabled={usersLoading}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-cyan-300 transition hover:bg-slate-800 disabled:opacity-60"
              >
                {usersLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {usersError && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {usersError}
              </div>
            )}

            {usersLoading ? (
              <p className="mt-6 text-sm text-slate-400">Loading registered users...</p>
            ) : !usersError && users.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">No users found.</p>
            ) : !usersError ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[440px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="px-3 py-3 font-medium">User</th>
                      <th className="px-3 py-3 font-medium">Role</th>
                      <th className="px-3 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.user_id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            {user.email}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-500/15 text-purple-300"
                                : "bg-cyan-500/15 text-cyan-300"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Analyst"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
