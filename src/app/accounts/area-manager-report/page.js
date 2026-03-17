"use client";
import React, { useState, useEffect } from "react";
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
import { FileSpreadsheet, Settings } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function AreaManagerReportPage() {
  const [managerName, setManagerName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    { id: 1, manager: "Dr.RUCHI BHANSALI" },
    { id: 2, manager: "Sayali Jadhav" },
    { id: 3, manager: "Dr.Kunal Shet" },
    { id: 4, manager: "Dr.Nilay Vakharia" },
    { id: 5, manager: "Dr.isha jain" },
    { id: 6, manager: "Dr.Akhil Nair" },
    { id: 7, manager: "Dr.Anagha Patil Chavan" },
    { id: 8, manager: "Dr.Apurva Vaidya" },
    { id: 9, manager: "Dr.MADHU PAWAR" },
  ]);

  const [filteredReportData, setFilteredReportData] = useState(reportData);

  useEffect(() => {
    setFilteredReportData(reportData);
  }, [reportData]);

  const handleSearch = () => {
    let result = reportData;
    if (managerName) {
      result = result.filter((item) =>
        item.manager.toLowerCase().includes(managerName.toLowerCase())
      );
    }
    setFilteredReportData(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToExcel(filteredReportData, "Area_Manager_Report");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          AREA MANAGER REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        <div className="w-full md:w-1/4 space-y-1">
           <Input
            type="text"
            placeholder="Area Manager Name"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
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

        {/* Total Count */}
        <div className="w-full md:w-auto flex-1 flex justify-end items-end h-10 pb-1">
             <span className="text-sm font-medium text-gray-700 dark:text-white/75">Total : {filteredReportData.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                Area Manager
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
                <TableCell className="text-blue-500 hover:underline cursor-pointer py-3 font-medium">
                  {row.manager}
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
            totalItems={filteredReportData.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
