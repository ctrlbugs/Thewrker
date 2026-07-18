"use client";

import { useOrganisation } from "@/lib/organisation/store";

export default function PerformanceView() {
  const { state, me, departmentOf } = useOrganisation();

  const deptMembers = state.employees.filter(
    (e) => e.departmentId === me.departmentId
  );
  const deptTasks = state.tasks.filter((t) =>
    deptMembers.some((m) => m.id === t.assignedTo)
  );
  const completed = deptTasks.filter((t) => t.status === "completed").length;
  const overdue = deptTasks.filter((t) => t.status === "overdue").length;
  const pending = deptTasks.filter(
    (t) => t.status !== "completed" && t.status !== "archived"
  ).length;
  const completionRate = deptTasks.length
    ? Math.round((completed / deptTasks.length) * 100)
    : 0;

  const ranked = [...deptMembers].sort(
    (a, b) => b.performanceRating - a.performanceRating
  );

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Performance Dashboard</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Live productivity for {departmentOf(me.departmentId)?.name || "your department"}.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Completion rate", value: `${completionRate}%` },
          { label: "Pending tasks", value: pending },
          { label: "Overdue", value: overdue },
          { label: "Completed", value: completed },
        ].map((s) => (
          <div key={s.label} className="org-card org-stat">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a97ab]">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-[#21386B]">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Task completion</h3>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e8eef2]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#21386B] to-[#76bec5]"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-[#5b6b85]">
          {completed} of {deptTasks.length} department tasks completed.
        </p>
      </section>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Employee rankings</h3>
        <div className="mt-3 space-y-2">
          {ranked.map((e, idx) => {
            const theirs = state.tasks.filter((t) => t.assignedTo === e.id);
            const done = theirs.filter((t) => t.status === "completed").length;
            return (
              <div
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7fafb] px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21386B] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#21386B]">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="text-xs text-[#5b6b85]">
                      {e.jobTitle} · {done}/{theirs.length} tasks done
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#2f7f88]">
                  {e.performanceRating.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Goals & OKRs (sample)</h3>
        <ul className="mt-3 space-y-2 text-sm text-[#3d4d68]">
          <li className="rounded-xl border border-[rgba(33,56,107,0.08)] px-3 py-2.5">
            Company: Ship Organisation HQ to all teams — KR: 90% weekly active usage
          </li>
          <li className="rounded-xl border border-[rgba(33,56,107,0.08)] px-3 py-2.5">
            Department: Reduce overdue tasks below 5% — KR: weekly manager review
          </li>
          <li className="rounded-xl border border-[rgba(33,56,107,0.08)] px-3 py-2.5">
            Individual ({me.firstName}): Complete assigned high-priority work on time
          </li>
        </ul>
      </section>
    </div>
  );
}
