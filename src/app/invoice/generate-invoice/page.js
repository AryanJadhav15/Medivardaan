"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, CreditCard, User, Calendar, Stethoscope, Receipt } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

export default function GenerateInvoicePage() {
  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    paymentDate: "2025-12-23",
    treatmentType: "Other",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full p-6 space-y-8 min-h-screen bg-white dark:bg-[#18122B]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
       
             <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          GENERATE INVOICE
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500 dark:text-white/50" /> Patient Name
                            </Label>
                            <Input
                            className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 focus:ring-red-500 focus:border-red-500"
                            placeholder="Enter patient name"
                            value={formData.patientName}
                            onChange={(e) => handleInputChange("patientName", e.target.value)}
                            />
                        </div>

                         {/* Payment Date */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-white/50" /> Payment Date
                            </Label>
                            <Input
                            type="date"
                            className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 focus:ring-red-500 focus:border-red-500"
                            value={formData.paymentDate}
                            onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                            />
                        </div>

                        {/* Clinic Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-gray-500 dark:text-white/50" /> Clinic Name
                            </Label>
                            <Select
                            value={formData.clinicName}
                            onValueChange={(val) => handleInputChange("clinicName", val)}
                            >
                            <SelectTrigger className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 focus:ring-red-500 focus:border-red-500">
                                <SelectValue placeholder="Select Clinic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dehradun">Dehradun</SelectItem>
                                <SelectItem value="mumabi">Mumbai</SelectItem>
                                <SelectItem value="pune">Pune</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>

                        {/* Doctor Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500 dark:text-white/50" /> Doctor Name
                            </Label>
                            <Select
                            value={formData.doctorName}
                            onValueChange={(val) => handleInputChange("doctorName", val)}
                            >
                            <SelectTrigger className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 focus:ring-red-500 focus:border-red-500">
                                <SelectValue placeholder="Select Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                                <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Treatment Type */}
                    <div className="space-y-3 pt-2">
                       <Label className="text-sm font-semibold text-gray-700 dark:text-white/75 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500 dark:text-white/50" /> Treatment Type
                       </Label>
                       <div className="bg-gray-50 dark:bg-[#443C68]/30 p-4 rounded-lg border border-gray-200 dark:border-[#635985]/40">
                            <RadioGroup 
                                    defaultValue="Other" 
                                    className="flex items-center gap-8"
                                    onValueChange={(val) => handleInputChange("treatmentType", val)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Aligner" id="r1" className="text-white-500 border-gray-400" />
                                        <Label htmlFor="r1" className="font-medium text-gray-700 dark:text-white/75 cursor-pointer">Aligner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Other" id="r2" className="text-white-500 border-gray-400" />
                                        <Label htmlFor="r2" className="font-medium text-gray-700 dark:text-white/75 cursor-pointer">Other</Label>
                                    </div>
                                </RadioGroup>
                       </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Summary / Totals Section */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#E8F8F5] dark:bg-[#393053] border-none shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                {/* <CreditCard className="w-24 h-24 text-teal-900" /> */}
                </div>
                <CardContent className="p-6 space-y-6 relative z-10">
                   <h3 className="text-lg font-bold text-teal-800 dark:text-white/50     border-b border-teal-200 dark:border-[#443C68]/50 pb-2 mb-4">Invoice Summary</h3>
                   
                   <div className="space-y-4">
                        <div className="flex justify-between items-center text-teal-900 dark:text-white/75 text-sm font-medium">
                            <span>Total Cost</span>
                            <span className="font-mono text-base">₹ 0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-teal-900 dark:text-white/75 text-sm font-medium">
                            <span>Total Discount</span>
                            <span className="font-mono text-red-600 dark:text-red-400 text-base">- ₹ 0.00</span>
                        </div>
                         <div className="flex justify-between items-center text-teal-900 dark:text-white/75 text-sm font-medium">
                            <span>Total Tax (18%)</span>
                            <span className="font-mono text-base">₹ 0.00</span>
                        </div>
                   </div>

                   <div className="pt-4 border-t border-teal-200 dark:border-[#443C68]/50 mt-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-teal-900 dark:text-white uppercase tracking-wider">Grand Total</span>
                            <span className="text-3xl font-bold text-teal-700 dark:text-[#635985]">₹ 0.00</span>
                        </div>
                   </div>


                   <Button 
                        className="w-full bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors font-bold py-3 mt-6 shadow-md transition-all active:scale-95"
                    >
                        GENERATE INVOICE
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
