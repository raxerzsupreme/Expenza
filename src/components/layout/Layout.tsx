import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl p-4 pt-16 md:p-8 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
