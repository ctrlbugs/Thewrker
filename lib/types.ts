export interface ToolResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface WorkspaceModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  /** Saturated accent for Velonic-style headers / bars */
  accentStrong: string;
  href: string;
  formats: string[];
  features: string[];
}

export interface DevTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  accentColor?: string;
  accentStrong?: string;
}

export interface CorePillar {
  id: string;
  title: string;
  description: string;
  accentColor: string;
}
