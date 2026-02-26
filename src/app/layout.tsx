import "@/styles/globals.css";
import { cookies } from "next/headers";
import GlobalToastHandler from "./_components/GlobalToastHandler";
import { Toaster } from "sonner";
import Preloader from "@/components/Preloader";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const toastType = cookieStore.get("toast")?.value || null;

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Toaster richColors position="top-right" />
        <GlobalToastHandler toastType={toastType} />
        {children}
        <Preloader />
      </body>
    </html>
  );
}