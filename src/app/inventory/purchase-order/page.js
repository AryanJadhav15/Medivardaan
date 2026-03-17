"use client";
import React, { useState } from "react";
import Link from "next/link";
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
import { Settings, FileSpreadsheet, ChevronLeft } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function PurchaseOrderPage() {
  const [vendorName, setVendorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [formData, setFormData] = useState({
    vendorName: "",
    orderDate: "",
    status: "Pending" // Default status
  });

  // Mock data matching the screenshot
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNo: "ORD4968",
      vendorName: "PROMIS DENTAL SYSTEM",
      orderDate: "2025-01-01",
      status: "Received",
    },
    {
      id: 2,
      orderNo: "ORD5814",
      vendorName: "Nidhi Dental Solution",
      orderDate: "2024-10-11",
      status: "Received",
    },
    {
      id: 3,
      orderNo: "ORD3123",
      vendorName: "A-Z Dental World",
      orderDate: "2024-10-02",
      status: "Received",
    },
    {
      id: 4,
      orderNo: "ORD7594",
      vendorName: "PROMIS DENTAL SYSTEM",
      orderDate: "2024-08-03",
      status: "Received",
    },
    {
        id: 5,
        orderNo: "ORD3068",
        vendorName: "PROMIS DENTAL SYSTEM",
        orderDate: "2024-08-23",
        status: "Received",
    },
      {
        id: 6,
        orderNo: "ORD9755",
        vendorName: "PROMIS DENTAL SYSTEM",
        orderDate: "2024-08-17",
        status: "Received",
      },
      {
        id: 7,
        orderNo: "ORD3393",
        vendorName: "A-Z Dental World",
        orderDate: "2024-07-31",
        status: "Received",
      },
      {
        id: 8,
        orderNo: "ORD7751",
        vendorName: "PROMIS DENTAL SYSTEM",
        orderDate: "2024-07-25",
        status: "Received",
      },
      {
        id: 9,
        orderNo: "ORD6749",
        vendorName: "OHI MARKETING",
        orderDate: "2024-07-26",
        status: "Received",
      },
      {
        id: 10,
        orderNo: "ORD9253",
        vendorName: "A-Z Dental World",
        orderDate: "2024-07-24",
        status: "Received",
      }
  ]);

  // Derived filtered data
  const filteredOrders = orders.filter((order) => {
    const matchesVendor = order.vendorName.toLowerCase().includes(vendorName.toLowerCase());
    
    // Date filtering
    let matchesDate = true;
    if (fromDate) {
        matchesDate = matchesDate && new Date(order.orderDate) >= new Date(fromDate);
    }
    if (toDate) {
        matchesDate = matchesDate && new Date(order.orderDate) <= new Date(toDate);
    }

    return matchesVendor && matchesDate;
  });

  const handleExport = () => {
    exportToExcel(orders, "Purchase_Order_Report");
  };

  const handleAddNew = () => {
      setIsView("form");
      setFormData({ vendorName: "", orderDate: new Date().toISOString().split('T')[0], status: "Pending" });
  };

  const handleCancel = () => {
      setIsView("list");
  };

  const handleSubmit = () => {
      if(!formData.vendorName) return;
      const newId = Math.max(...orders.map(o => o.id)) + 1;
      const newOrder = {
          id: newId,
          orderNo: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
          ...formData
      };
      setOrders([newOrder, ...orders]);
      setIsView("list");
  };

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
          PURCHASE ORDER
        </h1>
      </div>

      {isView === "list" ? (
        <>
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
                
                {/* Vendor Name */}
                <div className="w-full md:w-1/4 space-y-1">
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

                {/* From Date */}
                <div className="w-full md:w-1/4 space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">
                    From Date
                </label>
                <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
                />
                </div>

                {/* To Date */}
                <div className="w-full md:w-1/4 space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">
                    To Date
                </label>
                <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
                />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 w-full md:w-auto">
                <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 h-10 shadow-sm transition-all">
                    Search
                </Button>
                <Button onClick={handleAddNew} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-4 h-10 shadow-sm transition-all">
                    Add New Order
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
                    <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40 text-center">
                        Order Date
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 dark:text-white/90 text-center">
                        Order Status
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
                            <TableCell className="border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                            <Link href="#" className="text-blue-500 hover:underline font-medium dark:text-[#635985]">
                                {order.orderNo}
                            </Link>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3 uppercase text-sm">
                            {order.vendorName}
                            </TableCell>
                            <TableCell className="text-center text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                            {order.orderDate}
                            </TableCell>
                            <TableCell className="text-center text-gray-600 dark:text-white/75 py-3">
                            {order.status}
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-white/50">No records found</TableCell>
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
        </>
      ) : (
          /* Form View */
        <div className="bg-white dark:bg-[#393053] p-6 rounded-lg shadow-sm space-y-6">
            <div className="space-y-4">
                <h2 className="text-lg font-bold">New Purchase Order</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Vendor Name</label>
                        <Input value={formData.vendorName} onChange={(e) => setFormData({...formData, vendorName: e.target.value})} placeholder="Enter Vendor Name" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Order Date</label>
                        <Input type="date" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} />
                     </div>
                </div>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px]">Submit</Button>
                <Button onClick={handleCancel} variant="destructive" className="bg-primary hover:bg-primary/90 min-w-[100px]">Cancel</Button>
            </div>
        </div>
      )}
    </div>
  );
}
