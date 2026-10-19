import { InvitationPage, invitationMetadata } from "@/lib/invitation-page";

type Props = { params: Promise<{ invitation: string }> };

export async function generateMetadata({ params }: Props) {
  const { invitation } = await params;
  return invitationMetadata(invitation);
}

export default async function Page({ params }: Props) {
  const { invitation } = await params;
  return <InvitationPage slug={invitation} />;
}
