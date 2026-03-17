"use client";
import React, { useState, useEffect } from "react";
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
import { FileSpreadsheet, Settings } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function PatientsMedicinesCollectionReportPage() {
  const [clinicName, setClinicName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    {
      id: 1,
      clinic: "Salunkhe vihar",
      patientCode: "P112275",
      patientName: "Krishna Suthar",
      date: "23-12-2025",
      paidTotal: "100.00",
    },
    {
      id: 2,
      clinic: "Toli Chowki",
      patientCode: "P109430",
      patientName: "sophia mehreen",
      date: "23-12-2025",
      paidTotal: "250.00",
    },
    {
      id: 3,
      clinic: "Dombivali East",
      patientCode: "P107053",
      patientName: "kailas sanas",
      date: "23-12-2025",
      paidTotal: "500.00",
    },
    {
      id: 4,
      clinic: "Salunkhe vihar",
      patientCode: "P113938",
      patientName: "mustaq shaikh",
      date: "23-12-2025",
      paidTotal: "100.00",
    },
    {
      id: 5,
      clinic: "Hoodi",
      patientCode: "P108630",
      patientName: "Sneha Priya",
      date: "23-12-2025",
      paidTotal: "200.00",
    },
    {
      id: 6,
      clinic: "Palava",
      patientCode: "P113959",
      patientName: "sanjay raut",
      date: "23-12-2025",
      paidTotal: "400.00",
    },
    {
      id: 7,
      clinic: "GURGAON",
      patientCode: "P112774",
      patientName: "sunakshi mendiratta",
      date: "22-12-2025",
      paidTotal: "1800.00",
    },
    {
      id: 8,
      clinic: "NASHIK ROAD",
      patientCode: "P113127",
      patientName: "nitin thakur",
      date: "22-12-2025",
      paidTotal: "1500.00",
    },
    {
      id: 9,
      clinic: "Hubballi",
      patientCode: "P113825",
      patientName: "LAKKAPPA NANDAGAR",
      date: "22-12-2025",
      paidTotal: "250.00",
    },
    {
      id: 10,
      clinic: "Hubballi",
      patientCode: "P113825",
      patientName: "LAKKAPPA NANDAGAR",
      date: "22-12-2025",
      paidTotal: "0.00",
    },
  ]);

  const [filteredReportData, setFilteredReportData] = useState(reportData);

  useEffect(() => {
    setFilteredReportData(reportData);
  }, [reportData]);

  const parseDate = (dateStr) => {
    // DD-MM-YYYY to Date object
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  const handleSearch = () => {
    let result = reportData;

    if (clinicName && clinicName !== "all") {
       // Normalize clinic name for matching (simple case-insensitive check and hyphen replacement)
       const normalizedSearch = clinicName.replace(/-/g, ' ').toLowerCase();
       result = result.filter(item => 
         item.clinic.toLowerCase().includes(normalizedSearch)
       );
    }

    if (patientName) {
      result = result.filter((item) =>
        item.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    if (fromDate) {
       const from = new Date(fromDate);
       from.setHours(0,0,0,0);
       result = result.filter(item => {
         const itemDate = parseDate(item.date);
         return itemDate && itemDate >= from;
       });
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23,59,59,999);
      result = result.filter(item => {
         const itemDate = parseDate(item.date);
         return itemDate && itemDate <= to;
       });
    }

    setFilteredReportData(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToExcel(filteredReportData, "Patients_Medicines_Collection_Report");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportData.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalRevenue = filteredReportData.reduce((sum, item) => sum + parseFloat(item.paidTotal || 0), 0);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          PATIENTS MEDICINES COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Clinic Dropdown */}
        <div className="w-full md:w-1/5 space-y-1">
          <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]">
              <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              <SelectItem value="salunkhe-vihar">Salunkhe vihar</SelectItem>
              <SelectItem value="toli-chowki">Toli Chowki</SelectItem>
              <SelectItem value="dombivali-east">Dombivali East</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Patient Name */}
        <div className="w-full md:w-1/5 space-y-1">
          <Input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/5 space-y-1">
          <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/5 space-y-1">
          <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button
            onClick={handleSearch}
            className="bg-[#D35400] hover:bg-[#ba4a00] text-white px-8 h-10 w-full md:w-auto transition-colors"
          >
            Search
          </Button>
        </div>
      </div>

       {/* Stats */}
       <div className="flex gap-20 px-4">
        <span className="font-semibold text-gray-700 dark:text-white/75">Total Count : {filteredReportData.length}</span>
        <span className="font-semibold text-gray-700 dark:text-white/75">Revenue Total: {totalRevenue.toFixed(2)}</span>
       </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Patient Code
              </TableHead>
               <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Patient Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                Paid Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 border-b border-gray-200 dark:border-[#443C68]/50"
              >
                <TableCell className="font-medium text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {indexOfFirstItem + index + 1}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.clinic}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.patientCode}
                </TableCell>
                 <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.patientName}
                </TableCell>
                 <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.date}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 py-3 font-medium">
                  {row.paidTotal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination / Export */}
      <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
        <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded shadow transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
           </div>
        </div>
        
        {/* Pagination component */}
        <CustomPagination 
            totalItems={filteredReportData.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
