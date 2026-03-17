import React from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const PageHeader = ({ title, icon: Icon = Settings, className }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-gray-200 dark:border-[#443C68]/50 pb-4 mb-6",
        className,
      )}
    >
      <div className="w-8 h-8 rounded-full bg-[#0f7396]/10 dark:bg-medivardaan-purple/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#0f7396] dark:text-medivardaan-purple animate-spin-slow" />
      </div>
      <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
        {title}
      </h1>
    </div>
  );
};
