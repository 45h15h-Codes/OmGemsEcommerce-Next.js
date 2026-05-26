import { redirect } from "next/navigation";

// Old /partner/apply route redirects to the new public /apply/partner route
export default function LegacyPartnerApplyRedirect() {
  redirect("/apply/partner");
}
