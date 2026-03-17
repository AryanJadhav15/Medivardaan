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

export default function FinanceReconciliationPage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    invoiceNo: "",
    fromDate: "2025-12-08",
    toDate: "2025-12-23",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock Data
  const [data, setData] = useState([
    { id: 1, clinic: "Dehradun", pCode: "P113605", pName: "neha verma", invNo: "UTP003122526", date: "17-Dec-2025", rev: "32,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse- Credit Card Bank" },
    { id: 2, clinic: "Secunderabad", pCode: "P113614", pName: "Nithin Javvaji", invNo: "TEL003352526", date: "17-Dec-2025", rev: "72,450.00", disb: "0.00", lan: "", sub: "0.00", mode: "Bajaj finance" },
    { id: 3, clinic: "Secunderabad", pCode: "P113614", pName: "Nithin Javvaji", invNo: "TEL003342526", date: "17-Dec-2025", rev: "31,050.00", disb: "0.00", lan: "", sub: "0.00", mode: "Bajaj finance" },
    { id: 4, clinic: "LB NAGAR", pCode: "P113583", pName: "adla srinivas reddy", invNo: "TEL003162526", date: "16-Dec-2025", rev: "1,00,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse- Credit Card Bank" },
    { id: 5, clinic: "MADHAPUR", pCode: "P113577", pName: "vijay kumar l", invNo: "TEL002292526", date: "16-Dec-2025", rev: "45,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse - Preapproved Debit Card + Cardless EMI" },
    { id: 6, clinic: "MADHAPUR", pCode: "P113282", pName: "sreya B", invNo: "TEL000562526", date: "17-Dec-2025", rev: "23,800.00", disb: "0.00", lan: "", sub: "0.00", mode: "Zeropay" },
    { id: 7, clinic: "MADHAPUR", pCode: "P113282", pName: "sreya B", invNo: "TEL000552526", date: "17-Dec-2025", rev: "10,200.00", disb: "0.00", lan: "", sub: "0.00", mode: "Zeropay" },
    { id: 8, clinic: "Toli Chowki", pCode: "P113174", pName: "syed obaid", invNo: "TEL000102526", date: "09-Dec-2025", rev: "11,400.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
    { id: 9, clinic: "Annanagar", pCode: "P113906", pName: "RAJAM L", invNo: "TAN007932526", date: "22-Dec-2025", rev: "55,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
    { id: 10, clinic: "Nanganallur", pCode: "P113801", pName: "KAVITHANJALI A", invNo: "TAN006432526", date: "21-Dec-2025", rev: "55,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
    { id: 11, clinic: "Nanganallur", pCode: "P113802", pName: "Rakesh K", invNo: "TAN006432527", date: "22-Dec-2025", rev: "25,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
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
  const filteredData = data.filter((item) => {
      const matchClinic = !filters.clinicName || item.clinic.toLowerCase().includes(filters.clinicName.toLowerCase());
      const matchInvoice = !filters.invoiceNo || item.invNo.toLowerCase().includes(filters.invoiceNo.toLowerCase());
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
        FINANCE RECONCILIATIONS
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
                {currentItems.map((row, index) => (
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
