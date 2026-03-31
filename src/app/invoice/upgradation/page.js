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
import { Settings, CreditCard, Receipt } from "lucide-react"; 

import { toast } from "sonner";

// Hooks
import { useDoctors } from "@/hooks/useDoctors";
import { useClinics } from "@/hooks/useClinics";
import { submitUpgradation } from "@/api/invoices";

export default function UpgradationPage() {
  const { data: clinics = [], isLoading: loadingClinics } = useClinics();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    cancellationDate: "2025-12-22", // Default per screenshot, or today
    reason: "",
    creditNoteAmount: "0",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.clinicName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitUpgradation(formData);
      toast.success("Upgradation submitted successfully!");
      setFormData({
         patientName: "", clinicName: "", doctorName: "",
         cancellationDate: "2025-12-22", reason: "", creditNoteAmount: "0"
      });
    } catch (err) {
      toast.error("Failed to submit upgradation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6 min-h-screen bg-white dark:bg-[#18122B] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-[#443C68]/50">
      
            <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
      
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          UPGRADATION
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
                placeholder="Patient Name"
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
                  <SelectValue placeholder="-- Select Clinic --" />
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
                  <SelectValue placeholder="--- Select ---" />
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
                className="h-10 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 hover:cursor-pointer"
                value={formData.cancellationDate}
                onChange={(e) => handleInputChange("cancellationDate", e.target.value)}
              />
            </div>
          </div>
          
           {/* Row 2: Totals Display - Teal Theme */}
           <Card className="bg-[#E8F8F5] dark:bg-[#393053] border-none shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <CreditCard className="w-32 h-32 text-teal-900" />
                </div>
                <CardContent className="p-6 relative z-10">
                   <h3 className="text-lg font-bold text-teal-800 dark:text-[#635985] border-b border-teal-200 dark:text-white/75 pb-2 mb-4">Invoice Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-teal-800 dark:text-white/75 uppercase tracking-wider">TOTAL COST (₹)</Label>
                            <div className="h-10 flex items-center px-3 bg-white dark:bg-[#18122B] border border-teal-200 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-900 dark:text-white/90">0.00</div> 
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-teal-800 dark:text-white/75 uppercase tracking-wider">TOTAL DISCOUNT (₹)</Label>
                            <div className="h-10 flex items-center px-3 bg-white dark:bg-[#18122B] border border-teal-200 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-900 dark:text-white/90">0.00</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-teal-800 dark:text-white/75 uppercase tracking-wider">TOTAL TAX (₹)</Label>
                            <div className="h-10 flex items-center px-3 bg-white dark:bg-[#18122B] border border-teal-200 dark:border-[#443C68]/50 rounded-md text-sm font-semibold text-teal-900 dark:text-white/90">0.00</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-red-600 dark:text-white/75 uppercase tracking-wider">GRAND TOTAL(₹)</Label>
                            <div className="h-10 flex items-center px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-md text-sm font-bold text-red-700 dark:text-red-300">0.00</div>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">TOTAL PAID AMOUNT (₹)</Label>
                             <div className="h-10 flex items-center px-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-md text-sm font-bold text-green-700 dark:text-green-300">0.00</div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">TOTAL PENDING AMOUNT (₹)</Label>
                             <div className="h-10 flex items-center px-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-md text-sm font-bold text-orange-700 dark:text-orange-300">0.00</div>
                        </div>
                    </div>
                </CardContent>
           </Card>

          {/* Row 4: Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">Reason for cancellation</Label>
            <Textarea 
                className="min-h-[100px] bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 resize-none focus-visible:ring-1 focus-visible:ring-red-500"
                placeholder="Please describe reason..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>

          {/* Row 5: Credit Note */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-white/75">CreditNote Amount</Label>
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
          
           {/* Submit Button */}
           <div className="flex justify-center pt-4">
            <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white text-md shadow-md transition-colors px-8 h-10 font-bold"
            >
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Upgradation"}
            </Button>
           </div>

        </CardContent>
      </Card>
    </div>
  );
}
