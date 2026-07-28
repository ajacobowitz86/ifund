import { redirect } from "next/navigation";

/** Keep /complete as an alias of the main preview experience. */
export default function CompletePage() {
  redirect("/");
}
