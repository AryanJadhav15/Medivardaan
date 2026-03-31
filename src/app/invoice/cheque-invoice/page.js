"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Receipt, Settings } from "lucide-react";
import CustomPagination from "@/components/ui/custom-pagination";
import { getChequeInvoices } from "@/api/invoices";

export default function ChequeInvoicePage() {
  const [filters, setFilters] = useState({
    patientName: "",
    fromPaymentDate: "",
    toPaymentDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await getChequeInvoices(filters);
        // Temporary client-side filtering until real backend handles it
        const filtered = response.filter((item) => {
            const matchPatient = !filters.patientName || item.patient.toLowerCase().includes(filters.patientName.toLowerCase());
            return matchPatient;
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

  const filteredData = data;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
         <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
         <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
            CHEQUE INVOICE
         </h1>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-[#18122B] rounded-lg">
        
        {/* Patient Name */}
        <div className="md:col-span-3 space-y-1">
          <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">Patient Name</Label>
          <Input
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
             placeholder="Patient Name"
             value={filters.patientName}
             onChange={(e) => handleFilterChange("patientName", e.target.value)}
          />
        </div>

         {/* From Date */}
         <div className="md:col-span-3">
           <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">From Date</Label>
          <Input
             type="date"
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 hover:cursor-pointer"
             value={filters.fromPaymentDate}
             onChange={(e) => handleFilterChange("fromPaymentDate", e.target.value)}
          />
        </div>

         {/* To Date */}
         <div className="md:col-span-3">
           <Label className="text-xs font-semibold text-gray-500 dark:text-white/60 ">To Date</Label>
          <Input
             type="date"
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 hover:cursor-pointer"
             value={filters.toPaymentDate}
             onChange={(e) => handleFilterChange("toPaymentDate", e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-3 flex gap-2">
            <Button
                size="sm"
                onClick={handleSearch}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 h-9 rounded-md"
            >
                Search
            </Button>
        </div>
      </div>
      
       {/* Total Count */}
        <div className="flex justify-end pb-2">
          <span className="text-sm text-gray-600 dark:text-white/60 font-medium">Total : {filteredData.length}</span>
        </div>

      {/* Table Section */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-sm overflow-hidden bg-white dark:bg-[#18122B] shadow-sm">
        <div className="overflow-x-auto">
            <Table>
              <TableHeader >
                <TableRow className="border-b border-gray-100 dark:border-[#443C68]/50 hover:bg-primary/10 dark:hover:bg-[#393053]">
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10 w-12">Sr. No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Clinic Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Bank Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Branch Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">IFSC</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Cheque No</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Date</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Cheque Clear Date</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={12} className="text-center py-8">
                       <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                       <p className="text-sm text-gray-500 mt-2">Loading cheques...</p>
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
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.invoiceNo}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.clinic}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.patient}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.bank}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.branch}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.ifsc}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.chequeNo}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.date}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.amount}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.clearDate}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.status}</TableCell>
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
