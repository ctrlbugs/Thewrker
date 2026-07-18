"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useOrganisation } from "@/lib/organisation/store";
import type { OrgMeeting } from "@/lib/organisation/types";

export default function MeetingsView() {
  const { state, me, employeeOf, addMeeting } = useOrganisation();
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [durationMins, setDurationMins] = useState(30);
  const [provider, setProvider] =
    useState<OrgMeeting["provider"]>("Google Meet");
  const [attendees, setAttendees] = useState<string[]>([me.id]);

  const meetings = [...state.meetings].sort(
    (a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)
  );

  const toggleAttendee = (id: string) => {
    setAttendees((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startsAt || attendees.length === 0) return;
    addMeeting({
      title: title.trim(),
      agenda: agenda.trim(),
      startsAt,
      durationMins,
      provider,
      attendeeIds: attendees,
    });
    setTitle("");
    setAgenda("");
    setStartsAt("");
  };

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Meetings & Team Briefings</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Schedule with Meet, Zoom, or Teams — agenda, attendees, and join links.
        </p>
      </section>

      <section className="org-card p-5">
        <h3 className="font-bold text-[#21386B]">Schedule meeting</h3>
        <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="org-input md:col-span-2"
            placeholder="Meeting title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="org-input md:col-span-2 min-h-[80px]"
            placeholder="Agenda"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
          />
          <input
            type="datetime-local"
            className="org-input"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
          <select
            className="org-input"
            value={durationMins}
            onChange={(e) => setDurationMins(Number(e.target.value))}
          >
            {[15, 30, 45, 60, 90].map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
          <select
            className="org-input md:col-span-2"
            value={provider}
            onChange={(e) =>
              setProvider(e.target.value as OrgMeeting["provider"])
            }
          >
            <option>Google Meet</option>
            <option>Zoom</option>
            <option>Microsoft Teams</option>
          </select>
          <div className="md:col-span-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#8a97ab]">
              Attendees
            </p>
            <div className="flex flex-wrap gap-2">
              {state.employees.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleAttendee(e.id)}
                  className={`org-chip ${
                    attendees.includes(e.id) ? "!bg-[#21386B] !text-white" : ""
                  }`}
                >
                  {e.firstName} {e.lastName}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="org-btn org-btn--primary md:col-span-2">
            Create meeting
          </button>
        </form>
      </section>

      <div className="space-y-3">
        {meetings.map((m) => (
          <article key={m.id} className="org-card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-[#21386B]">{m.title}</h3>
                <p className="mt-1 text-sm text-[#5b6b85]">{m.agenda}</p>
                <p className="mt-2 text-xs text-[#8a97ab]">
                  {new Date(m.startsAt).toLocaleString()} · {m.durationMins} min · Host{" "}
                  {employeeOf(m.hostId)?.firstName}
                </p>
                <p className="mt-1 text-xs text-[#5b6b85]">
                  {m.attendeeIds
                    .map((id) => employeeOf(id)?.firstName)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="org-btn org-btn--primary"
              >
                Join {m.provider}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
