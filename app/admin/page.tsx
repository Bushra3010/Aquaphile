import type { Metadata } from "next";
import AdminApp from "./AdminApp";

export const metadata: Metadata = {
  title: "Aquaphil Admin",
  description: "Aquaphil admin console — orders, service dispatch, customers, technicians, catalogue and offers.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminApp />;
}
