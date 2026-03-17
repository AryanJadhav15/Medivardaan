"use client";

import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet } from "lucide-react";
import CustomPagination from "@/components/ui/custom-pagination";

export default function OnlinePaymentInvoicePage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    invoiceNo: "",
    fromDate: "2025-12-07",
    toDate: "2025-12-22",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock Data matching the screenshot
  const [mockData, setMockData] = useState([
    {
      id: 1,
      clinicName: "Dehradun",
      patientCode: "P113607",
      patientName: "shubhashish bhatt",
      invoiceNo: "UTP003142526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "500.00",
      paymentMode: "UPI",
      transactionNo: "115661718611",
    },
    {
      id: 2,
      clinicName: "Dehradun",
      patientCode: "P113604",
      patientName: "rakesh agarwal",
      invoiceNo: "UTP003112526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "2,500.00",
      paymentMode: "UPI",
      transactionNo: "115661718611",
    },
    {
      id: 3,
      clinicName: "LB NAGAR",
      patientCode: "P113613",
      patientName: "C Vijaya Bhaskar",
      invoiceNo: "TEL003262526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "5,000.00",
      paymentMode: "UPI",
      transactionNo: "12512171147195511932202",
    },
     {
      id: 4,
      clinicName: "LB NAGAR",
      patientCode: "P113613",
      patientName: "C Vijaya Bhaskar",
      invoiceNo: "TEL003262526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "5,000.00",
      paymentMode: "UPI",
      transactionNo: "12512171147195511932202",
    },
     {
      id: 5,
      clinicName: "MADHAPUR",
      patientCode: "P113577",
      patientName: "vijay kumar I",
      invoiceNo: "TEL002312526",
      paymentDate: "16-Dec-2025",
      revenueAmount: "3,000.00",
      paymentMode: "UPI",
      transactionNo: "571619951287",
    },
    {
      id: 6,
      clinicName: "MAMBALAM",
      patientCode: "P113679",
      patientName: "Uma gopalkrishnan G",
      invoiceNo: "TAN004452526",
      paymentDate: "18-Dec-2025",
      revenueAmount: "40,000.00",
      paymentMode: "UPI",
      transactionNo: "553369234255",
    },
     {
      id: 7,
      clinicName: "ADYAR",
      patientCode: "P113609",
      patientName: "ravi shankar",
      invoiceNo: "TAN003222526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "2,500.00",
      paymentMode: "UPI",
      transactionNo: "571788390677",
    },
     {
      id: 8,
      clinicName: "TRICHY",
      patientCode: "P113595",
      patientName: "Marri S",
      invoiceNo: "TAN002982526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "25,000.00",
      paymentMode: "UPI",
      transactionNo: "195122365490",
    },
    {
      id: 9,
      clinicName: "ADYAR",
      patientCode: "P113521",
      patientName: "pughal ady",
      invoiceNo: "TAN001592526",
      paymentDate: "15-Dec-2025",
      revenueAmount: "2,000.00",
      paymentMode: "UPI",
      transactionNo: "534938066745",
    },
    {
      id: 10,
      clinicName: "ADYAR",
      patientCode: "P105305",
      patientName: "sindhu k adyar",
      invoiceNo: "TAN000832526",
      paymentDate: "11-Dec-2025",
      revenueAmount: "101.00",
      paymentMode: "UPI",
      transactionNo: "570918396580",
    },
    {
        id: 11,
        clinicName: "ADYAR",
        patientCode: "P105306",
        patientName: "Another Patient",
        invoiceNo: "TAN000832527",
        paymentDate: "11-Dec-2025",
        revenueAmount: "100.00",
        paymentMode: "UPI",
        transactionNo: "570918396581",
    }
  ]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFilters({
      clinicName: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
    });
  };

  // Filter Data
  const filteredData = mockData.filter((item) => {
      const matchClinic = !filters.clinicName || item.clinicName.toLowerCase().includes(filters.clinicName.toLowerCase());
      const matchInvoice = !filters.invoiceNo || item.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase());
      return matchClinic && matchInvoice;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B]">
      {/* Header */}
      <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
        CREDIT CARD / DEBIT CARD AND UPI INVOICE REPORT
      </h1>

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
              <SelectItem value="lb nagar">LB Nagar</SelectItem>
              <SelectItem value="madhapur">Madhapur</SelectItem>
              <SelectItem value="mambalam">Mambalam</SelectItem>
              <SelectItem value="adyar">Adyar</SelectItem>
              <SelectItem value="trichy">Trichy</SelectItem>
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
               className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
               value={filters.fromDate}
               onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
         </div>

          {/* To Date */}
          <div className="md:col-span-3">
            <Label className="text-xs font-semibold text-gray-500 dark:text-white/60">To Date</Label>
            <Input
               type="date"
               className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
               value={filters.toDate}
               onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>

        {/* Buttons */}
        <div className="md:col-span-3 flex gap-2">
            <Button
                size="sm"
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
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
                <TableRow className="border-b border-gray-100 dark:border-[#443C68]/50 hover:bg-primary/10 dark:hover:bg-[#393053]">
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10 w-12">Sr. No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Clinic Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Code</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Payment Date</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Revenue Amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Payment Mode</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Transaction No.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((row, index) => (
                    <TableRow key={row.id} className="border-b border-gray-50 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 text-xs">
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.clinicName}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.patientCode}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.patientName}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.invoiceNo}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.paymentDate}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.revenueAmount}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.paymentMode}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.transactionNo}</TableCell>
                    </TableRow>
                ))}
                 {currentItems.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={9} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
