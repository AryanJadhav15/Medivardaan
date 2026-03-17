"use client";
import React, { useState } from "react";
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

export default function ClinicRequestStockSendReportPage() {
  const [orderNo, setOrderNo] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    {
      id: 1,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Spreader",
      price: "618.00",
      receivedQty: 0,
    },
    {
      id: 2,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Paper Point-4%",
      price: "1580.00",
      receivedQty: 1,
    },
    {
      id: 3,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "GP-Assorted 2%",
      price: "200.00",
      receivedQty: 0,
    },
    {
      id: 4,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "GP#25 - 4%",
      price: "715.00",
      receivedQty: 1,
    },
    {
      id: 5,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "GP#20-4%",
      price: "1515.00",
      receivedQty: 1,
    },
    {
      id: 6,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Tissue",
      price: "99.00",
      receivedQty: 0,
    },
    {
      id: 7,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Saline",
      price: "409.14",
      receivedQty: 2,
    },
    {
      id: 8,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Sanitizer",
      price: "0.00",
      receivedQty: 0,
    },
    {
      id: 9,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Rotary file",
      price: "2392.00",
      receivedQty: 1,
    },
    {
      id: 10,
      orderNo: "CORD2235",
      clinicName: "Chakan",
      sendOrderDate: "2024-10-09",
      materialName: "Bur-Polishing",
      price: "135.00",
      receivedQty: 0,
    },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Clinic_Request_Stock_Send_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesOrder = item.orderNo.toLowerCase().includes(orderNo.toLowerCase());
      const matchesClinic = !clinicName || clinicName === "all" || item.clinicName === clinicName;
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.sendOrderDate) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.sendOrderDate) <= new Date(toDate);

      return matchesOrder && matchesClinic && matchesDate;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          CLINIC REQUEST STOCK SEND REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Order No */}
        <div className="w-full md:w-1/5 space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Order No</label>
          <Input
            placeholder="Order No"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* Sync Clinic/Select Clinic (using Select Clinic as per standard but image shows dropdown) */}
        <div className="w-full md:w-1/5 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Clinic Name</label>
           <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]">
                <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="Chakan">Chakan</SelectItem>
                <SelectItem value="clinic2">Clinic 2</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/5 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">From Date</label>
          <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/5 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">To Date</label>
          <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button
            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 h-10 w-full md:w-auto transition-colors"
          >
            Search
          </Button>
        </div>
      </div>

       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Order No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Send Order Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Material Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Price
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Received Qty
              </TableHead>
               <TableHead className="font-bold text-gray-800 dark:text-white/90">
                Clinic Name
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 border-b border-gray-200 dark:border-[#443C68]/50"
                >
                    <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.orderNo}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.clinicName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.sendOrderDate}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.materialName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.price}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.receivedQty}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 py-3">
                    {row.clinicName}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Footer / Pagination / Export */}
      <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
        <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors rounded shadow transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
           </div>
        </div>
        
        {/* Pagination component */}
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
