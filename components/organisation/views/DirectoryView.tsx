"use client";

import { useMemo, useState } from "react";
import { useOrganisation } from "@/lib/organisation/store";

export default function DirectoryView() {
  const { state, departmentOf, teamOf, employeeOf } = useOrganisation();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");

  const people = useMemo(() => {
    return state.employees.filter((e) => {
      const hay = `${e.firstName} ${e.lastName} ${e.jobTitle} ${e.email}`.toLowerCase();
      const matchesQ = !q.trim() || hay.includes(q.trim().toLowerCase());
      const matchesDept = dept === "all" || e.departmentId === dept;
      return matchesQ && matchesDept;
    });
  }, [dept, q, state.employees]);

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Employee Directory</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Profiles, departments, managers, skills, leave balance, and performance.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
          <input
            className="org-input"
            placeholder="Search name, title, email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="org-input" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="all">All departments</option>
            {state.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {people.map((e) => {
          const manager = e.managerId ? employeeOf(e.managerId) : undefined;
          return (
            <article key={e.id} className="org-card p-4">
              <div className="flex items-start gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ background: e.avatarColor }}
                >
                  {e.firstName[0]}
                  {e.lastName[0]}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#21386B]">
                    {e.firstName} {e.lastName}
                  </h3>
                  <p className="text-sm text-[#5b6b85]">{e.jobTitle}</p>
                  <p className="text-xs text-[#8a97ab]">{e.employeeId}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-[#3d4d68]">
                <p>{departmentOf(e.departmentId)?.name} · {teamOf(e.teamId)?.name}</p>
                <p>{e.email}</p>
                <p>{e.phone}</p>
                <p>
                  Manager: {manager ? `${manager.firstName} ${manager.lastName}` : "—"}
                </p>
                <p>
                  Status: <span className="font-semibold capitalize">{e.status}</span>
                </p>
                <p>
                  Leave: {e.leaveBalance}d · Rating: {e.performanceRating.toFixed(1)}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.skills.map((s) => (
                  <span key={s} className="org-chip">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
