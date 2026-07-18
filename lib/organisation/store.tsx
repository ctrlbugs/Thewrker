"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSeedState } from "./seed";
import type {
  LeaveType,
  OrgLeaveRequest,
  OrgMeeting,
  OrgState,
  OrgTask,
  TaskPriority,
  TaskStatus,
} from "./types";

const STORAGE_KEY = "thewrker.organisation.v1";

type OrganisationContextValue = {
  state: OrgState;
  ready: boolean;
  me: OrgState["employees"][number];
  departmentOf: (id: string) => OrgState["departments"][number] | undefined;
  teamOf: (id: string) => OrgState["teams"][number] | undefined;
  employeeOf: (id: string) => OrgState["employees"][number] | undefined;
  myTasks: OrgTask[];
  unreadCount: number;
  resetDemo: () => void;
  switchUser: (employeeId: string) => void;
  toggleClock: () => void;
  addTask: (input: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assignedTo: string;
  }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, progress?: number) => void;
  addTaskComment: (taskId: string, text: string) => void;
  requestLeave: (input: {
    type: LeaveType;
    from: string;
    to: string;
    reason: string;
  }) => void;
  decideLeave: (leaveId: string, status: "approved" | "rejected") => void;
  addMeeting: (input: {
    title: string;
    agenda: string;
    startsAt: string;
    durationMins: number;
    provider: OrgMeeting["provider"];
    attendeeIds: string[];
  }) => void;
  addAnnouncement: (input: {
    title: string;
    body: string;
    category: OrgState["announcements"][number]["category"];
  }) => void;
  sendMessage: (channelId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const OrganisationContext = createContext<OrganisationContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function pushNotification(
  state: OrgState,
  note: Omit<OrgState["notifications"][number], "id" | "createdAt" | "read">
): OrgState {
  return {
    ...state,
    notifications: [
      {
        id: uid("n"),
        createdAt: new Date().toISOString(),
        read: false,
        ...note,
      },
      ...state.notifications,
    ].slice(0, 40),
  };
}

export function OrganisationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrgState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw) as OrgState);
      } else {
        setState(createSeedState());
      }
    } catch {
      setState(createSeedState());
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const mutate = useCallback((updater: (prev: OrgState) => OrgState) => {
    setState((prev) => (prev ? updater(prev) : prev));
  }, []);

  const value = useMemo<OrganisationContextValue | null>(() => {
    if (!state) return null;

    const me =
      state.employees.find((e) => e.id === state.currentUserId) ??
      state.employees[0];

    return {
      state,
      ready,
      me,
      departmentOf: (id) => state.departments.find((d) => d.id === id),
      teamOf: (id) => state.teams.find((t) => t.id === id),
      employeeOf: (id) => state.employees.find((e) => e.id === id),
      myTasks: state.tasks.filter((t) => t.assignedTo === me.id),
      unreadCount: state.notifications.filter((n) => !n.read).length,
      resetDemo: () => setState(createSeedState()),
      switchUser: (employeeId) =>
        mutate((prev) => ({ ...prev, currentUserId: employeeId })),
      toggleClock: () =>
        mutate((prev) => {
          const nextIn = !prev.clockedIn;
          let next = {
            ...prev,
            clockedIn: nextIn,
            clockedInAt: nextIn ? new Date().toISOString() : undefined,
          };
          next = pushNotification(next, {
            title: nextIn ? "Clocked in" : "Clocked out",
            body: nextIn
              ? "Attendance started for today."
              : "Attendance session ended.",
            type: "system",
            href: "/dashboard/organisation/leave",
          });
          return next;
        }),
      addTask: (input) =>
        mutate((prev) => {
          const task: OrgTask = {
            id: uid("task"),
            title: input.title,
            description: input.description,
            notes: "",
            priority: input.priority,
            dueDate: new Date(input.dueDate).toISOString(),
            assignedBy: prev.currentUserId,
            assignedTo: input.assignedTo,
            status: "new",
            progress: 0,
            createdAt: new Date().toISOString(),
            comments: [],
          };
          let next: OrgState = { ...prev, tasks: [task, ...prev.tasks] };
          next = pushNotification(next, {
            title: "New task assigned",
            body: `${task.title} was assigned.`,
            type: "task",
            href: "/dashboard/organisation/tasks",
          });
          return next;
        }),
      updateTaskStatus: (taskId, status, progress) =>
        mutate((prev) => {
          const tasks = prev.tasks.map((t) => {
            if (t.id !== taskId) return t;
            const nextProgress =
              progress ??
              (status === "completed"
                ? 100
                : status === "new"
                  ? 0
                  : t.progress);
            return { ...t, status, progress: nextProgress };
          });
          let next: OrgState = { ...prev, tasks };
          const task = tasks.find((t) => t.id === taskId);
          if (task && status === "completed") {
            next = pushNotification(next, {
              title: "Task completed",
              body: `${task.title} is done.`,
              type: "task",
              href: "/dashboard/organisation/tasks",
            });
          }
          return next;
        }),
      addTaskComment: (taskId, text) =>
        mutate((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    {
                      id: uid("c"),
                      authorId: prev.currentUserId,
                      text,
                      at: new Date().toISOString(),
                    },
                  ],
                }
              : t
          ),
        })),
      requestLeave: (input) =>
        mutate((prev) => {
          const leave: OrgLeaveRequest = {
            id: uid("l"),
            employeeId: prev.currentUserId,
            type: input.type,
            from: input.from,
            to: input.to,
            reason: input.reason,
            status: "pending",
            createdAt: new Date().toISOString(),
          };
          let next: OrgState = {
            ...prev,
            leaveRequests: [leave, ...prev.leaveRequests],
          };
          next = pushNotification(next, {
            title: "Leave request submitted",
            body: `${input.type} leave ${input.from} → ${input.to}`,
            type: "leave",
            href: "/dashboard/organisation/leave",
          });
          return next;
        }),
      decideLeave: (leaveId, status) =>
        mutate((prev) => {
          const leaveRequests = prev.leaveRequests.map((l) =>
            l.id === leaveId ? { ...l, status } : l
          );
          const leave = leaveRequests.find((l) => l.id === leaveId);
          let employees = prev.employees;
          if (leave && status === "approved") {
            const days = Math.max(
              1,
              Math.round(
                (new Date(leave.to).getTime() - new Date(leave.from).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            );
            const today = new Date().toISOString().slice(0, 10);
            const activeNow = leave.from <= today && leave.to >= today;
            employees = prev.employees.map((e) =>
              e.id === leave.employeeId
                ? {
                    ...e,
                    leaveBalance: Math.max(0, e.leaveBalance - days),
                    status: activeNow ? "on-leave" : e.status,
                  }
                : e
            );
          }
          let next: OrgState = { ...prev, leaveRequests, employees };
          next = pushNotification(next, {
            title: status === "approved" ? "Leave approved" : "Leave rejected",
            body: "A leave request was updated.",
            type: "leave",
            href: "/dashboard/organisation/leave",
          });
          return next;
        }),
      addMeeting: (input) =>
        mutate((prev) => {
          const meeting: OrgMeeting = {
            id: uid("m"),
            title: input.title,
            agenda: input.agenda,
            startsAt: new Date(input.startsAt).toISOString(),
            durationMins: input.durationMins,
            hostId: prev.currentUserId,
            attendeeIds: input.attendeeIds,
            link:
              input.provider === "Zoom"
                ? "https://zoom.us/j/thewrker-meeting"
                : input.provider === "Microsoft Teams"
                  ? "https://teams.microsoft.com/l/meetup-join/thewrker"
                  : "https://meet.google.com/thewrker-meeting",
            provider: input.provider,
            notes: "",
          };
          let next: OrgState = {
            ...prev,
            meetings: [meeting, ...prev.meetings],
          };
          next = pushNotification(next, {
            title: "Meeting scheduled",
            body: meeting.title,
            type: "meeting",
            href: "/dashboard/organisation/meetings",
          });
          return next;
        }),
      addAnnouncement: (input) =>
        mutate((prev) => {
          const announcement = {
            id: uid("a"),
            title: input.title,
            body: input.body,
            authorId: prev.currentUserId,
            category: input.category,
            createdAt: new Date().toISOString(),
            pinned: false,
          };
          let next: OrgState = {
            ...prev,
            announcements: [announcement, ...prev.announcements],
          };
          next = pushNotification(next, {
            title: "Company announcement",
            body: announcement.title,
            type: "announcement",
            href: "/dashboard/organisation/announcements",
          });
          return next;
        }),
      sendMessage: (channelId, text) =>
        mutate((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: uid("msg"),
              channelId,
              authorId: prev.currentUserId,
              text,
              at: new Date().toISOString(),
            },
          ],
        })),
      markNotificationRead: (id) =>
        mutate((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        mutate((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        })),
    };
  }, [mutate, ready, state]);

  if (!value) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#76bec5] border-t-transparent" />
      </div>
    );
  }

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  );
}

export function useOrganisation() {
  const ctx = useContext(OrganisationContext);
  if (!ctx) {
    throw new Error("useOrganisation must be used within OrganisationProvider");
  }
  return ctx;
}
