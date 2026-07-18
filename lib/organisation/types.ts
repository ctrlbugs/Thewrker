export type EmploymentStatus = "active" | "on-leave" | "probation" | "inactive";
export type TaskStatus =
  | "new"
  | "in_progress"
  | "pending_review"
  | "completed"
  | "overdue"
  | "archived";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveType = "annual" | "sick" | "personal" | "unpaid";

export type OrgEmployee = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  departmentId: string;
  teamId: string;
  managerId?: string;
  status: EmploymentStatus;
  skills: string[];
  certifications: string[];
  leaveBalance: number;
  performanceRating: number;
  avatarColor: string;
  isManager?: boolean;
};

export type OrgDepartment = {
  id: string;
  name: string;
  headId: string;
  description: string;
  kpis: string[];
};

export type OrgTeam = {
  id: string;
  name: string;
  departmentId: string;
  leadId: string;
};

export type OrgTask = {
  id: string;
  title: string;
  description: string;
  notes: string;
  priority: TaskPriority;
  dueDate: string;
  assignedBy: string;
  assignedTo: string;
  status: TaskStatus;
  progress: number;
  createdAt: string;
  comments: { id: string; authorId: string; text: string; at: string }[];
};

export type OrgMeeting = {
  id: string;
  title: string;
  agenda: string;
  startsAt: string;
  durationMins: number;
  hostId: string;
  attendeeIds: string[];
  link: string;
  provider: "Google Meet" | "Zoom" | "Microsoft Teams";
  notes: string;
};

export type OrgLeaveRequest = {
  id: string;
  employeeId: string;
  type: LeaveType;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
};

export type OrgAnnouncement = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  category: "news" | "policy" | "hr" | "holiday" | "achievement";
  createdAt: string;
  pinned?: boolean;
};

export type OrgNotification = {
  id: string;
  title: string;
  body: string;
  type: "task" | "meeting" | "leave" | "announcement" | "deadline" | "system";
  createdAt: string;
  read: boolean;
  href?: string;
};

export type OrgChatMessage = {
  id: string;
  channelId: string;
  authorId: string;
  text: string;
  at: string;
};

export type OrgChannel = {
  id: string;
  name: string;
  departmentId?: string;
  kind: "department" | "team" | "general";
};

export type OrgState = {
  currentUserId: string;
  departments: OrgDepartment[];
  teams: OrgTeam[];
  employees: OrgEmployee[];
  tasks: OrgTask[];
  meetings: OrgMeeting[];
  leaveRequests: OrgLeaveRequest[];
  announcements: OrgAnnouncement[];
  notifications: OrgNotification[];
  channels: OrgChannel[];
  messages: OrgChatMessage[];
  clockedIn: boolean;
  clockedInAt?: string;
};
