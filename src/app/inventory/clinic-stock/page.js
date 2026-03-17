"use client";

import React, { useState } from "react";
import { Package, FileSpreadsheet } from "lucide-react";
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

export default function ClinicStock() {
  const [clinic, setClinic] = useState("");
  const [itemName, setItemName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for Clinic Stock
  const [tableData, setTableData] = useState([
    {
      id: 1,
      clinicName: "Borivali",
      itemName: "Dental Implants Genesis",
      quantity: 15,
      unit: "Pcs",
      lastUpdated: "2025-12-20",
    },
    {
      id: 2,
      clinicName: "Borivali",
      itemName: "Cotton Rolls",
      quantity: 50,
      unit: "Packets",
      lastUpdated: "2025-12-22",
    },
    {
      id: 3,
      clinicName: "Kalyan Nagar",
      itemName: "Lignocaine Injection",
      quantity: 100,
      unit: "Vials",
      lastUpdated: "2025-12-18",
    },
    {
      id: 4,
      clinicName: "Kalyan Nagar",
      itemName: "Disposable Gloves",
      quantity: 500,
      unit: "Pairs",
      lastUpdated: "2025-12-23",
    },
    {
      id: 5,
      clinicName: "Shahibaug",
      itemName: "Composite Kit",
      quantity: 5,
      unit: "Kits",
      lastUpdated: "2025-12-15",
    },
  ]);

  const handleExport = () => {
    exportToExcel(tableData, "Clinic_Stock");
  };

  // Filter Data
  const filteredData = tableData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinicName.toLowerCase() === clinic.toLowerCase(); // In real app use IDs
      const matchesItem = item.itemName.toLowerCase().includes(itemName.toLowerCase());
      return matchesClinic && matchesItem;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Package className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          CLINIC STOCK
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-white/75">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                    <SelectValue placeholder="-- Select Clinic --" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="Borivali">Borivali</SelectItem>
                    <SelectItem value="Kalyan Nagar">Kalyan Nagar</SelectItem>
                    <SelectItem value="Shahibaug">Shahibaug</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-white/75">Item Name</label>
                <Input
                    placeholder="Search Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>

            <div className="flex gap-2">
                 <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all md:w-auto w-full">
                    Search
                </Button>
            </div>
        </div>
      </div>
      
       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Item Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Quantity</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Unit</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                    <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                    <TableCell className="dark:text-white/75">{row.itemName}</TableCell>
                    <TableCell className="dark:text-white/75">{row.quantity}</TableCell>
                    <TableCell className="dark:text-white/75">{row.unit}</TableCell>
                    <TableCell className="dark:text-white/75">{row.lastUpdated}</TableCell>
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
       <div className="flex justify-between items-center pt-2">
         {/* Excel Export Icon */}
         <Button variant="ghost" size="icon" onClick={handleExport} className="text-primary hover:text-[#0b5c7a]">
              <FileSpreadsheet className="w-6 h-6" />
         </Button>

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
