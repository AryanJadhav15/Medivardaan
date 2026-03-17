"use client";

import React, { useState } from "react";
import { Package, Settings, FileSpreadsheet } from "lucide-react";
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

export default function HeadOfficeStock() {
  const [inventoryType, setInventoryType] = useState("");
  const [itemName, setItemName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image structure
  const [tableData, setTableData] = useState([
    {
      id: 1,
      inventoryType: "MATERIAL",
      itemName: "Cold cure Powder",
      brandName: "DPI",
      packaging: "Bottle",
      rate: "169.50",
      openingStock: "0",
      currentStock: "0",
    },
    {
      id: 2,
      inventoryType: "MATERIAL",
      itemName: "clod cure liquid",
      brandName: "DPI",
      packaging: "Bottle",
      rate: "169.50",
      openingStock: "0",
      currentStock: "0",
    },
    {
      id: 3,
      inventoryType: "MATERIAL",
      itemName: "Composite",
      brandName: "SafeEndo",
      packaging: "Syringe",
      rate: "562.50",
      openingStock: "0",
      currentStock: "0",
    },
    {
      id: 4,
      inventoryType: "MATERIAL",
      itemName: "Epoxyseal",
      brandName: "SafeEndo",
      packaging: "Syringe",
      rate: "1120.00",
      openingStock: "0",
      currentStock: "0",
    },
    {
      id: 5,
      inventoryType: "MATERIAL",
      itemName: "Calahyd - Rc",
      brandName: "MAARC",
      packaging: "Syringe",
      rate: "685.00",
      openingStock: "5",
      currentStock: "5",
    },
    {
      id: 6,
      inventoryType: "MEDICINE",
      itemName: "Aoua Mouthwash",
      brandName: "Dente 91",
      packaging: "Bottle",
      rate: "37.12",
      openingStock: "0",
      currentStock: "100",
    },
    {
      id: 7,
      inventoryType: "MEDICINE",
      itemName: "sensitive toothpaste",
      brandName: "Dente 91",
      packaging: "Tube",
      rate: "134.92",
      openingStock: "0",
      currentStock: "50",
    },
    {
      id: 8,
      inventoryType: "MEDICINE",
      itemName: "DB Toothpaste",
      brandName: "Dente 91",
      packaging: "Tube",
      rate: "168.81",
      openingStock: "0",
      currentStock: "100",
    },
    {
      id: 9,
      inventoryType: "MEDICINE",
      itemName: "She Toothpaste",
      brandName: "Dente 91",
      packaging: "Tube",
      rate: "148.47",
      openingStock: "0",
      currentStock: "100",
    },
    {
      id: 10,
      inventoryType: "MEDICINE",
      itemName: "Dente 91 toothpaste",
      brandName: "Dente 91",
      packaging: "Tube",
      rate: "121.36",
      openingStock: "0",
      currentStock: "0",
    },
  ]);

  const handleRateChange = (id, value) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, rate: value } : row))
    );
  };

  const handleOpeningStockChange = (id, value) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, openingStock: value } : row
      )
    );
  };

  const handleExport = () => {
    exportToExcel(tableData, "Head_Office_Stock");
  };

  // Filter Data
  const filteredData = tableData.filter(item => {
      const matchesType = !inventoryType || inventoryType === "all" || item.inventoryType.toLowerCase() === inventoryType.toLowerCase();
      const matchesName = item.itemName.toLowerCase().includes(itemName.toLowerCase());
      return matchesType && matchesName;
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
          ADD HEAD OFFICE STOCK
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        <div className="w-full md:w-1/3">
             <Select value={inventoryType} onValueChange={setInventoryType}>
                <SelectTrigger className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60">
                <SelectValue placeholder="--- Select Inventory Type---" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Check All</SelectItem>
                <SelectItem value="material">MATERIAL</SelectItem>
                <SelectItem value="medicine">MEDICINE</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="w-full md:w-1/3">
             <Input
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="h-10 bg-white dark:bg-[#443C68] border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60"
            />
        </div>

        <div className="w-full md:w-auto">
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 h-10 w-full md:w-auto shadow-sm transition-all">
                Search
            </Button>
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[60px] border-r border-white dark:border-[#635985]/40">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Inventory Type</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Item Name</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Brand Name</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">Packaging</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[120px] border-r border-white dark:border-[#635985]/40">Rate</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[120px] border-r border-white dark:border-[#635985]/40">Opening Stock</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">Current Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-b border-gray-200 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50">
                    <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.inventoryType}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.itemName}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.brandName}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50">{row.packaging}</TableCell>
                    <TableCell className="border-r border-gray-200 dark:border-[#443C68]/50">
                        <Input
                            type="number"
                            value={row.rate}
                            onChange={(e) => handleRateChange(row.id, e.target.value)}
                            className="h-8 w-24 bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                        />
                    </TableCell>
                    <TableCell className="border-r border-gray-200 dark:border-[#443C68]/50">
                        <Input
                            type="number"
                            value={row.openingStock}
                            onChange={(e) => handleOpeningStockChange(row.id, e.target.value)}
                            className="h-8 w-24 bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                        />
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white/75">{row.currentStock}</TableCell>
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

       {/* Footer / Pagination */}
       <div className="flex justify-between items-center mt-4">
         {/* Excel Export Icon */}
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
