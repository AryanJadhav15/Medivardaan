"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";

export default function HeaderLayout({ onToggle, sidebarOpen }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    const user = useUser();

    return (
        <header
            className={cn(
                "fixed top-0 z-40 h-16 bg-card border-b border-border text-foreground flex items-center justify-between px-6 shadow-sm transition-[left,width] duration-300",
                sidebarOpen
                    ? "left-64 w-[calc(100%-16rem)]"
                    : "left-16 w-[calc(100%-4rem)]",
            )}
        >
            {/* Left Section: Menu + Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-md hover:bg-accent transition-colors duration-150"
                >
                    <Menu size={22} className="cursor-pointer" />
                </button>
            </div>
            {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}

            {/* Right Section: User + Theme Toggle + Logout */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center mr-1 leading-tight">
                    <span className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-white/60">
                        Admin Panel
                    </span>
                    <span className="text-[10px] font-semibold text-[#1E6B8C] dark:text-[#E9E9EB] mt-[1px]">
                        {mounted
                            ? theme === "dark"
                                ? "Dark Mode"
                                : "Light Mode"
                            : "\u00A0"}
                    </span>
                </div>
                <ThemeToggle />
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full px-3 text-red-600 hover:bg-destructive/10 dark:text-red-500 dark:hover:text-red-600 dark:hover:bg-white/90"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
            </div>
        </header>
    );
}
