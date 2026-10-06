import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/legal/privacy");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
