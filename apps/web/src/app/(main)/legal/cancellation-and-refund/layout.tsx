import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/legal/cancellation-and-refund");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
