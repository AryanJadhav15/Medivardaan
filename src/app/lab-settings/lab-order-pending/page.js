"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function LabOrderPending() {
  const [filters, setFilters] = useState({
    clinic: "",
    patientName: "",
    startDate: "11-12-2025",
    endDate: "26-12-2025",
  });
  
  // State to hold search query applied on clicking "Search"
  const [activeFilters, setActiveFilters] = useState({
      clinic: "",
      patientName: "", // We can search in realtime or on button click. Usually Search button implies on-click.
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data for Lab Order Pending
  const [data] = useState([
    { id: 1, clinicName: "bandra west", patientName: "Anil Shinde", mobile: "9892598092", treatment: "CROWN - PFM", toothNo: "11,12,21,22", date: "26-Dec-2025" },
    { id: 2, clinicName: "bandra west", patientName: "Prisha Parekh", mobile: "8425842261", treatment: "CROWN - PFM", toothNo: "47", date: "26-Dec-2025" },
    { id: 3, clinicName: "bandra west", patientName: "Manish Bandi", mobile: "9821455290", treatment: "CROWN - PFM", toothNo: "15,16,17", date: "26-Dec-2025" },
    { id: 4, clinicName: "bandra west", patientName: "haresh patel", mobile: "7821441355", treatment: "CROWN - PFM", toothNo: "14,15,16,17", date: "26-Dec-2025" },
    { id: 5, clinicName: "bandra west", patientName: "lavina almeida", mobile: "9819386319", treatment: "CROWN - PFM", toothNo: "44,45,46,47", date: "26-Dec-2025" },
    { id: 6, clinicName: "bandra west", patientName: "jyoti moorjani", mobile: "9769399920", treatment: "COMPLETE DENTURES - CLASSIC", toothNo: "Single Arch Lower", date: "26-Dec-2025" },
    { id: 7, clinicName: "bandra west", patientName: "ashok balani", mobile: "9821225925", treatment: "CROWN - PFM", toothNo: "45,46,47", date: "25-Dec-2025" },
    { id: 8, clinicName: "bandra west", patientName: "viral kothari", mobile: "9702580930", treatment: "CROWN - Z-10YW", toothNo: "15", date: "25-Dec-2025" },
    { id: 9, clinicName: "Hadapsar", patientName: "deep nahar", mobile: "9822217102", treatment: "CROWN - Z-5YW", toothNo: "11", date: "25-Dec-2025" },
    { id: 10, clinicName: "MALAD West", patientName: "Crisenta c", mobile: "7045014013", treatment: "CROWN - PFM", toothNo: "32", date: "25-Dec-2025" }
  ]);

  // Handle Search
  const handleSearch = () => {
      setActiveFilters({
          clinic: filters.clinic,
          patientName: filters.patientName
      });
      setCurrentPage(1);
  };

  const handleClear = () => {
      setFilters({
        clinic: "",
        patientName: "",
        startDate: "",
        endDate: "",
      });
      setActiveFilters({
          clinic: "",
          patientName: ""
      });
      setCurrentPage(1);
  };

  // Derived state for filtered data
  const filteredData = data.filter((item) => {
    const matchesClinic = activeFilters.clinic === "" || activeFilters.clinic === "all" || item.clinicName.toLowerCase().includes(activeFilters.clinic.toLowerCase());
    const matchesPatient = item.patientName.toLowerCase().includes(activeFilters.patientName.toLowerCase());
    // Date filtering would require parsing, skipping for now as instructed to focus on ui/functionality of buttons roughly
    return matchesClinic && matchesPatient;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          PENDING LAB ORDERS
        </h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-white/60">Clinic Name</label>
            <Select 
                value={filters.clinic} 
                onValueChange={(val) => setFilters({...filters, clinic: val})}
            >
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent>
                     <SelectItem value="all">All</SelectItem>
                    {/* Unique clinics */}
                    {Array.from(new Set(data.map(i => i.clinicName))).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
         </div>

        <div className="space-y-1">
             <label className="text-sm text-gray-600 dark:text-white/60">Patient Name</label>
            <Input
                placeholder="Patient Name"
                value={filters.patientName}
                onChange={(e) => setFilters({...filters, patientName: e.target.value})}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
        </div>
        
         <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-white/60">Start Date</label>
            <Input
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                 className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                 placeholder="DD-MM-YYYY"
            />
        </div>
         <div className="space-y-1">
            <label className="text-sm text-gray-600 dark:text-white/60">End Date</label>
            <Input
                value={filters.endDate}
                 onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                 className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                 placeholder="DD-MM-YYYY"
            />
        </div>
      </div>
      
       <div className="flex gap-2">
            <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Search
            </Button>
            <Button 
                onClick={handleClear}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Clear
            </Button>
        </div>


      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-[#393053]">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Mobile</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Tooth No</TableHead>
               <TableHead className="font-bold text-gray-700 dark:text-white/75">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {currentData.length > 0 ? (
                currentData.map((row) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{row.id}</TableCell>
                <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                <TableCell className="dark:text-white/75">{row.patientName}</TableCell>
                <TableCell className="dark:text-white/75">{row.mobile}</TableCell>
                <TableCell className="dark:text-white/75">{row.treatment}</TableCell>
                 <TableCell className="dark:text-white/75">{row.toothNo}</TableCell>
                <TableCell className="dark:text-white/75">{row.date}</TableCell>
              </TableRow>
              ))
             ) : (
                 <TableRow>
                     <TableCell colSpan={7} className="text-center text-gray-500 dark:text-white/50 h-24">
                        No records found
                     </TableCell>
                 </TableRow>
             )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-between items-center pt-2">
           <div className="flex items-center">
             <FileSpreadsheet className="w-8 h-8 text-green-700 cursor-pointer" title="Export to Excel (Mock)" />
           </div>
           
            <div className="text-sm text-gray-500 dark:text-white/50">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>

           <div className="flex gap-2 text-sm text-blue-600 dark:text-[#635985]">
               <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors" : ""}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
           </div>
        </div>
    </div>
  );
}
