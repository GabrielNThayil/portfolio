import type { Metadata } from "next";
import { BlogAdmin } from "@/components/BlogAdmin";
import { Starfield } from "@/components/Starfield";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog admin — Gabriel Thayil",
  robots: { index: false, follow: false }
};

export default async function BlogAdminPage() {
  return (
    <main>
      <Starfield />
      <div className="nebula-layer" aria-hidden="true" />
      <BlogAdmin signedIn={await isAdmin()} configured={adminConfigured()} />
    </main>
  );
}
