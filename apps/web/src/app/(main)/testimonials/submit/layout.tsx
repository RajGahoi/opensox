import { Suspense } from "react";
import { NOINDEX_METADATA } from "@/lib/noindex";

export const metadata = NOINDEX_METADATA;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
