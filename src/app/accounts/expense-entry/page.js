"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Settings, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ExpenseEntryPage() {
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      clinic: "Salunkhe vihar",
      doctor: "Dr.Anagha Patil Chavan",
      vendorType: "Stationary",
      vendor: "stationery shop",
      amount: "95.00",
    },
    {
      id: 2,
      clinic: "Salunkhe vihar",
      doctor: "Dr.Anagha Patil Chavan",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "80.00",
    },
    {
      id: 3,
      clinic: "BYCULLA West",
      doctor: "Dr.RUCHI BHANSALI",
      vendorType: "Travelling",
      vendor: "From Byculla To Dadar",
      amount: "10.00",
    },
    {
      id: 4,
      clinic: "AURANGABAD",
      doctor: "Dr.Anagha Patil Chavan",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "300.00",
    },
    {
      id: 5,
      clinic: "BYCULLA West",
      doctor: "Dr.RUCHI BHANSALI",
      vendorType: "Clinic Maintenance",
      vendor: "Amazon",
      amount: "100.00",
    },
    {
      id: 6,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "130.00",
    },
    {
      id: 7,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "113.00",
    },
    {
      id: 8,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "139.00",
    },
    {
      id: 9,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "131.00",
    },
    {
      id: 10,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "118.00",
    },
     {
      id: 11,
      clinic: "WadgaonSheri",
      doctor: "Dr.Dhanashree Shinde",
      vendorType: "Courier",
      vendor: "--- Select ---",
      amount: "125.00",
    },
  ]);

  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);


  const handleSearch = () => {
    let result = expenses;

    if (clinicName) {
      const searchStr = clinicName.toLowerCase().replace(/_/g, " "); // Basic normalization if keys use underscores
      // Actually, select values are like "salunkhe_vihar", distinct from "Salunkhe vihar". 
      // I'll make a more robust check by stripping special chars or checking loose match
      result = result.filter(item => {
         const cVal = item.clinic.toLowerCase();
         // Check if clinicName (selected) is subset of data clinic string or vise versa, 
         // treating underscore as space
         const selectedNormalized = clinicName.toLowerCase().replace(/_/g, " ");
         return cVal.includes(selectedNormalized) || selectedNormalized.includes(cVal);
      });
    }

    if (doctorName) {
      result = result.filter(item => 
        item.doctor.toLowerCase().includes(doctorName.toLowerCase())
      );
    }

    setFilteredExpenses(result);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    console.log("Delete expense:", id);
  };
  
  const handleEdit = (id) => {
     console.log("Edit expense:", id);
  };

  const handleExport = () => {
    exportToExcel(filteredExpenses, "Expense_Entry");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          EXPENSE
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Clinic Name (Required) */}
        <div className="w-full md:w-1/3 space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-white/75">
             Clinic Name <span className="text-red-500">*</span>
          </label>
           <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]">
                <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="salunkhe_vihar">Salunkhe vihar</SelectItem>
                <SelectItem value="byculla_west">BYCULLA West</SelectItem>
                <SelectItem value="aurangabad">AURANGABAD</SelectItem>
                <SelectItem value="wadgaonsheri">WadgaonSheri</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Doctor */}
        <div className="w-full md:w-1/3 space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-white/75">
            Doctor
          </label>
           <Input
            placeholder=""
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={handleSearch}
            className="bg-[#D35400] hover:bg-[#ba4a00] text-white px-6 h-10 transition-colors"
          >
            Search
          </Button>
          <Button className="bg-[#0056b3] hover:bg-[#004494] text-white px-4 h-10 transition-colors">
            Add New
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr. No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Doctor Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Vendor Type
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Vendor / Travelling
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Amount
              </TableHead>
              <TableHead className="w-[100px] font-bold text-gray-800 dark:text-white/90 text-center">
                 
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 border-b border-gray-200 dark:border-[#443C68]/50"
              >
                <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {indexOfFirstItem + index + 1}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.clinic}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.doctor}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.vendorType}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.vendor}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.amount}
                </TableCell>
                 <TableCell className="py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(row.id)} className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400">
                        <Edit className="w-5 h-5 border border-gray-500 rounded p-[2px]" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400">
                        <Trash2 className="w-5 h-5 border border-gray-500 rounded p-[2px]" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
       {/* Footer / Pagination / Export */}
      <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
         <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded shadow transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
           </div>
        </div>
        
        {/* Pagination component */}
        <CustomPagination 
            totalItems={filteredExpenses.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
