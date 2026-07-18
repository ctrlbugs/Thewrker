import type { Metadata } from "next";
import LoginLanding from "@/components/auth/login-landing";

export const metadata: Metadata = {
  title: "TheWrker — The Future of Workspace and Job Searching Made Simple",
  description:
    "Sign in to TheWrker. Digital workspace, organisation login, and job searching made simple — thewrker.com",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <LoginLanding />;
}
