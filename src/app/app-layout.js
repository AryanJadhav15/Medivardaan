"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./sidebar";
import HeaderLayout from "./headerlayout";

export default function AppLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const isLoginPage = pathname === "/";

    if (isLoginPage) return children;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                onMenuClick={() => !sidebarOpen && setSidebarOpen(true)}
            />

            {/* Content Area */}
            <div
                className={`flex flex-col flex-1 min-w-0 transition-margin duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-16"
                }`}
            >
                <HeaderLayout
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                {/* ✅ Main scroll fix - Reduced top spacing as requested */}
                <main className="flex-1 mt-16 overflow-y-auto bg-gradient-to-br from-[#4DB8AC]/3 to-[#1E6B8C]/3 dark:from-[#18122B] dark:to-[#18122B] px-6 pb-6 pt-2 space-y-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
