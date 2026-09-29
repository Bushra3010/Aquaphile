import type { Metadata } from "next";
import TechnicianApp from "./TechnicianApp";

export const metadata: Metadata = {
  title: "Aquaphil Partner",
  description: "Aquaphil technician app — jobs, van inventory and earnings.",
};

export default function Page() {
  return <TechnicianApp />;
}
