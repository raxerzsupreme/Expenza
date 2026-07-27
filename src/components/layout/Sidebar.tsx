import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  Database,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/data", label: "Data", icon: Database },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className={cn(
          "fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-md border md:hidden cursor-pointer",
          "transition-all duration-300 hover:shadow-lg active:scale-95",
          mobileOpen && "rotate-90"
        )}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Expenza</span>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer relative",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover-slide"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary transition-all duration-300" />
                  )}
                  <Icon className={cn("h-4 w-4 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/40 text-center">Expenza v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
