import { redirect } from "next/navigation";

export default function OwnerPropertiesRedirect() {
  redirect("/owner/dashboard");
}
