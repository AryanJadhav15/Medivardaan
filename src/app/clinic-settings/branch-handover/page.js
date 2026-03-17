"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BranchHandover() {
  const [handoverBranch, setHandoverBranch] = useState("");
  const [receivingBranch, setReceivingBranch] = useState("");

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          BRANCH HANDOVER
        </h1>
      </div>

      <div className="space-y-6">
        {/* Handover Branch Selection */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                Handover branch
            </label>
            <Select value={handoverBranch} onValueChange={setHandoverBranch}>
                <SelectTrigger className="w-full md:max-w-xs bg-white dark:bg-[#393053] border-gray-300 dark:border-white/20">
                <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="clinic1">Clinic 1</SelectItem>
                <SelectItem value="clinic2">Clinic 2</SelectItem>
                <SelectItem value="clinic3">Clinic 3</SelectItem>
                </SelectContent>
            </Select>
             <div className="flex justify-end text-sm text-gray-500 dark:text-white/50">
                Total :
            </div>
        </div>

        {/* Content Area (Placeholder for list or items to handover) */}
        <div className="h-96 border border-gray-300 dark:border-white/40 rounded-md bg-white dark:bg-[#393053]/50">
            {/* List or Content goes here */}
        </div>

        {/* Receiving Branch Selection */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                Receiving branch
            </label>
             <Select value={receivingBranch} onValueChange={setReceivingBranch}>
                <SelectTrigger className="w-full md:max-w-xs bg-white dark:bg-[#393053] border-gray-300 dark:border-white/20">
                <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="clinic1">Clinic 1</SelectItem>
                <SelectItem value="clinic2">Clinic 2</SelectItem>
                <SelectItem value="clinic3">Clinic 3</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
            <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all whitespace-nowrap">
                Submit
            </Button>
        </div>
      </div>
    </div>
  );
}
