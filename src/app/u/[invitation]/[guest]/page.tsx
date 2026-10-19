import { InvitationPage, invitationMetadata } from "@/lib/invitation-page";

type Props = { params: Promise<{ invitation: string; guest: string }> };

export async function generateMetadata({ params }: Props) {
  const { invitation, guest } = await params;
  return invitationMetadata(invitation, guest);
}

export default async function Page({ params }: Props) {
  const { invitation, guest } = await params;
  return <InvitationPage slug={invitation} guestSlug={guest} />;
}
