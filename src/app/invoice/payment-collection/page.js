"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Settings, CreditCard, Receipt, ReceiptIcon } from "lucide-react";

import { toast } from "sonner";
import { useClinics } from "@/hooks/useClinics";
import { useDoctors } from "@/hooks/useDoctors";
import { submitPaymentCollection } from "@/api/invoices";

import { cn } from "@/lib/utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCollectionPage() {
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real data hooks
  const { data: clinics = [], isLoading: loadingClinics } = useClinics();
  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const paymentModes = ["Cash", "Card", "UPI", "Net Banking"];

  // State for form fields
  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    paidAmount: "",
    isMembership: false,
    totalCost: "",
    totalDiscount: "",
    totalTax: "",
    grandTotal: "",
    paymentType: "finance", // finance | cheque | other
    isCreditNote: false,
    payAmount: "",
    pendingAmount: "",
    paymentMode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Automatically calculate Totals
  useEffect(() => {
    const cost = parseFloat(formData.totalCost) || 0;
    const discount = parseFloat(formData.totalDiscount) || 0;
    const tax = parseFloat(formData.totalTax) || 0;
    const gTotal = cost - discount + tax;

    const paid = parseFloat(formData.paidAmount) || 0;
    const pay = parseFloat(formData.payAmount) || 0;
    const pending = gTotal - paid - pay;

    setFormData((prev) => {
        // Prevent infinite re-renders by only triggering state update if the values actually mutated
        if (
            prev.grandTotal !== gTotal.toFixed(2) ||
            prev.pendingAmount !== pending.toFixed(2)
        ) {
            return {
                ...prev,
                grandTotal: gTotal.toFixed(2),
                pendingAmount: pending.toFixed(2),
            };
        }
        return prev;
    });
  }, [formData.totalCost, formData.totalDiscount, formData.totalTax, formData.paidAmount, formData.payAmount]);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName || !formData.clinicName || !formData.doctorName || !formData.paidAmount) {
      toast.error("Please fill in all required fields (Patient, Clinic, Doctor, Paid Amount)");
      return;
    }

    setIsSubmitting(true);
    try {
        const payload = { ...formData, paymentDate: date };
        await submitPaymentCollection(payload);
        toast.success("Payment collected successfully!");
        
        // Reset form
        setFormData({
          patientName: "", clinicName: "", doctorName: "", paidAmount: "",
          isMembership: false, totalCost: "", totalDiscount: "", totalTax: "",
          grandTotal: "", paymentType: "finance", isCreditNote: false, payAmount: "",
          pendingAmount: "", paymentMode: ""
        });
        setDate(new Date());
    } catch (err) {
        toast.error("Failed to submit payment collection");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B]">
       {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        
             <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          PAYMENT COLLECTION
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto">
        {/* Row 1: Patient Name, Clinic, Doctor, Payment Date */}
        <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
           <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="patientName" className="font-semibold text-gray-700 dark:text-white/75">
                    Patient Name
                    </Label>
                    <Input
                    id="patientName"
                    name="patientName"
                    placeholder="Enter Patient Name"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-[#393053]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="clinicName" className="font-semibold text-gray-700 dark:text-white/75">
                    Clinic Name
                    </Label>
                    <Select
                    onValueChange={(val) => handleSelectChange("clinicName", val)}
                    value={formData.clinicName}
                    >
                    <SelectTrigger id="clinicName" className="bg-white dark:bg-[#393053]">
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
                    <Label htmlFor="doctorName" className="font-semibold text-gray-700 dark:text-white/75">
                    Doctor Name
                    </Label>
                    <Select
                    onValueChange={(val) => handleSelectChange("doctorName", val)}
                    value={formData.doctorName}
                    >
                    <SelectTrigger id="doctorName" className="bg-white dark:bg-[#393053]">
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

                <div className="space-y-2 flex flex-col pt-1">
                    <Label className="font-semibold text-gray-700 dark:text-white/75 mb-1">Payment Date</Label>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal bg-white dark:bg-[#393053]",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                </div>
                </div>

                {/* Row 2: Paid Amount, Membership Checkbox */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                    <div className="space-y-2">
                        <Label htmlFor="paidAmount" className="font-semibold text-gray-700 dark:text-white/75">
                        Paid Amount
                        </Label>
                        <Input
                        id="paidAmount"
                        name="paidAmount"
                        type="number"
                        placeholder="Enter Amount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                         className="bg-white dark:bg-[#393053]"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                        id="isMembership"
                        checked={formData.isMembership}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, isMembership: checked }))
                        }
                        />
                        <Label htmlFor="isMembership" className="font-semibold text-gray-700 dark:text-white/75 cursor-pointer">
                        Membership
                        </Label>
                    </div>
                </div>
           </CardContent>
        </Card>
      
        {/* Row 3: Totals Section (Cost, Discount, Tax, Grand Total) - Standard Teal Card */}
        <Card className="bg-[#E8F8F5] dark:bg-[#393053] border-none shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CreditCard className="w-40 h-40 text-teal-900" />
            </div>
             <CardContent className="p-6 space-y-4 relative z-10">
                <h3 className="text-lg font-bold text-teal-800 dark:text-[#635985] border-b border-teal-200 dark:border-[#443C68]/50 pb-2 mb-4">Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="totalCost" className="font-bold text-teal-800 dark:text-[#635985] uppercase tracking-wider text-xs">
                        Total Cost
                        </Label>
                        <Input
                        id="totalCost"
                        name="totalCost"
                        type="number"
                        placeholder="0.00"
                        value={formData.totalCost}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-[#18122B] border-teal-200 text-teal-900 font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="totalDiscount" className="font-bold text-teal-800 dark:text-[#635985] uppercase tracking-wider text-xs">
                        Total Discount
                        </Label>
                        <Input
                        id="totalDiscount"
                        name="totalDiscount"
                        type="number"
                        placeholder="0.00"
                        value={formData.totalDiscount}
                        onChange={handleInputChange}
                         className="bg-white dark:bg-[#18122B] border-teal-200 text-teal-900 font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="totalTax" className="font-bold text-teal-800 dark:text-[#635985] uppercase tracking-wider text-xs">
                        Total Tax
                        </Label>
                        <Input
                        id="totalTax"
                        name="totalTax"
                        type="number"
                        placeholder="0.00"
                        value={formData.totalTax}
                        onChange={handleInputChange}
                         className="bg-white dark:bg-[#18122B] border-teal-200 text-teal-900 font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="grandTotal" className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-xs">
                        Grand Total
                        </Label>
                        <Input
                        id="grandTotal"
                        name="grandTotal"
                        type="number"
                        placeholder="0.00"
                        className="font-bold border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 cursor-not-allowed"
                        value={formData.grandTotal}
                        onChange={handleInputChange}
                        readOnly
                        />
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Row 4: Payment Type Radio Buttons & Credit Note */}
        <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
             <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <Label className="font-semibold text-gray-700 dark:text-white/75">Payment Type</Label>
                        <RadioGroup
                            defaultValue="finance"
                            onValueChange={(val) => handleSelectChange("paymentType", val)}
                            className="flex space-x-6 mt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="finance" id="pt-finance" />
                                <Label htmlFor="pt-finance" className="cursor-pointer dark:text-white/75">Finance</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cheque" id="pt-cheque" />
                                <Label htmlFor="pt-cheque" className="cursor-pointer dark:text-white/75">Cheque</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="pt-other" />
                                <Label htmlFor="pt-other" className="cursor-pointer dark:text-white/75">Other</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                        id="isCreditNote"
                        checked={formData.isCreditNote}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, isCreditNote: checked }))
                        }
                        />
                        <Label htmlFor="isCreditNote" className="font-semibold text-gray-700 dark:text-white/75 cursor-pointer">
                        Credit Note
                        </Label>
                    </div>
                </div>

                {/* Row 5: Pay Amount, Pending Amount, Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="payAmount" className="font-semibold text-gray-700 dark:text-white/75">
                        Pay Amount
                        </Label>
                        <Input
                        id="payAmount"
                        name="payAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.payAmount}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-[#393053]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pendingAmount" className="font-semibold text-gray-700 dark:text-white/75">
                        Pending Amount
                        </Label>
                        <Input
                        id="pendingAmount"
                        name="pendingAmount"
                        type="number"
                        placeholder="0.00"
                        value={formData.pendingAmount}
                        onChange={handleInputChange}
                        readOnly
                        className="bg-gray-50 text-gray-500 cursor-not-allowed dark:bg-[#393053] dark:text-white/60"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paymentMode" className="font-semibold text-gray-700 dark:text-white/75">
                        Payment Mode
                        </Label>
                        <Select
                        onValueChange={(val) => handleSelectChange("paymentMode", val)}
                        value={formData.paymentMode}
                        >
                        <SelectTrigger id="paymentMode" className="bg-white dark:bg-[#393053]">
                            <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentModes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                                {mode}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                </div>
             </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-md transition-colors min-w-[150px] font-bold"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Payment"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-w-[150px] border-primary/30 text-primary hover:bg-primary/10 hover:text-[#0b5c7a]"
            onClick={() => console.log("Cancelled")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
