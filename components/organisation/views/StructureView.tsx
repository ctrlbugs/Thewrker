"use client";

import { useOrganisation } from "@/lib/organisation/store";

export default function StructureView() {
  const { state, employeeOf } = useOrganisation();

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Organization Structure</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Departments, teams, heads, and live counts of people, tasks, and projects.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {state.departments.map((dept) => {
          const head = employeeOf(dept.headId);
          const members = state.employees.filter((e) => e.departmentId === dept.id);
          const teams = state.teams.filter((t) => t.departmentId === dept.id);
          const tasks = state.tasks.filter((t) =>
            members.some((m) => m.id === t.assignedTo)
          );
          const activeProjects = tasks.filter(
            (t) => t.status !== "completed" && t.status !== "archived"
          ).length;
          const completed = tasks.filter((t) => t.status === "completed").length;
          const avgRating =
            members.reduce((sum, m) => sum + m.performanceRating, 0) /
            Math.max(members.length, 1);

          return (
            <article key={dept.id} className="org-card p-5">
              <h3 className="text-base font-bold text-[#21386B]">{dept.name}</h3>
              <p className="mt-1 text-sm text-[#5b6b85]">{dept.description}</p>
              <p className="mt-3 text-sm text-[#3d4d68]">
                Head: {head?.firstName} {head?.lastName}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-[#f7fafb] px-3 py-2">
                  <p className="text-xs text-[#8a97ab]">Employees</p>
                  <p className="font-bold text-[#21386B]">{members.length}</p>
                </div>
                <div className="rounded-xl bg-[#f7fafb] px-3 py-2">
                  <p className="text-xs text-[#8a97ab]">Active work</p>
                  <p className="font-bold text-[#21386B]">{activeProjects}</p>
                </div>
                <div className="rounded-xl bg-[#f7fafb] px-3 py-2">
                  <p className="text-xs text-[#8a97ab]">Completed</p>
                  <p className="font-bold text-[#21386B]">{completed}</p>
                </div>
                <div className="rounded-xl bg-[#f7fafb] px-3 py-2">
                  <p className="text-xs text-[#8a97ab]">Avg rating</p>
                  <p className="font-bold text-[#21386B]">{avgRating.toFixed(1)}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a97ab]">
                  Teams
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {teams.map((t) => (
                    <span key={t.id} className="org-chip">
                      {t.name} · Lead {employeeOf(t.leadId)?.firstName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a97ab]">
                  KPIs
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {dept.kpis.map((k) => (
                    <span key={k} className="org-chip">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
