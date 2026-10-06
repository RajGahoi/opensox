import { loadAllPrograms, getAllTags } from "@/data/oss-programs";
import ProgramsList from "./ProgramsList";
import { canonicalMetadata } from "@/lib/seo";

export const metadata = canonicalMetadata("/dashboard/oss-programs");

export const revalidate = 3600;

export default async function Page() {
  const [programs, tags] = await Promise.all([loadAllPrograms(), getAllTags()]);

  return <ProgramsList programs={programs} tags={tags} />;
}
