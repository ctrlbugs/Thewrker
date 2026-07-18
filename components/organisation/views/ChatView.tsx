"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useOrganisation } from "@/lib/organisation/store";

export default function ChatView() {
  const { state, me, employeeOf, sendMessage } = useOrganisation();
  const [channelId, setChannelId] = useState(state.channels[0]?.id || "");
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(
    () =>
      state.messages
        .filter((m) => m.channelId === channelId)
        .sort((a, b) => +new Date(a.at) - +new Date(b.at)),
    [channelId, state.messages]
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, channelId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !channelId) return;
    sendMessage(channelId, text.trim());
    setText("");
  };

  return (
    <div className="space-y-4">
      <section className="org-card p-5">
        <h2 className="text-lg font-bold text-[#21386B]">Team Collaboration</h2>
        <p className="mt-1 text-sm text-[#5b6b85]">
          Department channels and general chat — mentions-ready for daily coordination.
        </p>
      </section>

      <div className="org-card grid min-h-[520px] overflow-hidden lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-[rgba(33,56,107,0.08)] p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-[#8a97ab]">
            Channels
          </p>
          <div className="space-y-1">
            {state.channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannelId(ch.id)}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                  channelId === ch.id
                    ? "bg-[#e8f5f7] text-[#21386B]"
                    : "text-[#5b6b85] hover:bg-[#f7fafb]"
                }`}
              >
                # {ch.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-[420px] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => {
              const author = employeeOf(m.authorId);
              const mine = m.authorId === me.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      mine
                        ? "bg-[#e8f5f7] text-[#21386B]"
                        : "bg-[#f1f5f9] text-[#3d4d68]"
                    }`}
                  >
                    <p className="text-[11px] font-bold text-[#8a97ab]">
                      {author?.firstName} {author?.lastName}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed">{m.text}</p>
                    <p className="mt-1 text-[10px] text-[#94a3b8]">
                      {new Date(m.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={submit}
            className="flex gap-2 border-t border-[rgba(33,56,107,0.08)] p-3"
          >
            <input
              className="org-input"
              placeholder={`Message #${state.channels.find((c) => c.id === channelId)?.name || ""}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="org-btn org-btn--primary !min-w-[96px]">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
