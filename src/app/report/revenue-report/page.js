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

export default function RevenueReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [clinic, setClinic] = useState("");
  const [group, setGroup] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [reportData, setReportData] = useState([
    {
      id: 1,
      invoiceNo: "88332",
      paidAmount: "13333.00",
      paidDate: "2024-03-31",
      patientName: "DORASWAMY NAIDU",
      clinicName: "Andheri East (takshila)",
      model: "Lite",
      state: "Maharashtra",
      doctorName: "Dr.isha jain",
      designation: "",
      treatmentName: "DENTAL IMPLANTS - OSSTEM",
      groupName: "Implant",
      isNew: false
    },
    {
      id: 2,
      invoiceNo: "88332",
      paidAmount: "1905.00",
      paidDate: "2024-03-31",
      patientName: "DORASWAMY NAIDU",
      clinicName: "Andheri East (takshila)",
      model: "Lite",
      state: "Maharashtra",
      doctorName: "Dr.isha jain",
      designation: "",
      treatmentName: "ROOT CANAL - HAND-POST",
      groupName: "General",
      isNew: false
    },
    {
      id: 3,
      invoiceNo: "88332",
      paidAmount: "4762.00",
      paidDate: "2024-03-31",
      patientName: "DORASWAMY NAIDU",
      clinicName: "Andheri East (takshila)",
      model: "Lite",
      state: "Maharashtra",
      doctorName: "Dr.isha jain",
      designation: "",
      treatmentName: "CROWN - PFM",
      groupName: "General",
      isNew: false
    },
    {
        id: 4,
        invoiceNo: "90495",
        paidAmount: "86667.00",
        paidDate: "2024-03-31",
        patientName: "giridhar bhagat",
        clinicName: "BADLAPUR",
        model: "Premium",
        state: "Maharashtra",
        doctorName: "Dr.Kunal Shet",
        designation: "",
        treatmentName: "DENTAL IMPLANTS - BIOLINE",
        groupName: "Implant",
        isNew: true
      },
       {
        id: 5,
        invoiceNo: "90508",
        paidAmount: "2000.00",
        paidDate: "2024-03-31",
        patientName: "PARINA DESAI",
        clinicName: "Vile-Parle east",
        model: "Exclusive",
        state: "Maharashtra",
        doctorName: "Dr.isha jain",
        designation: "",
        treatmentName: "CROWN - PFM",
        groupName: "General",
        isNew: false
      },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Revenue_Report");
  };

   // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinicName === clinic;
      const matchesGroup = !group || group === "all" || item.groupName === group;
      const matchesPatient = item.patientName.toLowerCase().includes(patientName.toLowerCase());
      const matchesNewPatient = !isNewPatient || item.isNew === true; // If checked, only show new. If unchecked, show all (or could differ depending on use case) - assume unchecked = all.
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.paidDate) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.paidDate) <= new Date(toDate);

      return matchesClinic && matchesGroup && matchesPatient && matchesDate && matchesNewPatient;
  });

  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.paidAmount || 0), 0).toFixed(2);


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
          REVENUE REPORT
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
              <SelectItem value="Andheri East (takshila)">Andheri East (takshila)</SelectItem>
              <SelectItem value="BADLAPUR">BADLAPUR</SelectItem>
              <SelectItem value="Vile-Parle east">Vile-Parle east</SelectItem>
            </SelectContent>
          </Select>

          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
              <SelectValue placeholder="-- Select Group Name --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="Implant">Implant</SelectItem>
               <SelectItem value="General">General</SelectItem>
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
       <div className="overflow-x-auto">
        <Table>
          <TableHeader >
            <TableRow >
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">InvoiceNo</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">PaidAmount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">PaidDate</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">ClinicName</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Model</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">State</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Designation</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">GroupName</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((row, index) => (
              <TableRow key={row.id} >
                <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.invoiceNo}</TableCell>
                <TableCell className="dark:text-white/75">{row.paidAmount}</TableCell>
                <TableCell className="dark:text-white/75 whitespace-nowrap">{row.paidDate}</TableCell>
                <TableCell className="dark:text-white/75">{row.patientName}</TableCell>
                <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                <TableCell className="dark:text-white/75">{row.model}</TableCell>
                <TableCell className="dark:text-white/75">{row.state}</TableCell>
                <TableCell className="dark:text-white/75">{row.doctorName}</TableCell>
                <TableCell className="dark:text-white/75">{row.designation}</TableCell>
                <TableCell className="dark:text-white/75">{row.treatmentName}</TableCell>
                <TableCell className="dark:text-white/75">{row.groupName}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
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
