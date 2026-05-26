import { UserPlus, Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "علی محمدی", email: "ali@example.com", role: "ادمین", status: "فعال" },
  { id: 2, name: "سارا احمدی", email: "sara@example.com", role: "ویرایشگر", status: "فعال" },
  { id: 3, name: "رضا کریمی", email: "reza@example.com", role: "بیننده", status: "غیرفعال" },
  { id: 4, name: "مریم حسینی", email: "maryam@example.com", role: "ادمین", status: "فعال" },
  { id: 5, name: "حسن رضایی", email: "hassan@example.com", role: "ویرایشگر", status: "فعال" },
  { id: 6, name: "نازنین عباسی", email: "nazanin@example.com", role: "بیننده", status: "غیرفعال" },
];

export default function Users() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) => u.name.includes(search) || u.email.includes(search)
  );

  return (
    <div className="p-6 h-full overflow-auto flex flex-col" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">مدیریت کاربران</h2>
        <button className="flex items-center gap-2 bg-desktop-accent hover:bg-desktop-accent-hover text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <UserPlus className="w-4 h-4" />
          کاربر جدید
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-desktop-text-muted" />
        <input
          type="text"
          placeholder="جستجوی کاربر..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-desktop-surface border border-desktop-border rounded-lg pr-10 pl-4 py-2.5 text-sm outline-none focus:border-desktop-accent transition-colors"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-desktop-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-desktop-surface border-b border-desktop-border">
              <th className="text-right p-3 font-medium text-desktop-text-muted">نام</th>
              <th className="text-right p-3 font-medium text-desktop-text-muted">ایمیل</th>
              <th className="text-right p-3 font-medium text-desktop-text-muted">نقش</th>
              <th className="text-right p-3 font-medium text-desktop-text-muted">وضعیت</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-desktop-border/50 hover:bg-desktop-surface/50 transition-colors"
              >
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 text-desktop-text-muted">{user.email}</td>
                <td className="p-3">
                  <span className="bg-desktop-accent/15 text-desktop-accent px-2 py-0.5 rounded-md text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs ${
                      user.status === "فعال"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">
                  <button className="p-1 rounded hover:bg-desktop-border/50 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-desktop-text-muted" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
