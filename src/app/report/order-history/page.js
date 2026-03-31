"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function OrderHistoryPage() {
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

 // Mock data
  const [historyData, setHistoryData] = useState([
    { id: 1, clinic: "Clinic 1", doctor: "Dr. Smith", orderId: "ORD001", date: "2025-01-01", status: "Completed", amount: "1500" },
    { id: 2, clinic: "Clinic 2", doctor: "Dr. Jones", orderId: "ORD002", date: "2025-01-02", status: "Pending", amount: "3000" },
    { id: 3, clinic: "Clinic 1", doctor: "Dr. Smith", orderId: "ORD003", date: "2025-01-03", status: "Completed", amount: "1200" },
    { id: 4, clinic: "Clinic 3", doctor: "Dr. Doe", orderId: "ORD004", date: "2025-01-04", status: "Cancelled", amount: "0" },
    { id: 5, clinic: "Clinic 2", doctor: "Dr. Jones", orderId: "ORD005", date: "2025-01-05", status: "Completed", amount: "5500" },
  ]);

  const handleExport = () => {
    exportToExcel(historyData, "Order_History_Report");
  };

  // Filter Data
  const filteredData = historyData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinic === clinic;
      const matchesDoctor = !doctor || doctor === "all" || item.doctor === doctor;
      return matchesClinic && matchesDoctor;
  });

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
          ORDER HISTORY
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-white/75">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                    <SelectValue placeholder="-- Select Clinic --" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="Clinic 1">Clinic 1</SelectItem>
                    <SelectItem value="Clinic 2">Clinic 2</SelectItem>
                    <SelectItem value="Clinic 3">Clinic 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-white/75">Doctor Name</label>
                <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                    <SelectValue placeholder="-- Select Doctor --" />
                    </SelectTrigger>
                    <SelectContent>
                     <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
                    <SelectItem value="Dr. Doe">Dr. Doe</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div>
          <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all md:w-auto w-full">
            Search
          </Button>
        </div>
      </div>
      
       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table Area */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
         <Table>
           <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Order ID</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Status</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Amount</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                    <TableRow key={item.id} >
                        <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                        <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                        <TableCell className="dark:text-white/75">{item.orderId}</TableCell>
                        <TableCell className="dark:text-white/75">{item.date}</TableCell>
                        <TableCell className="dark:text-white/75">{item.status}</TableCell>
                        <TableCell className="dark:text-white/75">{item.amount}</TableCell>
                    </TableRow>
                    ))
                ) : (
                <TableRow>
                     <TableCell colSpan={7} className="text-center py-4 text-gray-500 dark:text-white/50">
                        No Record Available
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
         </Table>
      </div>
      
       {/* Footer / Pagination */}
       <div className="flex justify-between items-center pt-2">
         {/* Excel Export Icon */}
         <Button variant="ghost" size="icon" onClick={handleExport} className="text-green-600 hover:text-green-700">
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
