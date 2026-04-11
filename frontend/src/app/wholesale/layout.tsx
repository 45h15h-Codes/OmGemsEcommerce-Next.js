import WholesaleShell from "@/components/wholesale/WholesaleShell";
import React from "react";

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <WholesaleShell>{children}</WholesaleShell>;
}
