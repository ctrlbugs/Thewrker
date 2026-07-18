"use client";

import { use } from "react";
import Link from "next/link";
import UserProfileView from "@/components/profile/UserProfileView";
import BrandLogo from "@/components/brand-logo";

type Props = {
  params: Promise<{ username: string }>;
};

export default function PublicProfilePage({ params }: Props) {
  const { username } = use(params);

  return (
    <div className="min-h-screen bg-[#eaf1f3] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto mb-5 flex max-w-[920px] items-center justify-between">
        <Link href="/" className="inline-flex">
          <BrandLogo variant="dark" size="sm" />
        </Link>
        <Link
          href="/dashboard/talent/profile"
          className="text-sm font-semibold text-[#21386B] transition hover:text-[#76BEC5]"
        >
          My profile
        </Link>
      </div>
      <UserProfileView username={username} showBack allowEdit={false} />
    </div>
  );
}
