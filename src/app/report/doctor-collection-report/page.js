"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet, FileBarChart } from "lucide-react";
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

export default function DoctorCollectionReportPage() {
  const [clinic, setClinic] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("2024-12-08"); // Set default to realistic date
  const [toDate, setToDate] = useState("2025-12-23");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [reportData, setReportData] = useState([
    { id: 1, clinic: "DADAR West", doctor: "Dr.Harshada Mane", treatmentAmount: "1025000.00", medicineAmount: "0.00", date: "2025-12-10" },
    { id: 2, clinic: "MALAD West", doctor: "Dr.Swapnali Nachnekar", treatmentAmount: "66173.00", medicineAmount: "1173.04", date: "2025-12-12" },
    { id: 3, clinic: "ELECTRONIC CITY", doctor: "Dr.Shaheda Manjothi", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-15" },
    { id: 4, clinic: "TRICHY", doctor: "Dr.SUVETHA ASHOK", treatmentAmount: "32500.00", medicineAmount: "0.00", date: "2025-12-18" },
    { id: 5, clinic: "BTM", doctor: "Dr.Hajara V K", treatmentAmount: "16800.00", medicineAmount: "0.00", date: "2025-12-20" },
    { id: 6, clinic: "Andheri East (takshila)", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 7, clinic: "Andheri West (Juhu)", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 8, clinic: "bandra west", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 9, clinic: "Goregaon West", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 10, clinic: "GOREGAON East", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Doctor_Collection_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinic.toLowerCase().includes(clinic.toLowerCase()); 
      const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDoctor && matchesDate;
  });

  // Calculate Total
  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.treatmentAmount) + parseFloat(curr.medicineAmount), 0).toFixed(2);


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileBarChart className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          DOCTOR COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-white/75">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                    <SelectValue placeholder="--- Select Clinic ---" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dadar">DADAR West</SelectItem>
                    <SelectItem value="malad">MALAD West</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-white/75">Doctor Name</label>
                 <Input
                    placeholder="Doctor Name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full md:w-auto"
          />

          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full md:w-auto"
          />

          <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all md:w-auto w-full">
            Search
          </Button>

          <div className="ml-auto text-sm font-medium text-gray-700 dark:text-white/75">
            Total Amount : {totalAmount}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[80px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Paid Amount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Medicines Paid Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                <TableCell className="dark:text-white/75">{item.treatmentAmount}</TableCell>
                <TableCell className="dark:text-white/75">{item.medicineAmount}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
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
