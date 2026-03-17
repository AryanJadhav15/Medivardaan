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
import { FileSpreadsheet, Settings } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ClinicExpenseReportPage() {
  const [clinicName, setClinicName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    { id: 1, clinicName: "ADAJAN", total: "430148.00" },
    { id: 2, clinicName: "ADYAR", total: "4702.00" },
    { id: 3, clinicName: "Airoli", total: "110492.00" },
    { id: 4, clinicName: "Amanora", total: "4696.00" },
    { id: 5, clinicName: "Ambernath", total: "99433.00" },
    { id: 6, clinicName: "AMEERPET", total: "199874.00" },
    { id: 7, clinicName: "Andheri East (takshila)", total: "10824.00" },
    { id: 8, clinicName: "Andheri West (Juhu)", total: "433249.00" },
    { id: 9, clinicName: "Annanagar", total: "159651.00" },
    { id: 10, clinicName: "Ashok vihar", total: "47711.00" },
    { id: 11, clinicName: "Aurangabad", total: "55000.00" },
  ]);

  const [filteredReportData, setFilteredReportData] = useState(reportData);

  useEffect(() => {
    setFilteredReportData(reportData);
  }, [reportData]);

  const handleSearch = () => {
    let result = reportData;

    if (clinicName) {
      const searchStr = clinicName.toLowerCase();
      result = result.filter(item => 
        item.clinicName.toLowerCase().includes(searchStr)
      );
    }
    
     if (fromDate) {
       // Placeholder for date logic
    }
    
    if (toDate) {
       // Placeholder for date logic
    }

    setFilteredReportData(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToExcel(filteredReportData, "Clinic_Expense_Report");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportData.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalAmount = filteredReportData.reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          CLINIC EXPENSE REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Clinic Name */}
        <div className="w-full md:w-1/4 space-y-1">
           <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]">
                <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="adajan">ADAJAN</SelectItem>
                <SelectItem value="adyar">ADYAR</SelectItem>
                <SelectItem value="airoli">Airoli</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/4 space-y-1">
           <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/4 space-y-1">
           <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button
            onClick={handleSearch}
            className="bg-[#D35400] hover:bg-[#ba4a00] text-white px-8 h-10 w-full md:w-auto transition-colors"
          >
            Search
          </Button>
        </div>
      </div>

       {/* Total Count */}
      <div className="flex justify-end pr-2">
         <span className="font-semibold text-gray-600 dark:text-white/60 text-sm">Total : {totalAmount.toFixed(2)}</span>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40 uppercase">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                 Total
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
                  {row.clinicName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 py-3 font-medium">
                  {row.total}
                </TableCell>
              </TableRow>
            ))}
             <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50 bg-gray-50 dark:bg-[#393053]/30">
                 <TableCell colSpan={2} className="border-r border-gray-200 dark:border-[#443C68]/50 py-3 text-right pr-4 font-bold text-gray-700 dark:text-white/75">
                    Total
                 </TableCell>
                 <TableCell className="font-bold text-gray-700 dark:text-white/75 py-3">
                    {totalAmount.toFixed(2)}
                 </TableCell>
             </TableRow>
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
            totalItems={filteredReportData.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
