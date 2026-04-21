// src/app/page.tsx
"use client";

import { useState } from "react";
import { ListChecks, CalendarCheck, LayoutDashboard } from "lucide-react";
import ListPage from "@/components/mistakes/ListPage";
import TodayPage from "@/components/review/TodayPage";
import DashboardPage from "@/components/dashboard/DashboardPage";
import { useMistakeStore } from "@/store/useMistakeStore";

type Tab = "list" | "today" | "dashboard";

export default function Home() {
  const [tab, setTab] = useState<Tab>("list");
  const dueCount = useMistakeStore((s) => s.getDueToday().length);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(var(--bottom-nav-h) + 16px)" }}>
        {tab === "list" && <ListPage />}
        {tab === "today" && <TodayPage />}
        {tab === "dashboard" && <DashboardPage />}
      </main>

      <nav
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          height: "var(--bottom-nav-h)",
          background: "var(--bg-card)",
          borderTop: "0.5px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 100,
        }}
      >
        {(
          [
            { key: "list", icon: ListChecks, label: "一覧", badge: 0 },
            { key: "today", icon: CalendarCheck, label: "今日の復習", badge: dueCount },
            { key: "dashboard", icon: LayoutDashboard, label: "統計", badge: 0 },
          ] as { key: Tab; icon: React.ElementType; label: string; badge: number }[]
        ).map(({ key, icon: Icon, label, badge }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4, background: "none", border: "none",
                padding: "8px 0",
                color: active ? "var(--accent)" : "var(--text-tertiary)",
                fontSize: 11, fontWeight: active ? 500 : 400,
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <Icon size={22} strokeWidth={active ? 2 : 1.5} />
                {badge > 0 && (
                  <span
                    style={{
                      position: "absolute", top: -4, right: -6,
                      background: "var(--danger)", color: "#fff",
                      fontSize: 9, fontWeight: 700,
                      borderRadius: 99, minWidth: 16, height: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 3px", lineHeight: 1,
                    }}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
