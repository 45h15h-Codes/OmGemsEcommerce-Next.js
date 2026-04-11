import AccountShell from "@/components/account/AccountShell";
import React from "react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
