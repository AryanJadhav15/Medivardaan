"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { setHeaderData } from "@/store/slices/headerSlice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [region, setRegion] = useState("0");
  const [period, setPeriod] = useState("All");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const periods = [
    { id: "D1", label: "Yesterday" },
    { id: "W1", label: "Last 7 Days" },
    { id: "M1", label: "30 Days" },
    { id: "Q1", label: "90 Days" },
    { id: "Y1", label: "365 Days" },
    { id: "All", label: "Grouped" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#4DB8AC]/10 via-[#1E6B8C]/10 to-[#4DB8AC]/10 dark:bg-gradient-to-r dark:from-[#393053] dark:via-[#443C68] dark:to-[#393053] border border-[#4DB8AC]/20 dark:border-[#443C68] rounded-lg shadow-sm px-6 py-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-medivardaan-blue dark:text-medivardaan-purple-light" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-end">
        {/* Region Selector */}
        <Select
          onValueChange={(value) => {
            setRegion(value);
            dispatch(setHeaderData({ region: value, period: null }));
          }}
          value={region}
        >
          <SelectTrigger className="w-[160px] bg-gradient-to-br from-[#4DB8AC]/5 to-[#1E6B8C]/5 dark:bg-gradient-to-br dark:from-[#393053] dark:to-[#443C68] border border-medivardaan-teal-light/30 dark:border-[#635985]/40 rounded-md text-sm font-medium dark:text-white">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {[
              { regionName: "All", regionValue: "0" },
              { regionName: "East", regionValue: "1" },
              { regionName: "West", regionValue: "2" },
              { regionName: "North", regionValue: "3" },
              { regionName: "South", regionValue: "4" },
              { regionName: "Central", regionValue: "5" },
            ].map((r) => (
              <SelectItem key={r.regionValue} value={r.regionValue}>
                {r.regionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period Buttons */}
        <div className="flex flex-wrap gap-2">
          {periods.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={period === p.id ? "default" : "outline"}
              onClick={() => {
                setPeriod(p.id);
                dispatch(setHeaderData({ region: null, period: p.id }));
              }}
              className="rounded-full px-4 dark:text-white dark:border-[#635985] dark:hover:bg-[#635985]/50 dark:data-[variant=default]:bg-[#635985] dark:data-[variant=default]:text-white"
            >
              {p.label}
            </Button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center mr-2 leading-tight">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-white/60">
              Admin Panel
            </span>
            <span className="text-[10px] font-semibold text-[#1E6B8C] dark:text-[#E9E9EB] mt-[1px]">
              {mounted
                ? `(${theme === "dark" ? "Dark Mode" : "Light Mode"})`
                : "\u00A0"}
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full px-3 text-red-600 dark:text-red-400 border-red-400 dark:border-red-400 hover:bg-red-100 dark:hover:bg-red-900"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>
    </header>
  );
}
