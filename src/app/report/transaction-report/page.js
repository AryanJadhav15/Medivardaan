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

export default function TransactionReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [clinic, setClinic] = useState("");
  const [patient, setPatient] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [tableData, setTableData] = useState([
    {
      id: 1,
      invoiceNo: "MAH008112526",
      clinicName: "dhanori",
      patientName: "pratiksha sontakke",
      age: "0",
      paidAmount: "2,400.00",
      paymentMode: "UPI",
      paidDate: "2025-12-23",
      treatmentName: "COMPOSITE RESIN RESTORATION-G1",
      groupName: "General",
    },
    {
      id: 2,
      invoiceNo: "MAH008122526",
      clinicName: "Camp.pune",
      patientName: "Sahil Sayyed",
      age: "35",
      paidAmount: "18,000.00",
      paymentMode: "FIBE",
      paidDate: "2025-12-23",
      treatmentName: "CROWN - Z-5YW",
      groupName: "General",
    },
    {
      id: 3,
      invoiceNo: "KAR008102526",
      clinicName: "MANGALORE",
      patientName: "amar g khandare",
      age: "22",
      paidAmount: "5,000.00",
      paymentMode: "UPI",
      paidDate: "2025-12-23",
      treatmentName: "DENTAL IMPLANTS - NR-LINE",
      groupName: "Implant",
    },
    {
      id: 4,
      invoiceNo: "INV186483",
      clinicName: "MANGALORE",
      patientName: "Naushad Mng",
      age: "27",
      paidAmount: "5,000.00",
      paymentMode: "Cash",
      paidDate: "2025-12-23",
      treatmentName: "ALIGNER - EXCLUSIVE",
      groupName: "Damon",
    },
    {
      id: 5,
      invoiceNo: "INV156989",
      clinicName: "Vapi",
      patientName: "Jinal Kharad",
      age: "0",
      paidAmount: "2,000.00",
      paymentMode: "Cash",
      paidDate: "2025-12-23",
      treatmentName: "CERAMIC BRACES - CLASSIC",
      groupName: "Braces",
    },
    {
      id: 6,
      invoiceNo: "INV192297",
      clinicName: "MANGALORE",
      patientName: "Reshma Mng",
      age: "32",
      paidAmount: "30,000.00",
      paymentMode: "UPI",
      paidDate: "2025-12-23",
      treatmentName: "ALIGNER-PREMIUM",
      groupName: "Damon",
    },
    {
      id: 7,
      invoiceNo: "INV194193",
      clinicName: "Salunkhe vihar",
      patientName: "Krishna Suthar",
      age: "21",
      paidAmount: "100.00",
      paymentMode: "UPI",
      paidDate: "2025-12-23",
      treatmentName: "Consultation Charges",
      groupName: "General",
    },
    {
      id: 8,
      invoiceNo: "INV194153",
      clinicName: "Kalyan",
      patientName: "Pravin Khaire",
      age: "29",
      paidAmount: "500.00",
      paymentMode: "UPI",
      paidDate: "2025-12-22",
      treatmentName: "Consultation Charges",
      groupName: "General",
    },
  ]);

  const handleExport = () => {
    exportToExcel(tableData, "Transaction_Report");
  };

   // Filter Data
   const filteredData = tableData.filter((item) => {
    const matchesClinic = !clinic || clinic === "all" || item.clinicName.toLowerCase().includes(clinic.toLowerCase());
    const matchesPatient = item.patientName.toLowerCase().includes(patient.toLowerCase());
    
    let matchesDate = true;
    if (fromDate) matchesDate = matchesDate && new Date(item.paidDate) >= new Date(fromDate);
    if (toDate) matchesDate = matchesDate && new Date(item.paidDate) <= new Date(toDate);

    return matchesClinic && matchesPatient && matchesDate;
});

const handleClear = () => {
    setClinic("");
    setPatient("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
}

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
          VIEW TRANSACTION REPORT
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
                    <SelectItem value="dhanori">Dhanori</SelectItem>
                     <SelectItem value="MANGALORE">Mangalore</SelectItem>
                     <SelectItem value="Camp.pune">Camp Pune</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-white/75">Patient</label>
                <Input
                    placeholder="Patient"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
                 <Input
                    type="date"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
            <div>
                 <Input
                    type="date"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                />
            </div>
            <div className="flex gap-2">
                 <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all" onClick={() => setCurrentPage(1)}>
                    Search
                </Button>
                 <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all" onClick={handleClear}>
                    Clear
                </Button>
            </div>
        </div>
      </div>

       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
       <div className="overflow-x-auto">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Invoice No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Age</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">PaidAmount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">PaymentMode</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Paid Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">TreatmentName</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">GroupName</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow key={row.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.invoiceNo}</TableCell>
                <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                <TableCell className="dark:text-white/75">{row.patientName}</TableCell>
                <TableCell className="dark:text-white/75">{row.age}</TableCell>
                <TableCell className="dark:text-white/75">{row.paidAmount}</TableCell>
                <TableCell className="dark:text-white/75">{row.paymentMode}</TableCell>
                <TableCell className="dark:text-white/75 whitespace-nowrap">{row.paidDate}</TableCell>
                <TableCell className="dark:text-white/75">{row.treatmentName}</TableCell>
                <TableCell className="dark:text-white/75">{row.groupName}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={10} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
