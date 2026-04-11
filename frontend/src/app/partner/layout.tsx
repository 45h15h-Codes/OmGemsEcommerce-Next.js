import PartnerShell from "@/components/partner/PartnerShell";
import React from "react";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <PartnerShell>{children}</PartnerShell>;
}
