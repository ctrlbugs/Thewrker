import type { Metadata } from "next";
import LoginLanding from "@/components/auth/login-landing";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to TheWrker — your digital workspace and job search platform. Continue with Google or join your organisation workspace.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <LoginLanding />;
}
