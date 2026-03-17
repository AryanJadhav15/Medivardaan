"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    treatmentName: "",
    cost: "",
    group: "",
    maxDiscount: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [discountError, setDiscountError] = useState("");

  // Mock data for Treatments
  const [treatments, setTreatments] = useState([
    { id: 1, treatmentName: "ABUTMENT", cost: "12000", group: "Implant", maxDiscount: "10" },
    { id: 2, treatmentName: "ALIGNER - EXCLUSIVE", cost: "75000", group: "Aligner", maxDiscount: "5" },
    { id: 3, treatmentName: "ALIGNER - EXCLUSIVE", cost: "75000", group: "Aligner", maxDiscount: "5" },
    { id: 4, treatmentName: "ALIGNER ATTACHMENT", cost: "500", group: "Aligner", maxDiscount: "15" },
    { id: 5, treatmentName: "ALIGNER-CLASSIC", cost: "35000", group: "Aligner", maxDiscount: "10" },
    { id: 6, treatmentName: "ALIGNER-CLASSIC", cost: "35000", group: "Aligner", maxDiscount: "10" },
    { id: 7, treatmentName: "ALIGNER-CLASSIC BOTH ARCHES", cost: "50000", group: "Aligner", maxDiscount: "8" },
    { id: 8, treatmentName: "ALIGNER-PREMIUM", cost: "100000", group: "Aligner", maxDiscount: "5" },
    { id: 9, treatmentName: "ALIGNER-PREMIUM", cost: "100000", group: "Aligner", maxDiscount: "5" },
    { id: 10, treatmentName: "ALVEOPLASTY - DOUBLE ARCH", cost: "20000", group: "General", maxDiscount: "12" }
  ]);

  const filteredData = treatments.filter(item => 
      item.treatmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this treatment?")) {
          setTreatments(treatments.filter(t => t.id !== id));
      }
  };

  const handleEdit = (treatment) => {
      setFormData({
          treatmentName: treatment.treatmentName,
          cost: treatment.cost,
          group: treatment.group || "General", // Defaulting if missing
          maxDiscount: treatment.maxDiscount || ""
      });
      setDiscountError("");
      setEditingId(treatment.id);
      setViewMode("create");
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setDiscountError("");
    setEditingId(null);
    setViewMode("create");
  };

  const validateDiscount = (value) => {
      if (value === "") return true; // Allow empty
      const num = parseFloat(value);
      if (isNaN(num)) return false;
      return num >= 0 && num <= 100;
  };

  const handleDiscountChange = (e) => {
      const value = e.target.value;
      setFormData({...formData, maxDiscount: value});
      if (value !== "" && !validateDiscount(value)) {
          setDiscountError("Discount must be between 0 and 100");
      } else {
          setDiscountError("");
      }
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      // Validate discount before submit
      if (formData.maxDiscount !== "" && !validateDiscount(formData.maxDiscount)) {
          setDiscountError("Discount must be between 0 and 100");
          return;
      }

      if (editingId) {
          setTreatments(treatments.map(t => t.id === editingId ? {
              ...t,
              treatmentName: formData.treatmentName,
              cost: formData.cost,
              group: formData.group,
              maxDiscount: formData.maxDiscount
          } : t));
          alert("Treatment Updated Successfully!");
      } else {
          const newId = Math.max(...treatments.map(t => t.id), 0) + 1;
          const newTreatment = {
              id: newId,
              treatmentName: formData.treatmentName,
              cost: formData.cost,
              group: formData.group,
              maxDiscount: formData.maxDiscount
          };
          setTreatments([...treatments, newTreatment]);
          alert("Treatment Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
                <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
                <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">TREATMENT</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Treatment Name <span className="text-red-500">*</span></label>
                         <Input required value={formData.treatmentName} onChange={e => setFormData({...formData, treatmentName: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Treatment Cost</label>
                         <Input value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Treatment Group</label>
                         <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.group}
                            onChange={e => setFormData({...formData, group: e.target.value})}
                         >
                             <option value="">-- Select Group Name --</option>
                             <option value="General">General</option>
                             <option value="Implant">Implant</option>
                             <option value="Damon">Damon</option>
                             <option value="Braces">Braces</option>
                             <option value="Aligner">Aligner</option>
                         </select>
                     </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Maximum Discount (In %)</label>
                         <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter discount (0-100)"
                            value={formData.maxDiscount}
                            onChange={handleDiscountChange}
                            className={discountError ? "border-red-500" : ""}
                         />
                         {discountError && (
                            <p className="text-red-500 text-xs mt-1">{discountError}</p>
                         )}
                     </div>
                </div>

                <div className="flex gap-4">
                     <Button type="submit" className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6">Submit</Button>
                     <Button type="button" className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6" onClick={() => setViewMode("list")}>Cancel</Button>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          TREATMENT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
            <Input
                placeholder="Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-white/20 flex-1"
            />
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
            <Button 
                onClick={handleAddNew}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New
            </Button>
        </div>
        
         <div className="text-sm text-gray-500 dark:text-white/50">
            Total : {filteredData.length}
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-[#393053]">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Cost</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Max Discount (%)</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.treatmentName}</TableCell>
                <TableCell className="dark:text-white/75">{row.cost}</TableCell>
                <TableCell className="dark:text-white/75">{row.maxDiscount || "-"}</TableCell>
                <TableCell className="dark:text-white/75">
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                            onClick={() => handleEdit(row)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                            onClick={() => handleDelete(row.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
             {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No treatments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          <div className="flex gap-2 text-sm text-blue-600 dark:text-[#635985]">
             <span className="cursor-pointer hover:underline p-1">12345678910... &gt;&gt;</span>
          </div>
        </div>
    </div>
  );
}
