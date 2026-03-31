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

export default function MedicinesCollectionReportPage() {
  const [clinic, setClinic] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [reportData, setReportData] = useState([
    { id: 1, clinic: "Nerul", doctor: "Dr.Riddhi Rathi", medicine: "Acecloran Plus", price: "60.00", qty: "1", discount: "5.78", collection: "54.22", date: "2025-12-06" },
    { id: 2, clinic: "ELECTRONIC CITY", doctor: "Dr.Akhil Nair", medicine: "Acerate-SP", price: "160.00", qty: "1", discount: "13.06", collection: "146.94", date: "2025-12-08" },
    { id: 3, clinic: "Nerul", doctor: "Dr.Neha S", medicine: "Acerate-SP", price: "160.00", qty: "1", discount: "48.90", collection: "111.10", date: "2025-12-08" },
    { id: 4, clinic: "GOREGAON East", doctor: "Dr.Prajakta Durgawale", medicine: "agidine", price: "205.00", qty: "3", discount: "61.03", collection: "553.97", date: "2025-12-10" },
    { id: 5, clinic: "VADODARA", doctor: "Dr.Khushbu Ranva", medicine: "agidine", price: "205.00", qty: "2", discount: "-9.94", collection: "419.94", date: "2025-12-11" },
    { id: 6, clinic: "Virar", doctor: "Dr.RUCHI BHANSALI", medicine: "agidine", price: "205.00", qty: "4", discount: "32.02", collection: "787.98", date: "2025-12-12" },
    { id: 7, clinic: "Camp,pune", doctor: "Dr.Anagha Patil Chavan", medicine: "Amokat CV 625", price: "223.00", qty: "1", discount: "114.00", collection: "109.00", date: "2025-12-15" },
    { id: 8, clinic: "Andheri East (takshila)", doctor: "Dr.Riddhi Rathi", medicine: "Amoxybest-CV 625", price: "122.00", qty: "1", discount: "18.90", collection: "103.10", date: "2025-12-16" },
    { id: 9, clinic: "Andheri West (Juhu)", doctor: "Dr.Tejal shah", medicine: "Amoxybest-CV 625", price: "122.00", qty: "10", discount: "171.68", collection: "1048.32", date: "2025-12-18" },
    { id: 10, clinic: "Aundh", doctor: "Dr.Anagha Patil Chavan", medicine: "Amoxybest-CV 625", price: "122.00", qty: "14", discount: "165.58", collection: "1542.42", date: "2025-12-20" },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Medicines_Collection_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinic.toLowerCase().includes(clinic.toLowerCase()); 
      const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
      const matchesMedicine = item.medicine.toLowerCase().includes(medicineName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDoctor && matchesMedicine && matchesDate;
  });

   // Calculate Total
  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.collection), 0).toFixed(2);


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
          MEDICINES COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">Clinic Name</label>
            <Select value={clinic} onValueChange={setClinic}>
              <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="-- Select Clinic --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="nerul">Nerul</SelectItem>
                <SelectItem value="electronic-city">ELECTRONIC CITY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">Doctor Name</label>
            <Input
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
           <div className="flex-1 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">From Date</label>
             <Input
               type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
           <div className="flex-1 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">To Date</label>
            <Input
               type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/4 space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-white/75">Medicines Name</label>
                 <Input
                placeholder="Medicines Name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all w-full md:w-auto h-10 mt-5">
              Search
            </Button>
        </div>
      </div>

       {/* Total Summary */}
       <div className="flex justify-end">
           <div className="text-gray-700 dark:text-white/75 font-medium text-sm">
               Total : {totalAmount}
           </div>
       </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Medicines Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Price</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Qty</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Total Discount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Total Collection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                 <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                <TableCell className="dark:text-white/75">{item.medicine}</TableCell>
                <TableCell className="dark:text-white/75">{item.price}</TableCell>
                <TableCell className="dark:text-white/75">{item.qty}</TableCell>
                <TableCell className="dark:text-white/75">{item.discount}</TableCell>
                <TableCell className="dark:text-white/75">{item.collection}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
