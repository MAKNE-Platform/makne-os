import "@/styles/globals.css";
import { cookies } from "next/headers";
import ToastProvider from "./_components/ToastProvider";
import GlobalToastHandler from "./_components/GlobalToastHandler";


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
        {children}
        <ToastProvider />
        <GlobalToastHandler toastType={toastType} />
      </body>
    </html>
  );
}
