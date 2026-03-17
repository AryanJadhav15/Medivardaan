"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet } from "lucide-react";
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
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ViewRequestInventory() {
  const [clinicName, setClinicName] = useState("");
  const [inventoryType, setInventoryType] = useState("");
  const [itemName, setItemName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const [tableData, setTableData] = useState([
    {
      id: 1,
      clinicName: "Mansarovar",
      orderNo: "CORD9451",
      status: "Request Pending",
      date: "2025-12-04",
      items: "Medicine A",
      inventoryType: "Medicine"
    },
    {
      id: 2,
      clinicName: "Mansarovar",
      orderNo: "CORD9901",
      status: "Request Pending",
      date: "2025-12-04",
      items: "Equipment B",
      inventoryType: "Material"
    },
    {
      id: 3,
      clinicName: "Dombivali East",
      orderNo: "CORD7208",
      status: "Request Pending",
      date: "2025-06-23",
      items: "Gloves",
      inventoryType: "Material"
    },
    {
      id: 4,
      clinicName: "Vasai west",
      orderNo: "CORD1801",
      status: "Request Pending",
      date: "2024-11-06",
      items: "Syringe",
      inventoryType: "Material"
    },
    {
      id: 5,
      clinicName: "MADHAPUR",
      orderNo: "CORD6067",
      status: "Request Pending",
      date: "2024-10-31",
      items: "Tablets",
      inventoryType: "Medicine"
    },
  ]);

  const handleExport = () => {
    exportToExcel(tableData, "View_Request_Inventory");
  };

  const handleAssign = (id) => {
      alert(`Inventory Assigned for Order ID: ${id}`);
      // In real app, this would open a modal or navigate to assignment page, or update status
      setTableData(tableData.map(item => item.id === id ? {...item, status: "Assigned"} : item));
  };

   // Filter Data
  const filteredData = tableData.filter((item) => {
      const matchesClinic = !clinicName || clinicName === "all" || item.clinicName === clinicName;
      const matchesType = !inventoryType || inventoryType.toLowerCase() === item.inventoryType.toLowerCase(); 
      const matchesItem = item.items.toLowerCase().includes(itemName.toLowerCase()); // Searching against a mock 'items' field
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesType && matchesItem && matchesDate;
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
          VIEW REQUEST INVENTORY
        </h1>
      </div>

      {/* Filters */}
       <div className="flex flex-col gap-4 bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Clinic Name</label>
            <Select value={clinicName} onValueChange={setClinicName}>
              <SelectTrigger className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60">
                <SelectValue placeholder="-- Select Clinic --" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="Mansarovar">Mansarovar</SelectItem>
                <SelectItem value="Dombivali East">Dombivali East</SelectItem>
                <SelectItem value="Vasai west">Vasai west</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Inventory Type</label>
            <Select value={inventoryType} onValueChange={setInventoryType}>
              <SelectTrigger className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60">
                <SelectValue placeholder="--- Select Inventory Type---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material">MATERIAL</SelectItem>
                <SelectItem value="medicine">MEDICINE</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">Item Name</label>
            <Input
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
           <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">From Date</label>
             <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
             />
           </div>
           
           <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase">To Date</label>
             <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
             />
           </div>

            <div className="w-full md:w-1/3">
                <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 h-10 w-full md:w-auto shadow-sm transition-all">
                    Search
                </Button>
            </div>
        </div>
      </div>

      {/* Summary Count */}
      <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
         <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[60px] border-r border-white dark:border-[#635985]/40">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Order No</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Status</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Date</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-b border-gray-200 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50">
                    <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.clinicName}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.orderNo}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.status}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.date}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75">
                        <Button 
                            onClick={() => handleAssign(row.id)}
                            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors font-medium shadow-sm transition-all h-8 text-xs px-4 rounded-md"
                        >
                            Assign Inventory
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
      
       {/* Footer / Pagination */}
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
