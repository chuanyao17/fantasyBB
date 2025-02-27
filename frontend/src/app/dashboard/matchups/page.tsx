import { cookies } from "next/headers";
import MatchupsClient from "@/components/MatchupsClient";
import RefreshToken from "@/components/RefreshToken";

export default async function MatchupsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <main className="min-h-screen pixel-bg">
      {token && <RefreshToken token={token} />}
      <MatchupsClient />
    </main>
  );
}
