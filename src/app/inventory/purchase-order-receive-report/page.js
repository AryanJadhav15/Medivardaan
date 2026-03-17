"use client";
import React, { useState } from "react";
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

export default function PurchaseOrderReceiveReportPage() {
  const [orderNo, setOrderNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    {
      id: 1,
      orderNo: "ORD4968",
      receivedDate: "2025-02-04",
      materialName: "Saline",
      requestQty: 1,
      receivedQty: 1,
      price: "3262.72",
    },
    {
      id: 2,
      orderNo: "ORD5814",
      receivedDate: "2025-01-02",
      materialName: "Composite",
      requestQty: 40,
      receivedQty: 40,
      price: "350.00",
    },
    {
      id: 3,
      orderNo: "ORD5814",
      receivedDate: "2025-01-02",
      materialName: "Bonding Agent",
      requestQty: 10,
      receivedQty: 10,
      price: "350.00",
    },
    {
      id: 4,
      orderNo: "ORD5814",
      receivedDate: "2025-01-02",
      materialName: "Epoxyseal",
      requestQty: 20,
      receivedQty: 20,
      price: "1250.00",
    },
    {
      id: 5,
      orderNo: "ORD3123",
      receivedDate: "2024-11-05",
      materialName: "Indurent Gel",
      requestQty: 20,
      receivedQty: 20,
      price: "400.00",
    },
    {
      id: 6,
      orderNo: "ORD3123",
      receivedDate: "2024-11-05",
      materialName: "Oranwash",
      requestQty: 10,
      receivedQty: 10,
      price: "735.00",
    },
    {
      id: 7,
      orderNo: "ORD7594",
      receivedDate: "2024-08-23",
      materialName: "Blue Bite",
      requestQty: 5,
      receivedQty: 5,
      price: "616.17",
    },
    {
      id: 8,
      orderNo: "ORD7594",
      receivedDate: "2024-08-23",
      materialName: "Composite N75 B2",
      requestQty: 5,
      receivedQty: 5,
      price: "584.82",
    },
    {
      id: 9,
      orderNo: "ORD7594",
      receivedDate: "2024-08-23",
      materialName: "Composite N75 A3",
      requestQty: 5,
      receivedQty: 5,
      price: "584.82",
    },
    {
      id: 10,
      orderNo: "ORD7594",
      receivedDate: "2024-08-23",
      materialName: "Composite N75 A2",
      requestQty: 12,
      receivedQty: 12,
      price: "584.82",
    },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Purchase_Order_Receive_Report");
  };

   // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesOrder = item.orderNo.toLowerCase().includes(orderNo.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.receivedDate) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.receivedDate) <= new Date(toDate);

      return matchesOrder && matchesDate;
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
          PURCHASE ORDER RECEIVE REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Order No */}
        <div className="w-full md:w-1/4 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Order No</label>
          <Input
            placeholder="Order No"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68] placeholder:text-gray-400"
          />
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/4 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">From Date</label>
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
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">To Date</label>
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
                Sr. No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Order No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Received Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Material Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Request Qty
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Received Qty
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                Price
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
                    {row.receivedDate}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.materialName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.requestQty}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {row.receivedQty}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 py-3">
                    {row.price}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={7} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
