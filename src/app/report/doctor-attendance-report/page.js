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

export default function DoctorAttendanceReportPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [reportData, setReportData] = useState([
    { id: 1, doctor: "Dr.Sabeena Khan", clinic: "Clinic A", date: "2021-05-26", inTime: "10:39 AM", outTime: "" },
    { id: 2, doctor: "Dr.SHRADDHA KAMBALE", clinic: "Clinic B", date: "2021-01-04", inTime: "07:47 PM", outTime: "" },
    { id: 3, doctor: "Dr.SHRADDHA KAMBALE", clinic: "Clinic B", date: "2020-10-30", inTime: "11:32 AM", outTime: "" },
    { id: 4, doctor: "Dr.Jahnavi Patel", clinic: "Clinic A", date: "2021-01-04", inTime: "09:51 AM", outTime: "" },
    { id: 5, doctor: "Dr.Jahnavi Patel", clinic: "Clinic A", date: "2021-01-04", inTime: "09:51 AM", outTime: "" },
    { id: 6, doctor: "Dr.Jahnavi Patel", clinic: "Clinic A", date: "2021-01-04", inTime: "09:51 AM", outTime: "" },
    { id: 7, doctor: "Dr.ANGIE FERNANDES", clinic: "Clinic C", date: "2020-09-01", inTime: "11:00 AM", outTime: "" },
    { id: 8, doctor: "Dr.ANGIE FERNANDES", clinic: "Clinic C", date: "2020-09-10", inTime: "11:04 AM", outTime: "" },
    { id: 9, doctor: "Dr.isha jain", clinic: "Clinic A", date: "2021-01-02", inTime: "10:48 AM", outTime: "" },
    { id: 10, doctor: "Dr.isha jain", clinic: "Clinic A", date: "2020-12-29", inTime: "01:50 PM", outTime: "" },
  ]);

   const handleExport = () => {
    exportToExcel(reportData, "Doctor_Attendance_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      // Mocking 'selectedOption' as Clinic Filter for now since label was vague in original code
      const matchesClinic = !selectedOption || item.clinic === selectedOption;
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDate;
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
          DOCTOR ATTENDANCE REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/4 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">Clinic</label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="--- Select Clinic ---" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Clinic A">Clinic A</SelectItem>
                <SelectItem value="Clinic B">Clinic B</SelectItem>
                 <SelectItem value="Clinic C">Clinic C</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="w-full md:w-1/4 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">From Date</label>
          <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
          />
        </div>

        <div className="w-full md:w-1/4 space-y-1">
             <label className="text-xs font-medium text-gray-700 dark:text-white/75">To Date</label>
          <Input
             type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
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
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">In Time</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Out Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                <TableCell className="dark:text-white/75">{item.date}</TableCell>
                <TableCell className="dark:text-white/75">{item.inTime}</TableCell>
                <TableCell className="dark:text-white/75">{item.outTime}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination Placeholder */}
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
