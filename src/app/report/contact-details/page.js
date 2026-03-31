"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet } from "lucide-react";
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
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ContactDetailsPage() {
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [contacts, setContacts] = useState([
    { id: 1, name: "APP DENTAL EQUIPMENTS", mobile: "9385854891" },
    { id: 2, name: "ORTHODENTCO", mobile: "9944223424" },
    { id: 3, name: "VINAYAGA", mobile: "7550066982" },
    { id: 4, name: "BHASKAR", mobile: "9094828083" },
    { id: 5, name: "MASOOD LASER UNIT", mobile: "9884313950" },
    { id: 6, name: "porter app", mobile: "8855401658" },
    { id: 7, name: "thanisandra water tanker", mobile: "9702057226" },
    { id: 8, name: "Mahek", mobile: "7700011473" },
    { id: 9, name: "mamta", mobile: "9067895507" },
    { id: 10, name: "unicorn lab", mobile: "7405707611" },
    { id: 11, name: "Dental World", mobile: "9876543210" },
  ]);

  const handleExport = () => {
    exportToExcel(contacts, "Contact_Details");
  };

  // Filter Data
  const filteredData = contacts.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileSpreadsheet className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          CONTACT DETAILS
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">Name</label>
            <Input
            placeholder="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full"
            />
        </div>

        <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all w-full md:w-auto">
          Search
        </Button>
      </div>

       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[80px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right pr-12">Mobile No</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((contact, index) => (
              <TableRow key={contact.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75 uppercase">{contact.name}</TableCell>
                <TableCell className="dark:text-white/75 text-right pr-12">{contact.mobile}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={3} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" size="icon" onClick={handleExport} className="text-green-600 hover:text-green-700">
          <FileSpreadsheet className="w-8 h-8" />
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
