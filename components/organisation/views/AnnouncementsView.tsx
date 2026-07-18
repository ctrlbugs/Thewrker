"use client";

import { useState } from "react";
import { useOrganisation } from "@/lib/organisation/store";
import type { OrgState } from "@/lib/organisation/types";

export default function AnnouncementsView() {
  const { state, me, employeeOf, addAnnouncement } = useOrganisation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] =
    useState<OrgState["announcements"][number]["category"]>("news");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addAnnouncement({ title: title.trim(), body: body.trim(), category });
    setTitle("");
    setBody("");
  };

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Company Announcements</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          News, policy updates, holidays, HR notes, and team achievements.
        </p>
      </section>

      {me.isManager && (
        <section className="org-card p-5">
          <h3 className="font-bold text-[#21386B]">Publish announcement</h3>
          <form onSubmit={submit} className="mt-3 grid gap-3">
            <input
              className="org-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <select
              className="org-input"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as OrgState["announcements"][number]["category"]
                )
              }
            >
              <option value="news">Company News</option>
              <option value="policy">Policy</option>
              <option value="hr">HR</option>
              <option value="holiday">Holiday</option>
              <option value="achievement">Achievement</option>
            </select>
            <textarea
              className="org-input min-h-[100px]"
              placeholder="Announcement body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <button type="submit" className="org-btn org-btn--primary">
              Publish
            </button>
          </form>
        </section>
      )}

      <div className="space-y-3">
        {state.announcements.map((a) => (
          <article key={a.id} className="org-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="org-chip capitalize">{a.category}</span>
              {a.pinned && <span className="org-chip !bg-[#21386B] !text-white">Pinned</span>}
            </div>
            <h3 className="mt-2 text-base font-bold text-[#21386B]">{a.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6b85]">{a.body}</p>
            <p className="mt-3 text-xs text-[#8a97ab]">
              {employeeOf(a.authorId)?.firstName} {employeeOf(a.authorId)?.lastName} ·{" "}
              {new Date(a.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
