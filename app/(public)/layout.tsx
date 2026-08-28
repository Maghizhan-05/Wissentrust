import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: LayoutProps<"/">) {
  const profile = await getProfile();
  const navUser = profile
    ? { participantId: profile.participant_id, isAdmin: profile.role === "admin" }
    : null;

  return (
    <>
      <Navbar user={navUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
