"use client";

import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ListTodo,
  Users,
} from "lucide-react";
import { useOrganisation } from "@/lib/organisation/store";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardView() {
  const {
    me,
    state,
    myTasks,
    departmentOf,
    teamOf,
    employeeOf,
    toggleClock,
  } = useOrganisation();

  const dept = departmentOf(me.departmentId);
  const team = teamOf(me.teamId);
  const todayMeetings = state.meetings
    .filter((m) => m.attendeeIds.includes(me.id) || m.hostId === me.id)
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
    .slice(0, 4);
  const openTasks = myTasks.filter((t) => t.status !== "completed" && t.status !== "archived");
  const overdue = myTasks.filter((t) => t.status === "overdue").length;
  const pinned = state.announcements.filter((a) => a.pinned).concat(
    state.announcements.filter((a) => !a.pinned)
  )[0];
  const teamSize = state.employees.filter((e) => e.teamId === me.teamId).length;

  return (
    <div className="space-y-4">
      <section className="org-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#5b6b85]">
              {dept?.name} · {team?.name} · {me.jobTitle}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#21386B] sm:text-2xl">
              Your workday, in one place
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b85]">
              Track tasks, meetings, leave, and team updates without leaving Organisation HQ.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleClock}
            className={`org-btn ${me && state.clockedIn ? "org-btn--ghost" : "org-btn--primary"}`}
          >
            <Clock3 className="h-4 w-4" />
            {state.clockedIn ? "Clock out" : "Clock in"}
          </button>
        </div>
        {state.clockedIn && state.clockedInAt && (
          <p className="mt-3 text-xs font-semibold text-[#2f7f88]">
            Clocked in since {formatWhen(state.clockedInAt)}
          </p>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "My open tasks", value: openTasks.length, href: "/dashboard/organisation/tasks", icon: ListTodo },
          { label: "Overdue", value: overdue, href: "/dashboard/organisation/tasks", icon: CheckCircle2 },
          { label: "Leave balance", value: `${me.leaveBalance}d`, href: "/dashboard/organisation/leave", icon: FileText },
          { label: "Team size", value: teamSize, href: "/dashboard/organisation/directory", icon: Users },
        ].map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="org-card org-stat block no-underline transition hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a97ab]">
                {label}
              </p>
              <Icon className="h-4 w-4 text-[#76bec5]" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-[#21386B]">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="org-card p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-bold text-[#21386B]">My tasks</h3>
            <Link href="/dashboard/organisation/tasks" className="text-xs font-bold text-[#2f7f88]">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {openTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="border border-[rgba(33,56,107,0.08)] bg-[#fafbfc] px-3 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[#21386B]">{task.title}</p>
                  <span className={`org-status-pill org-status-pill--${task.status}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#5b6b85]">
                  Due {formatWhen(task.dueDate)} · {task.priority} priority · {task.progress}%
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8eef2]">
                  <div
                    className="h-full rounded-full bg-[#76bec5]"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {openTasks.length === 0 && (
              <p className="py-6 text-center text-sm text-[#5b6b85]">You&apos;re all caught up.</p>
            )}
          </div>
        </section>

        <div className="space-y-4">
          <section className="org-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#21386B]" />
              <h3 className="font-bold text-[#21386B]">Meetings</h3>
            </div>
            <div className="space-y-2">
              {todayMeetings.map((m) => (
                <a
                  key={m.id}
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-[rgba(33,56,107,0.08)] px-3 py-2.5 no-underline transition hover:bg-[#f7fafb]"
                >
                  <p className="text-sm font-semibold text-[#21386B]">{m.title}</p>
                  <p className="text-xs text-[#5b6b85]">
                    {formatWhen(m.startsAt)} · {m.provider}
                  </p>
                </a>
              ))}
            </div>
          </section>

          <section className="org-card p-5">
            <h3 className="font-bold text-[#21386B]">Latest announcement</h3>
            {pinned ? (
              <>
                <p className="mt-2 text-sm font-semibold text-[#21386B]">{pinned.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#5b6b85]">{pinned.body}</p>
                <p className="mt-2 text-xs text-[#8a97ab]">
                  By {employeeOf(pinned.authorId)?.firstName} · {formatWhen(pinned.createdAt)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-[#5b6b85]">No announcements yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
