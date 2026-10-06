import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/legal/terms");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
