"use client";

import { useMemo, useState } from "react";
import { useOrganisation } from "@/lib/organisation/store";
import type { TaskPriority, TaskStatus } from "@/lib/organisation/types";

const STATUSES: TaskStatus[] = [
  "new",
  "in_progress",
  "pending_review",
  "completed",
  "overdue",
  "archived",
];

export default function TasksView() {
  const {
    state,
    me,
    employeeOf,
    addTask,
    updateTaskStatus,
    addTaskComment,
  } = useOrganisation();
  const [filter, setFilter] = useState<"mine" | "all" | "team">("mine");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState(me.id);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const tasks = useMemo(() => {
    let list = [...state.tasks];
    if (filter === "mine") list = list.filter((t) => t.assignedTo === me.id);
    if (filter === "team") {
      list = list.filter((t) => {
        const person = employeeOf(t.assignedTo);
        return person?.departmentId === me.departmentId;
      });
    }
    return list.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  }, [employeeOf, filter, me.departmentId, me.id, state.tasks]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      assignedTo,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setAssignedTo(me.id);
  };

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Smart Task Management</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Assign work, track progress, comment, and move status from New to Completed.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["mine", "My tasks"],
              ["team", "Department"],
              ["all", "All tasks"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`org-chip ${filter === key ? "!bg-[#21386B] !text-white" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Create task</h3>
        <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="org-input md:col-span-2"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="org-input md:col-span-2 min-h-[88px]"
            placeholder="Description / notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="org-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            type="datetime-local"
            className="org-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <select
            className="org-input md:col-span-2"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            {state.employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName} — {e.jobTitle}
              </option>
            ))}
          </select>
          <button type="submit" className="org-btn org-btn--primary md:col-span-2">
            Assign task
          </button>
        </form>
      </section>

      <div className="space-y-3">
        {tasks.map((task) => {
          const assignee = employeeOf(task.assignedTo);
          const assigner = employeeOf(task.assignedBy);
          return (
            <article key={task.id} className="org-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-[#21386B]">{task.title}</h3>
                  <p className="mt-1 text-sm text-[#5b6b85]">{task.description}</p>
                  <p className="mt-2 text-xs text-[#8a97ab]">
                    To {assignee?.firstName} · By {assigner?.firstName} · Due{" "}
                    {new Date(task.dueDate).toLocaleString()}
                  </p>
                </div>
                <select
                  className="org-input !w-auto"
                  value={task.status}
                  onChange={(e) =>
                    updateTaskStatus(task.id, e.target.value as TaskStatus)
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="org-chip">{task.priority}</span>
                <span className="org-chip">{task.progress}% done</span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eef2]">
                <div
                  className="h-full rounded-full bg-[#76bec5]"
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="mt-4 space-y-2 border-t border-[rgba(33,56,107,0.08)] pt-3">
                {task.comments.map((c) => (
                  <p key={c.id} className="text-sm text-[#3d4d68]">
                    <span className="font-semibold text-[#21386B]">
                      {employeeOf(c.authorId)?.firstName}:
                    </span>{" "}
                    {c.text}
                  </p>
                ))}
                <div className="flex gap-2">
                  <input
                    className="org-input"
                    placeholder="Add a comment…"
                    value={commentDrafts[task.id] || ""}
                    onChange={(e) =>
                      setCommentDrafts((d) => ({ ...d, [task.id]: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    className="org-btn org-btn--ghost !min-w-[96px]"
                    onClick={() => {
                      const text = commentDrafts[task.id]?.trim();
                      if (!text) return;
                      addTaskComment(task.id, text);
                      setCommentDrafts((d) => ({ ...d, [task.id]: "" }));
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
