import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/contact");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
