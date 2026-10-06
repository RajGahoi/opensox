import type { Metadata } from "next";

// Utility pages may contain links to public content, but should not appear in search.
export const NOINDEX_METADATA: Metadata = {
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};
