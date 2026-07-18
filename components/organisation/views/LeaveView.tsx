"use client";

import { useState } from "react";
import { useOrganisation } from "@/lib/organisation/store";
import type { LeaveType } from "@/lib/organisation/types";

export default function LeaveView() {
  const {
    me,
    state,
    employeeOf,
    departmentOf,
    toggleClock,
    requestLeave,
    decideLeave,
  } = useOrganisation();
  const [type, setType] = useState<LeaveType>("annual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const mine = state.leaveRequests.filter((l) => l.employeeId === me.id);
  const canApprove = Boolean(me.isManager);
  const pendingForManager = state.leaveRequests.filter((l) => {
    if (l.status !== "pending" || !canApprove) return false;
    const emp = employeeOf(l.employeeId);
    if (!emp || emp.id === me.id) return false;
    if (emp.managerId === me.id) return true;
    return departmentOf(emp.departmentId)?.headId === me.id;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !reason.trim()) return;
    requestLeave({ type, from, to, reason: reason.trim() });
    setReason("");
  };

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#21386B]">Leave & Attendance</h2>
            <p className="mt-1 text-sm text-[#5b6b85]">
              Clock in/out, request leave, and approve team requests.
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2f7f88]">
              Leave balance: {me.leaveBalance} days
            </p>
          </div>
          <button
            type="button"
            onClick={toggleClock}
            className={`org-btn ${state.clockedIn ? "org-btn--ghost" : "org-btn--primary"}`}
          >
            {state.clockedIn ? "Clock out" : "Clock in"}
          </button>
        </div>
      </section>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Request leave</h3>
        <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-2">
          <select
            className="org-input"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
          >
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="personal">Personal</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="org-input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            <input
              type="date"
              className="org-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <textarea
            className="org-input md:col-span-2 min-h-[80px]"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button type="submit" className="org-btn org-btn--primary md:col-span-2">
            Submit request
          </button>
        </form>
      </section>

      {canApprove && (
        <section className="org-card p-5">
          <h3 className="font-bold text-[#21386B]">Pending approvals</h3>
          <div className="mt-3 space-y-2">
            {pendingForManager.length === 0 && (
              <p className="text-sm text-[#5b6b85]">No pending leave requests.</p>
            )}
            {pendingForManager.map((l) => {
              const emp = employeeOf(l.employeeId);
              return (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(33,56,107,0.08)] px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#21386B]">
                      {emp?.firstName} {emp?.lastName} · {l.type}
                    </p>
                    <p className="text-xs text-[#5b6b85]">
                      {l.from} → {l.to} · {l.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="org-btn org-btn--primary !min-h-9 !px-3 text-xs"
                      onClick={() => decideLeave(l.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="org-btn org-btn--ghost !min-h-9 !px-3 text-xs"
                      onClick={() => decideLeave(l.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">My leave history</h3>
        <div className="mt-3 space-y-2">
          {mine.map((l) => (
            <div
              key={l.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f7fafb] px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-semibold capitalize text-[#21386B]">
                  {l.type} leave
                </p>
                <p className="text-xs text-[#5b6b85]">
                  {l.from} → {l.to} · {l.reason}
                </p>
              </div>
              <span className={`org-status-pill org-status-pill--${l.status}`}>
                {l.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
