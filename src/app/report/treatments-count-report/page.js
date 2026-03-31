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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function TreatmentsCountReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [clinic, setClinic] = useState("");
  const [group, setGroup] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data as per previous implementation
  const [tableData, setTableData] = useState([
    {
      id: 1,
      groupName: "Implant",
      clinicName: "Vile-Parle east",
      patientCode: "P7346",
      patientName: "Ghanshyam Patel",
      invoiceNo: "47589",
      grandTotal: "75000.00",
      date: "2025-12-15",
      isNew: false
    },
    {
      id: 2,
      groupName: "General",
      clinicName: "GHATKOPAR East",
      patientCode: "P49668",
      patientName: "Mahesh patel",
      invoiceNo: "47513",
      grandTotal: "75000.00",
      date: "2025-12-16",
      isNew: true
    },
    {
      id: 3,
      groupName: "General",
      clinicName: "Salunkhe vihar",
      patientCode: "P113912",
      patientName: "Pallavi Naykodi",
      invoiceNo: "185090",
      grandTotal: "200.00",
      date: "2025-12-18",
      isNew: false
    },
    {
      id: 4,
      groupName: "General",
      clinicName: "Camp,pune",
      patientCode: "P113923",
      patientName: "Sahil Sayyed",
      invoiceNo: "165089",
      grandTotal: "18000.00",
      date: "2025-12-20",
      isNew: true
    },
    {
      id: 5,
      groupName: "General",
      clinicName: "dhanori",
      patientCode: "P111941",
      patientName: "pratiksha sontakke",
      invoiceNo: "165088",
      grandTotal: "2400.00",
      date: "2025-12-21",
      isNew: false
    },
    {
      id: 6,
      groupName: "Implant",
      clinicName: "MANGALORE",
      patientCode: "P85414",
      patientName: "amar g khandare",
      invoiceNo: "185087",
      grandTotal: "20000.00",
      date: "2025-12-22",
      isNew: false
    },
    {
      id: 7,
      groupName: "General",
      clinicName: "Thane West (RamMarutiRoad)",
      patientCode: "P113553",
      patientName: "Om Baraskar",
      invoiceNo: "165086",
      grandTotal: "1000.00",
      date: "2025-12-23",
      isNew: false
    },
    {
      id: 8,
      groupName: "Braces",
      clinicName: "Thane West (RamMarutiRoad)",
      patientCode: "P113553",
      patientName: "Om Baraskar",
      invoiceNo: "185085",
      grandTotal: "20000.00",
      date: "2025-12-23",
      isNew: false
    },
    {
      id: 9,
      groupName: "General",
      clinicName: "Thane West (RamMarutiRoad)",
      patientCode: "P109994",
      patientName: "Lalit Nagvekar",
      invoiceNo: "165084",
      grandTotal: "4000.00",
      date: "2025-12-23",
      isNew: false
    },
    {
      id: 10,
      groupName: "Implant",
      clinicName: "Thane West (RamMarutiRoad)",
      patientCode: "P113921",
      patientName: "Gilroy DSouza",
      invoiceNo: "185083",
      grandTotal: "100000.00",
      date: "2025-12-23",
      isNew: false
    },
  ]);

  const handleExport = () => {
    exportToExcel(tableData, "Treatments_Count_Report");
  };

   // Filter Data
   const filteredData = tableData.filter((item) => {
    const matchesClinic = !clinic || clinic === "all" || item.clinicName.toLowerCase().includes(clinic.toLowerCase());
    const matchesGroup = !group || group === "all" || item.groupName.toLowerCase() === group.toLowerCase();
    const matchesPatient = item.patientName.toLowerCase().includes(patientName.toLowerCase());
    const matchesNewPatient = !isNewPatient || item.isNew === true; // If checked, only show new.

    let matchesDate = true;
    if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
    if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

    return matchesClinic && matchesGroup && matchesPatient && matchesDate && matchesNewPatient;
  });

  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.grandTotal || 0), 0).toFixed(2);


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileBarChart className="w-5 h-5 text-primary animate-spin-slow" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          TREATMENTS COUNT REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={clinic} onValueChange={setClinic}>
            <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
              <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              <SelectItem value="vile-parle">Vile-Parle east</SelectItem>
               <SelectItem value="GHATKOPAR East">GHATKOPAR East</SelectItem>
               <SelectItem value="Thane West (RamMarutiRoad)">Thane West</SelectItem>
            </SelectContent>
          </Select>

          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
              <SelectValue placeholder="-- Select Group Name --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="implant">Implant</SelectItem>
               <SelectItem value="general">General</SelectItem>
               <SelectItem value="braces">Braces</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
          />

          <div className="flex items-center space-x-2">
            <Checkbox id="newPatients" checked={isNewPatient} onCheckedChange={setIsNewPatient} />
            <Label htmlFor="newPatients" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white/75">
              New Patients
            </Label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 max-w-xs">
                <Input
                    type="date"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
            <div className="flex-1 max-w-xs">
                 <Input
                    type="date"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
             
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all w-full md:w-auto ml-auto">
              Search
            </Button>
        </div>
      </div>

       {/* Summary Details */}
         <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium pt-2 px-1 text-gray-700 dark:text-white/75">
            <div>
                <span>Total Count : <span className="font-bold text-black dark:text-white">{filteredData.length}</span></span>
            </div>
            <div>
                 <span>Grand Total: <span className="font-bold text-black dark:text-white">{totalAmount}</span></span>
            </div>
        </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[80px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Group Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Code</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Invoice No</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow key={row.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.groupName}</TableCell>
                <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                <TableCell className="dark:text-white/75">{row.patientCode}</TableCell>
                <TableCell className="dark:text-white/75">{row.patientName}</TableCell>
                <TableCell className="dark:text-white/75">{row.invoiceNo}</TableCell>
                <TableCell className="text-right dark:text-white/75">{row.grandTotal}</TableCell>
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
