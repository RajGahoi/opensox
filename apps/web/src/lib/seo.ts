import type { Metadata } from "next";

export const SITE_URL = "https://opensox.ai";

export function canonicalMetadata(pathname: string): Metadata {
  return {
    alternates: { canonical: new URL(pathname, SITE_URL).toString() },
  };
}
