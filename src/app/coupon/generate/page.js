"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CouponGenerate() {
  const [companyType, setCompanyType] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalCoupons, setTotalCoupons] = useState("");
  const [isAutoGenerate, setIsAutoGenerate] = useState(false);
  const [generatedCoupons, setGeneratedCoupons] = useState([]);

  // Mock Companies Data
  const allCompanies = [
    { id: "comp1", name: "MAC Test", type: "Organisation" },
    { id: "comp2", name: "Test 456", type: "Company" },
    { id: "comp3", name: "IG", type: "Company" },
    { id: "comp4", name: "ORTHOSQUARE MDC", type: "Organisation" },
    { id: "comp5", name: "Test1", type: "Organisation" },
  ];

  // Derived filtered companies based on type
  const filteredCompanies = allCompanies.filter(
    (c) => !companyType || c.type === companyType
  );

  const handleGenerate = () => {
    if (!amount || !totalCoupons) {
      alert("Please fill in Amount and Total No. of Coupons");
      return;
    }

    const count = parseInt(totalCoupons);
    const newCoupons = [];
    
    for (let i = 0; i < count; i++) {
        // Generate random 8-char alphanumeric code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        newCoupons.push(code);
    }
    
    setGeneratedCoupons(newCoupons);
    if(isAutoGenerate) {
       alert(`Successfully Auto-Generated ${count} coupons! Sample: ${newCoupons[0]}`);
    } else {
       alert(`Ready to generate ${count} coupons manually.`);
    }
  };

  const handleSubmit = () => {
      // Here you would send data to backend
      console.log({
          companyType,
          company,
          amount,
          fromDate,
          toDate,
          totalCoupons,
          generatedCoupons
      });
      alert("Coupons Submitted Successfully!");
      // Reset form
      setCompanyType("");
      setCompany("");
      setAmount("");
      setFromDate("");
      setToDate("");
      setTotalCoupons("");
      setGeneratedCoupons([]);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          COUPON GENERATE
        </h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select value={companyType} onValueChange={setCompanyType}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="-- Select Company Type --" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Organisation">Organisation</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                </SelectContent>
            </Select>

             <Select value={company} onValueChange={setCompany} disabled={!companyType}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="--- Select Company---" />
                </SelectTrigger>
                <SelectContent>
                    {filteredCompanies.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
                placeholder="Coupon Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                type="number"
            />
             <Input
                placeholder="Validity From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
             <Input
                placeholder="Validity To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <Input
                placeholder="Total No Of Coupon"
                value={totalCoupons}
                onChange={(e) => setTotalCoupons(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                type="number"
            />
            <div className="flex items-center space-x-2">
                <Checkbox id="auto-generate" checked={isAutoGenerate} onCheckedChange={setIsAutoGenerate} />
                <label
                    htmlFor="auto-generate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white/75"
                >
                    Is Auto Generate ?
                </label>
            </div>
        </div>

        <div className="flex justify-end">
            <Button 
                onClick={handleGenerate}
                className="bg-[#419456] hover:bg-[#347845] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Coupon Generate
            </Button>
        </div>

        <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 dark:border-[#443C68]/50">
             <Button 
                onClick={handleSubmit}
                className="bg-[#419456] hover:bg-[#347845] text-white px-8 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Submit
            </Button>
             <Button 
                variant="outline"
                onClick={() => {
                    setCompanyType(""); setCompany(""); setAmount(""); 
                    setFromDate(""); setToDate(""); setTotalCoupons("");
                }}
                className="bg-[#419456] hover:bg-[#347845] text-white px-8 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Cancel
            </Button>
        </div>
      </div>
    </div>
  );
}
