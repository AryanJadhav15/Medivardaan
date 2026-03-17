"use client";

import React, { useState } from "react";
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
import { FileSpreadsheet, Settings } from "lucide-react";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ChequeInvoicePage() {
  const [filters, setFilters] = useState({
    patientName: "",
    fromPaymentDate: "",
    toPaymentDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const [mockData, setMockData] = useState([
    { id: 1, invoiceNo: "INV173797", clinic: "Borivali", patient: "BHARAT JOSHI", bank: "Central Bank of India", branch: "DAHISAR", ifsc: "CBIN0282739", chequeNo: "771176", date: "30-Dec-2026", amount: "20000.00", clearDate: "", status: "Pending" },
    { id: 2, invoiceNo: "INV173797", clinic: "Borivali", patient: "BHARAT JOSHI", bank: "Central Bank of India", branch: "DAHISAR", ifsc: "CBIN0282739", chequeNo: "771179", date: "03-Mar-2026", amount: "20000.00", clearDate: "", status: "Pending" },
    { id: 3, invoiceNo: "INV173797", clinic: "Borivali", patient: "BHARAT JOSHI", bank: "Central Bank of India", branch: "DAHISAR", ifsc: "CBIN0282739", chequeNo: "771175", date: "30-Dec-2025", amount: "20000.00", clearDate: "", status: "Pending" },
    { id: 4, invoiceNo: "INV191123", clinic: "KALYAN NAGAR", patient: "Rupa S Poojary", bank: "DBS BANK", branch: "Shivaji Nagar", ifsc: "DBSS0IN0162", chequeNo: "000359", date: "25-Dec-2025", amount: "25000.00", clearDate: "", status: "Pending" },
    { id: 5, invoiceNo: "INV191123", clinic: "KALYAN NAGAR", patient: "Rupa S Poojary", bank: "DBS BANK", branch: "Shivaji Nagar", ifsc: "DBSS0IN0162", chequeNo: "000358", date: "15-Dec-2025", amount: "25000.00", clearDate: "", status: "Pending" },
    { id: 6, invoiceNo: "INV192381", clinic: "Borivali", patient: "Reginald Colacor", bank: "Bassein catholic co operative Bank", branch: "Mandepeshwar", ifsc: "BACB0000028", chequeNo: "100014", date: "15-Dec-2025", amount: "18000.00", clearDate: "17-Dec-2025", status: "Cheque Clear" },
    { id: 7, invoiceNo: "MAH002642526", clinic: "Borivali", patient: "Suresh Desai", bank: "Greater bank", branch: "Mira road", ifsc: "GBCB0000023", chequeNo: "315887", date: "15-Dec-2025", amount: "90000.00", clearDate: "18-Dec-2025", status: "Cheque Clear" },
    { id: 8, invoiceNo: "INV186017", clinic: "Dombivali East", patient: "SHWETA MHATRE", bank: "BANK OF BARODA", branch: "NILJE GURAVALI", ifsc: "BARB0NILJEX", chequeNo: "000022", date: "15-Dec-2025", amount: "25000.00", clearDate: "19-Dec-2025", status: "Cheque Clear" },
    { id: 9, invoiceNo: "INV147856", clinic: "Mysore", patient: "VEENA INNANJI", bank: "STATE BANK OF INDIA", branch: "SRIRAMPURA 2ND STAGE", ifsc: "SBIN0017797", chequeNo: "797011", date: "13-Dec-2025", amount: "10000.00", clearDate: "18-Dec-2025", status: "Cheque Clear" },
    { id: 10, invoiceNo: "GUJ001812526", clinic: "Shahibaug", patient: "Bhawarlal Doshi", bank: "icici bank", branch: "shahibaug branch", ifsc: "ICIC0000294", chequeNo: "023227", date: "13-Dec-2025", amount: "10000.00", clearDate: "15-Dec-2025", status: "Cheque Clear" },
  ]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

   // Filter Data
  const filteredData = mockData.filter((item) => {
      const matchPatient = !filters.patientName || item.patient.toLowerCase().includes(filters.patientName.toLowerCase());
      return matchPatient;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
         <Settings className="w-5 h-5 text-primary animate-spin-slow" />
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
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
             value={filters.fromPaymentDate}
             onChange={(e) => handleFilterChange("fromPaymentDate", e.target.value)}
          />
        </div>

         {/* To Date */}
         <div className="md:col-span-3">
           <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">To Date</Label>
          <Input
             type="date"
             className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
             value={filters.toPaymentDate}
             onChange={(e) => handleFilterChange("toPaymentDate", e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-3 flex gap-2">
            <Button
                size="sm"
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
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
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
                {currentItems.map((row, index) => (
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
                {currentItems.length === 0 && (
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
