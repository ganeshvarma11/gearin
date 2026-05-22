import { notFound } from "next/navigation";

import { ContactSection } from "@/components/profile/contact-section";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabsPanel } from "@/components/profile/profile-tabs-panel";
import { getProfileByUsername } from "@/lib/data";

export default async function CreatorProfilePage({
  params
}: {
  params: { username: string };
}) {
  const { username } = params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <main>
      <ProfileHeader profile={profile} />
      <ProfileTabsPanel profile={profile} />
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ContactSection profile={profile} />
      </div>
    </main>
  );
}
