"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
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
import CustomPagination from "@/components/ui/custom-pagination";

export default function ViewTodaysConfirmedAppointments() {
  const [patientName, setPatientName] = useState("");
  const [patientNo, setPatientNo] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock Data
  const [results, setResults] = useState([
    { patientNo: "P001", patientName: "Aarav Sharma", mobileNo: "9876543210", doctor: "Dr. Kinnari Lade" },
    { patientNo: "P002", patientName: "Vivaan Patil", mobileNo: "8765432109", doctor: "Dr. Rajesh Kumar" },
    { patientNo: "P003", patientName: "Aditya Verma", mobileNo: "7654321098", doctor: "Dr. Priya Singh" },
    { patientNo: "P004", patientName: "Vihaan Singh", mobileNo: "6543210987", doctor: "Dr. Kinnari Lade" },
    { patientNo: "P005", patientName: "Arjun Mehta", mobileNo: "9988776655", doctor: "Dr. Rajesh Kumar" },
    { patientNo: "P006", patientName: "Sai Iyer", mobileNo: "8877665544", doctor: "Dr. Priya Singh" },
    { patientNo: "P007", patientName: "Reyansh Reddy", mobileNo: "7766554433", doctor: "Dr. Kinnari Lade" },
    { patientNo: "P008", patientName: "Ayaan Nair", mobileNo: "6655443322", doctor: "Dr. Rajesh Kumar" },
    { patientNo: "P009", patientName: "Krishna Das", mobileNo: "5544332211", doctor: "Dr. Priya Singh" },
    { patientNo: "P010", patientName: "Ishaan Kapoor", mobileNo: "9998887776", doctor: "Dr. Kinnari Lade" },
  ]);

  const handleSearch = () => {
    setCurrentPage(1);
    // In a real app, you might fetch data here or filter locally
    console.log("Searching for:", { patientName, patientNo });
  };

  const filteredResults = results.filter((item) =>
    item.patientName.toLowerCase().includes(patientName.toLowerCase()) && 
    item.patientNo.toLowerCase().includes(patientNo.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-primary animate-spin-slow" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          Todays Appointment
        </h1>
      </div>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 dark:text-white"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Patient No."
            value={patientNo}
            onChange={(e) => setPatientNo(e.target.value)}
            className="w-full bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 dark:text-white"
          />
        </div>
        <div>
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-[#393053]">
            <TableRow className="hover:bg-primary/20 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="text-center font-bold text-gray-700 dark:text-white/75 w-[100px]">Sr. No.</TableHead>
              <TableHead className="text-center font-bold text-gray-700 dark:text-white/75">Patient No</TableHead>
              <TableHead className="text-center font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="text-center font-bold text-gray-700 dark:text-white/75">Mobile No</TableHead>
              <TableHead className="text-center font-bold text-gray-700 dark:text-white/75">Doctors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow key={index} className="text-center border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                  <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="dark:text-white/75">{item.patientNo}</TableCell>
                  <TableCell className="dark:text-white/75">{item.patientName}</TableCell>
                  <TableCell className="dark:text-white/75">{item.mobileNo}</TableCell>
                  <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500 dark:text-white/60 font-medium"
                >
                  No Record Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination */}
       <div className="flex justify-end pt-4">
             <CustomPagination 
                totalItems={filteredResults.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
       </div>

    </div>
  );
}
