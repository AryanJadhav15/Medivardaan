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
import { FileSpreadsheet, Settings } from "lucide-react";
import CustomPagination from "@/components/ui/custom-pagination";

export default function BajajSchemeInvoicePage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    invoiceNo: "",
    fromDate: "2025-12-07",
    toDate: "2025-12-22",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock Data
  const [mockData, setMockData] = useState([
    {
      id: 1,
      clinicName: "Secunderabad",
      patientCode: "P113614",
      patientName: "Nithin Javvaji",
      invoiceNo: "TEL003352526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "72,450.00",
      downpayment: "8,050.00",
      approvedLoanAmount: "80,500.00",
      schemeName: "10/1",
    },
    {
      id: 2,
      clinicName: "Secunderabad",
      patientCode: "P113614",
      patientName: "Nithin Javvaji",
      invoiceNo: "TEL003342526",
      paymentDate: "17-Dec-2025",
      revenueAmount: "31,050.00",
      downpayment: "3,450.00",
      approvedLoanAmount: "34,500.00",
      schemeName: "10/1",
    },
    {
      id: 3,
      clinicName: "Pimpri",
      patientCode: "P113241",
      patientName: "virendra chavan",
      invoiceNo: "MAH000832526",
      paymentDate: "12-Dec-2025",
      revenueAmount: "28,000.00",
      downpayment: "8,297.00",
      approvedLoanAmount: "36,297.00",
      schemeName: "10/2",
    },
    {
      id: 4,
      clinicName: "Pimpri",
      patientCode: "P113289",
      patientName: "sonali kadam",
      invoiceNo: "MAH000802526",
      paymentDate: "10-Dec-2025",
      revenueAmount: "40,000.00",
      downpayment: "10,000.00",
      approvedLoanAmount: "50,000.00",
      schemeName: "10/2",
    },
    {
      id: 5,
      clinicName: "New Yelhanka",
      patientCode: "P113783",
      patientName: "P HARSHVARDHAN NAYAK",
      invoiceNo: "KAR006242526",
      paymentDate: "20-Dec-2025",
      revenueAmount: "45,000.00",
      downpayment: "5,000.00",
      approvedLoanAmount: "50,000.00",
      schemeName: "10/1",
    },
    {
      id: 6,
      clinicName: "New Yelhanka",
      patientCode: "P113758",
      patientName: "PARTHA Chakrabarti",
      invoiceNo: "KAR005902526",
      paymentDate: "20-Dec-2025",
      revenueAmount: "1,17,000.00",
      downpayment: "13,000.00",
      approvedLoanAmount: "1,30,000.00",
      schemeName: "10/1",
    },
    {
      id: 7,
      clinicName: "New Yelhanka",
      patientCode: "P113758",
      patientName: "PARTHA Chakrabarti",
      invoiceNo: "KAR005902526",
      paymentDate: "20-Dec-2025",
      revenueAmount: "90,000.00",
      downpayment: "10,000.00",
      approvedLoanAmount: "1,00,000.00",
      schemeName: "10/1",
    },
    {
      id: 8,
      clinicName: "Mysore",
      patientCode: "P113390",
      patientName: "NAGARATHNA S",
      invoiceNo: "KAR001092526",
      paymentDate: "12-Dec-2025",
      revenueAmount: "54,000.00",
      downpayment: "6,000.00",
      approvedLoanAmount: "60,000.00",
      schemeName: "10/1",
    },
     // Adding more mock data to demonstrate pagination if needed
     { id: 9, clinicName: "Ambernath", patientCode: "P113888", patientName: "Rahul Dravid", invoiceNo: "AMB001", paymentDate: "22-Dec-2025", revenueAmount: "10,000.00", downpayment: "1,000.00", approvedLoanAmount: "11,000.00", schemeName: "10/1"},
     { id: 10, clinicName: "Ambernath", patientCode: "P113999", patientName: "Sachin T", invoiceNo: "AMB002", paymentDate: "22-Dec-2025", revenueAmount: "20,000.00", downpayment: "2,000.00", approvedLoanAmount: "22,000.00", schemeName: "10/1"},
     { id: 11, clinicName: "Ambernath", patientCode: "P114000", patientName: "Virat K", invoiceNo: "AMB003", paymentDate: "23-Dec-2025", revenueAmount: "15,000.00", downpayment: "1,500.00", approvedLoanAmount: "16,500.00", schemeName: "10/2"},
  ]);


  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
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
      // Date logic would go here if dates were standard objects
      return matchClinic && matchInvoice;
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
            BAJAJ SCHEME INVOICE REPORT
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
              <SelectItem value="secunderabad">Secunderabad</SelectItem>
              <SelectItem value="pimpri">Pimpri</SelectItem>
              <SelectItem value="new-yelhanka">New Yelhanka</SelectItem>
              <SelectItem value="mysore">Mysore</SelectItem>
              <SelectItem value="ambernath">Ambernath</SelectItem>
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
          <Input
            type="date"
            className="h-9 bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="md:col-span-3">
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
            onClick={clearFilters}
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
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Sr. No.</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Clinic Name</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Code</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Payment Date</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Revenue Amount</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Downpayment</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Approved Loan Amount</TableHead>
                <TableHead className="text-xs font-bold text-gray-700 dark:text-white/75 h-10">Scheme Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-b border-gray-50 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 text-xs">
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.clinicName}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.patientCode}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75 uppercase">{row.patientName}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.invoiceNo}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.paymentDate}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.revenueAmount}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.downpayment}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.approvedLoanAmount}</TableCell>
                  <TableCell className="py-2 text-gray-600 dark:text-white/75">{row.schemeName}</TableCell>
                </TableRow>
              ))}
               {currentItems.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={10} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-green-700 border-green-700 hover:bg-green-50"
        >
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
