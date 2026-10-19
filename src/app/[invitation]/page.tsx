import { InvitationPage, firstParam, invitationMetadata } from "@/lib/invitation-page";

type Props = {
  params: Promise<{ invitation: string }>;
  searchParams: Promise<{ to?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ invitation }, { to }] = await Promise.all([params, searchParams]);
  return invitationMetadata(invitation, firstParam(to));
}

/** https://host/<slug>?to=Nama+Tamu */
export default async function Page({ params, searchParams }: Props) {
  const [{ invitation }, { to }] = await Promise.all([params, searchParams]);
  return <InvitationPage slug={invitation} to={firstParam(to)} />;
}
