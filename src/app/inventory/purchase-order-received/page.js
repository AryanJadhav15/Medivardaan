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
import { Search, Settings, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function PurchaseOrderReceivedPage() {
  const [vendorName, setVendorName] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNo: "ORD4968",
      vendorName: "PROMIS DENTAL SYSTEM",
      status: "Pending",
      orderDate: "2025-01-01",
    },
    {
      id: 2,
      orderNo: "ORD5814",
      vendorName: "Nidhi Dental Solution",
      status: "Received",
      orderDate: "2024-10-11",
    },
    {
      id: 3,
      orderNo: "ORD3123",
      vendorName: "A-Z Dental World",
      status: "Received",
      orderDate: "2024-10-02",
    },
    {
      id: 4,
      orderNo: "ORD7594",
      vendorName: "PROMIS DENTAL SYSTEM",
      status: "Received",
      orderDate: "2024-08-03",
    },
    {
      id: 5,
      orderNo: "ORD3068",
      vendorName: "PROMIS DENTAL SYSTEM",
      status: "Received",
      orderDate: "2024-08-23",
    },
    {
      id: 6,
      orderNo: "ORD9755",
      vendorName: "PROMIS DENTAL SYSTEM",
      status: "Received",
      orderDate: "2024-08-17",
    },
    {
      id: 7,
      orderNo: "ORD3393",
      vendorName: "A-Z Dental World",
      status: "Received",
      orderDate: "2024-07-31",
    },
    {
      id: 8,
      orderNo: "ORD7751",
      vendorName: "PROMIS DENTAL SYSTEM",
      status: "Received",
      orderDate: "2024-07-25",
    },
    {
      id: 9,
      orderNo: "ORD6749",
      vendorName: "OHI MARKETING",
      status: "Received",
      orderDate: "2024-07-26",
    },
    {
      id: 10,
      orderNo: "ORD9253",
      vendorName: "A-Z Dental World",
      status: "Received",
      orderDate: "2024-07-24",
    },
    {
      id: 11,
      orderNo: "ORD4163",
      vendorName: "SHREEYASH MEDICOS",
      status: "Received",
      orderDate: "2024-07-23",
    },
    {
      id: 12,
      orderNo: "ORD8666",
      vendorName: "SHREEYASH MEDICOS",
      status: "Received",
      orderDate: "2024-07-23",
    },
  ]);

  const handleReceive = (id) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: "Received" } : order));
    alert("Order marked as Received");
  };

  const handleExport = () => {
    exportToExcel(orders, "Purchase_Order_Received_Report");
  };

  // Filter Data
  const filteredOrders = orders.filter((order) => {
      const matchesVendor = order.vendorName.toLowerCase().includes(vendorName.toLowerCase());
      const matchesOrderNo = order.orderNo.toLowerCase().includes(orderNo.toLowerCase());
      return matchesVendor && matchesOrderNo;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          VIEW PURCHASE ORDER
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Vendor Name */}
        <div className="w-full md:w-1/3 space-y-1">
          <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">
            Vendor Name
          </label>
          <Input
            placeholder="Vendor Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
          />
        </div>

        {/* Order No */}
        <div className="w-full md:w-1/3 space-y-1">
          <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">
            Order No
          </label>
          <Input
            placeholder="Order No"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
          />
        </div>

        {/* Search Button (Optional since filtering is real-time, but kept for UI consistency) */}
        <div className="w-full md:w-auto">
          <Button
            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 h-10 w-full md:w-auto shadow-sm transition-all"
          >
            Search
          </Button>
        </div>
      </div>

       {/* Total Count */}
       <div className="flex justify-end pr-2">
         <span className="font-semibold text-gray-600 dark:text-white/60 text-sm">Total : {filteredOrders.length}</span>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr. No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Order No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Vendor Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Order Status
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Order Date
              </TableHead>
              <TableHead className="w-[120px] font-bold text-gray-800 dark:text-white/90 text-center">
                 Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((order, index) => (
                <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 border-b border-gray-200 dark:border-[#443C68]/50"
                >
                    <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {order.orderNo}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3 uppercase text-sm">
                    {order.vendorName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {order.status}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                    {order.orderDate}
                    </TableCell>
                    <TableCell className="py-2 text-center">
                    <Button 
                        onClick={() => handleReceive(order.id)}
                        disabled={order.status === "Received"}
                        className={`text-white h-8 px-4 text-xs rounded shadow-sm ${order.status === "Received" ? "bg-green-600 opacity-50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}`}
                    >
                        {order.status === "Received" ? "Received" : "Receive"}
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Footer / Pagination / Export */}
       <div className="flex justify-between items-center mt-4">
         {/* Excel Export Icon */}
         <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors rounded shadow transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
           </div>
        </div>

        {/* Pagination component */}
        <CustomPagination 
            totalItems={filteredOrders.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
        </div>
    </div>
  );
}
