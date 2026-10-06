import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/pricing");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
