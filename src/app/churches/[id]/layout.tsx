import type { Metadata } from "next";
import { mockJobs } from "@/lib/mock-data";

interface ChurchLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

function getBasicChurchInfo(churchId: string): { id: string; name: string; location?: string } | null {
  const churchJob = mockJobs.find((job) => job.church.id === churchId);
  if (!churchJob) return null;
  return {
    id: churchId,
    name: churchJob.church.name,
    location: churchJob.location,
  };
}

export async function generateMetadata({ params }: ChurchLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const church = getBasicChurchInfo(id);

  if (!church) {
    return {
      title: "Church Not Found - SoapBox Jobs",
      description: "The requested church profile could not be found.",
    };
  }

  const jobCount = mockJobs.filter((job) => job.church.id === id).length;
  const title = `${church.name} - SoapBox Jobs`;
  const description = `Explore ministry opportunities at ${church.name}${church.location ? ` in ${church.location}` : ""}. ${jobCount} open position${jobCount !== 1 ? "s" : ""} available.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function ChurchLayout({ children }: ChurchLayoutProps) {
  return <>{children}</>;
}
