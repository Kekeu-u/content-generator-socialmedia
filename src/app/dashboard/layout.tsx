import type { Metadata } from "next";
import Sidebar from "@/components/features/Sidebar";
import Header from "@/components/features/Header";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard administrativo - Content Generator",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
