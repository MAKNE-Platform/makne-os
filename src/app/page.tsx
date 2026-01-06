import { redirect } from "next/navigation";

export default function HomePage() {
  // TEMP: replace with real role check later
  redirect("/dashboard/creator");
}
