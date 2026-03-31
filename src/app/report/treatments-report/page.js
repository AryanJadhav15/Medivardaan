"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet, FileBarChart2 } from "lucide-react";
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

export default function TreatmentsReportPage() {
  const [clinic, setClinic] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data inferred standard report structure
  const [reportData, setReportData] = useState([
    { id: 1, clinic: "Nerul", doctor: "Dr.Riddhi Rathi", patient: "John Doe", treatment: "Root Canal", date: "2021-05-26", fees: "2500.00" },
    { id: 2, clinic: "ELECTRONIC CITY", doctor: "Dr.Akhil Nair", patient: "Jane Smith", treatment: "Dental Cleaning", date: "2021-05-26", fees: "1500.00" },
    { id: 3, clinic: "Nerul", doctor: "Dr.Neha S", patient: "Bob Johnson", treatment: "Consultation", date: "2021-01-04", fees: "500.00" },
    { id: 4, clinic: "GOREGAON East", doctor: "Dr.Prajakta Durgawale", patient: "Alice Brown", treatment: "X-Ray", date: "2021-01-04", fees: "800.00" },
    { id: 5, clinic: "VADODARA", doctor: "Dr.Khushbu Ranva", patient: "Charlie Davis", treatment: "Filling", date: "2021-01-04", fees: "1200.00" },
    { id: 6, clinic: "Virar", doctor: "Dr.RUCHI BHANSALI", patient: "Eva White", treatment: "Extraction", date: "2021-01-04", fees: "3000.00" },
    { id: 7, clinic: "Camp,pune", doctor: "Dr.Anagha Patil Chavan", patient: "Frank Miller", treatment: "Braces Adjustment", date: "2020-09-01", fees: "2000.00" },
    { id: 8, clinic: "Andheri East (takshila)", doctor: "Dr.Riddhi Rathi", patient: "Grace Wilson", treatment: "Whitening", date: "2020-09-10", fees: "5000.00" },
    { id: 9, clinic: "Andheri West (Juhu)", doctor: "Dr.Tejal shah", patient: "Henry Moore", treatment: "Consultation", date: "2021-01-02", fees: "500.00" },
    { id: 10, clinic: "Aundh", doctor: "Dr.Anagha Patil Chavan", patient: "Ivy Taylor", treatment: "Root Canal", date: "2020-12-29", fees: "2500.00" },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Treatments_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
    const matchesClinic = !clinic || clinic === "all" || item.clinic.toLowerCase().includes(clinic.toLowerCase());
    const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
    const matchesTreatment = item.treatment.toLowerCase().includes(treatmentName.toLowerCase());

    let matchesDate = true;
    if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
    if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

    return matchesClinic && matchesDoctor && matchesTreatment && matchesDate;
});

// Pagination Logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileBarChart2 className="w-5 h-5 text-primary animate-spin-slow" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          TREATMENTS REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
             <Select value={clinic} onValueChange={setClinic}>
              <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="-- Select Clinic --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="nerul">Nerul</SelectItem>
                <SelectItem value="electronic-city">ELECTRONIC CITY</SelectItem>
                 <SelectItem value="GOREGAON East">GOREGAON East</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Doctor Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
           <div className="flex-1">
            <Input
              type="date"
              placeholder="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
           <div className="flex-1">
            <Input
              type="date"
              placeholder="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/4">
                 <Input
                placeholder="Treatment Name"
                value={treatmentName}
                onChange={(e) => setTreatmentName(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all w-full md:w-auto">
              Search
            </Button>
        </div>
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
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right pr-6">Fees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                 <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                <TableCell className="dark:text-white/75">{item.patient}</TableCell>
                <TableCell className="dark:text-white/75">{item.treatment}</TableCell>
                <TableCell className="dark:text-white/75">{item.date}</TableCell>
                <TableCell className="dark:text-white/75 text-right pr-6">{item.fees}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={7} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
