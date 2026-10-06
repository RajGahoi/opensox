import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/legal/shipping-and-exchange");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
