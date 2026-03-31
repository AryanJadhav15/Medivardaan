"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, FileX, Receipt } from "lucide-react"; 

// Hooks
import { useDoctors } from "@/hooks/useDoctors";
import { useClinics } from "@/hooks/useClinics";
import { useSaveCancellationTreatment } from "@/hooks/useAccounts";
import { toast } from "sonner";

export default function CancellationTreatmentPage() {
  const { data: clinics = [], isLoading: loadingClinics } = useClinics();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const { mutate: saveCancellation, isPending } = useSaveCancellationTreatment();

  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    cancellationDate: new Date().toISOString().split("T")[0],
    reason: "",
    refundAmount: "0",
    creditNoteAmount: "0",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.clinicName) {
        toast.error("Please fill in all required fields.");
        return;
    }
    saveCancellation(formData);
  };

  return (
    <div className="w-full p-6 space-y-6 min-h-screen bg-white dark:bg-[#18122B] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-[#443C68]/50">
         <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          CANCELLATION TREATMENT
        </h1>
      </div>

      {/* Form Content */}
      <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
        <CardContent className="p-6 space-y-8">
          
          {/* Row 1: Patient, Clinic, Doctor, Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Patient Name</Label>
              <Input
                className="h-10 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                placeholder="Enter Patient Name"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Clinic Name</Label>
              <Select
                value={formData.clinicName}
                onValueChange={(val) => handleInputChange("clinicName", val)}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                  <SelectValue placeholder="Select Clinic" />
                </SelectTrigger>
                <SelectContent>
                  {loadingClinics ? (
                    <SelectItem value="loading" disabled>Loading clinics...</SelectItem>
                  ) : clinics.length > 0 ? (
                    Array.from(new Map(clinics.map(c => [c.clinicName, c])).values()).map((clinic, index) => (
                      <SelectItem key={`clinic-${clinic.clinicID || index}-${clinic.clinicName}`} value={clinic.clinicName}>
                        {clinic.clinicName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>No clinics available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Doctor Name</Label>
               <Select
                value={formData.doctorName}
                onValueChange={(val) => handleInputChange("doctorName", val)}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDoctors ? (
                    <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                  ) : doctors.length > 0 ? (
                    Array.from(new Map(doctors.map(d => [d.name, d])).values()).map((doc, index) => (
                      <SelectItem key={`doc-${doc.doctorID || index}-${doc.name}`} value={doc.name}>
                        {doc.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>No doctors available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Cancellation Date</Label>
              <Input
                type="date"
                className="h-10 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 hover:cursor-pointer  "
                value={formData.cancellationDate}
                onChange={(e) => handleInputChange("cancellationDate", e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Totals Display - Teal Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total Cost</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-[#393053] border border-teal-100 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-800 dark:text-[#635985]">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total Discount</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-[#393053] border border-teal-100 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-800 dark:text-[#635985]">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total Tax</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-[#393053] border border-teal-100 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-800 dark:text-[#635985]">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Grand Total</Label>
               <div className="h-10 flex items-center px-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md text-sm font-bold text-red-600 dark:text-red-400">
                  ₹ 0.00
               </div>
             </div>
          </div>

           {/* Row 3: Paid/Pending Display */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total Paid Amount</Label>
               <div className="h-10 flex items-center px-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-md text-sm font-bold text-green-600 dark:text-green-400">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Total Pending Amount</Label>
               <div className="h-10 flex items-center px-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-md text-sm font-bold text-orange-600 dark:text-orange-400">
                  ₹ 0.00
               </div>
             </div>
          </div>

          {/* Row 4: Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Reason for Cancellation</Label>
            <Textarea 
                className="min-h-[100px] bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 resize-none focus-visible:ring-1 focus-visible:ring-red-500"
                placeholder="Please describe the reason for cancellation..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>

          {/* Row 5: Refund / Credit Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-[#393053]/50 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-white/50">₹</span>
                <Input
                    type="number"
                    className="h-10 pl-7 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                    value={formData.refundAmount}
                    onChange={(e) => handleInputChange("refundAmount", e.target.value)}
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Credit Note Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-white/50">₹</span>
                <Input
                    type="number"
                    className="h-10 pl-7 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                    value={formData.creditNoteAmount}
                    onChange={(e) => handleInputChange("creditNoteAmount", e.target.value)}
                />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
      
       {/* Submit Button */}
       <div className="flex justify-center">
            <Button 
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white text-md shadow-md transition-colors font-bold py-2 px-8"
            >
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Cancellation"}
            </Button>
       </div>
    </div>
  );
}
