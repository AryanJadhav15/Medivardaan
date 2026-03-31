"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "lucide-react";
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
import { FileSpreadsheet, Loader2 } from "lucide-react";
import CustomPagination from "@/components/ui/custom-pagination";
import { getFinanceReconciliations } from "@/api/invoices";

export default function FinanceReconciliationPage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    invoiceNo: "",
    fromDate: "2025-12-08",
    toDate: "2025-12-23",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (currentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await getFinanceReconciliations(currentFilters);
        // Temporary client-side filtering until real backend handles it
        const filtered = response.filter((item) => {
            const matchClinic = !currentFilters.clinicName || item.clinic.toLowerCase().includes(currentFilters.clinicName.toLowerCase());
            const matchInvoice = !currentFilters.invoiceNo || item.invNo.toLowerCase().includes(currentFilters.invoiceNo.toLowerCase());
            return matchClinic && matchInvoice;
        });
        setData(filtered);
    } catch (err) {
        console.error(err);
        setError("Failed to load invoice data.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchData();
  }, []);

  const handleSearch = () => {
      setCurrentPage(1);
      fetchData();
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    const emptyFilters = {
      clinicName: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(emptyFilters);
    setCurrentPage(1);
    fetchData(emptyFilters);
  };

  // Filter Data
  const filteredData = data;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B]">
      {/* Header */}
      <div className="flex ">
      <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
      <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
        FINANCE RECONCILIATIONS
      </h1>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-[#18122B] rounded-lg">
        {/* Clinic Name */}
        <div className="md:col-span-3 space-y-1">
          <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">Clinic Name</Label>
          <Select
            value={filters.clinicName}
            onValueChange={(val) => handleFilterChange("clinicName", val)}
          >
            <SelectTrigger className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
              <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dehradun">Dehradun</SelectItem>
              <SelectItem value="secunderabad">Secunderabad</SelectItem>
              <SelectItem value="lb-nagar">LB Nagar</SelectItem>
              <SelectItem value="madhapur">Madhapur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice No */}
        <div className="md:col-span-3 space-y-1">
          <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">Invoice No</Label>
          <Input
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
             placeholder="Invoice No"
             value={filters.invoiceNo}
             onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
          />
        </div>

        {/* Empty Spacer */}
        <div className="hidden md:block md:col-span-6"></div>

         {/* From Date */}
         <div className="md:col-span-3">
           <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">From Date</Label>
          <Input
             type="date"
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 hover:cursor-pointer"
             value={filters.fromDate}
             onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
        </div>

         {/* To Date */}
         <div className="md:col-span-3">
           <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">To Date</Label>
          <Input
             type="date"
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50  hover:cursor-pointer"
             value={filters.toDate}
             onChange={(e) => handleFilterChange("toDate", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-3 flex gap-2">
            <Button
                size="sm"
                onClick={handleSearch}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 h-9 rounded-md"
            >
                Search
            </Button>
            <Button
                size="sm"
                onClick={handleClear}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 h-9 rounded-md"
            >
                Clear
            </Button>
        </div>
        
        {/* Total Count */}
        <div className="md:col-span-3 flex justify-end pb-2">
             <span className="text-sm text-gray-600 dark:text-white/60 font-medium">Total : {filteredData.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-sm overflow-hidden bg-white dark:bg-[#18122B] shadow-sm">
        <div className="overflow-x-auto">
            <Table>
              <TableHeader >
                <TableRow className="border-b border-gray-100 dark:border-[#443C68]/50 hover:bg-primary/10 dark:hover:bg-[#393053]">
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10 w-12">Sr. No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10 w-32"></TableHead> 
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Clinic Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Code</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Payment Date</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Revenue Amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Disbursed amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">LAN</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Subvention Rate</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Payment Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={12} className="text-center py-8">
                       <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                       <p className="text-sm text-gray-500 mt-2">Loading reconciliations...</p>
                     </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                     <TableCell colSpan={12} className="text-center py-8 text-red-500">
                       {error}
                     </TableCell>
                  </TableRow>
                ) : currentItems.map((row, index) => (
                    <TableRow key={row.id} className="border-b border-gray-50 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 text-xs">
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell className="py-2">
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors text-[10px] h-7 px-2 w-full rounded-sm"
                        >
                            Add Reconciliations
                        </Button>
                      </TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.clinic}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.pCode}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.pName}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.invNo}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.date}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 font-medium">{row.rev}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.disb}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.lan}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.sub}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.mode}</TableCell>
                    </TableRow>
                ))}
                 {!isLoading && currentItems.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      </div>
      
       {/* Footer / Pagination */}
       <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="icon" className="h-8 w-8 text-green-700 border-green-700 hover:bg-green-50">
                <FileSpreadsheet className="h-5 w-5" />
            </Button>

            <CustomPagination 
                totalItems={filteredData.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
       </div>
    </div>
  );
}
