import CareersPage from "@/components/careers/CareersPage";

export const metadata = {
  title: "Careers - Inkarp Instruments",
  description:
    "Build your career at Inkarp. Join a team where learning, ownership, and impact define growth.",
};

export default async function Careers() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return <CareersPage />;
}
