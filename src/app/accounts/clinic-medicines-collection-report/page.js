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

export default function ClinicMedicinesCollectionReportPage() {
  const [clinicName, setClinicName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    { id: 1, clinicName: "Vile Parle", doctorName: "Dr.Riddhi Rathi", patientCode: "P21937", patientName: "RAKSHIT K S", mobileNo: "9820651623", grandAmount: "2500.00", paidAmount: "2500.00", pendingAmount: "0.00", paymentMode: "Cash" },
    { id: 2, clinicName: "Rohini", doctorName: "Dr.Apurva Vaidya", patientCode: "P96019", patientName: "Gaurav bhatt", mobileNo: "9716319856", grandAmount: "2000.00", paidAmount: "2000.00", pendingAmount: "0.00", paymentMode: "UPI" },
    { id: 3, clinicName: "Goregaon East", doctorName: "Dr.Prajakta Durgawale", patientCode: "P115352", patientName: "pream singh", mobileNo: "8369394987", grandAmount: "3000.00", paidAmount: "3000.00", pendingAmount: "0.00", paymentMode: "UPI" },
    { id: 4, clinicName: "Wadgaon Sheri", doctorName: "Dr.Dhanashree Shinde", patientCode: "P113777", patientName: "veena more", mobileNo: "7039931983", grandAmount: "1138.00", paidAmount: "1138.00", pendingAmount: "0.00", paymentMode: "UPI" },
    { id: 5, clinicName: "Wadgaon Sheri", doctorName: "Dr.Dhanashree Shinde", patientCode: "P114004", patientName: "naresh komti", mobileNo: "9850217587", grandAmount: "1185.00", paidAmount: "1185.00", pendingAmount: "0.00", paymentMode: "UPI" },
    { id: 6, clinicName: "New Yelahanka", doctorName: "Dr.pooja kumari", patientCode: "P109833", patientName: "sreenivasulu p", mobileNo: "8550853614", grandAmount: "4000.00", paidAmount: "2000.00", pendingAmount: "2000.00", paymentMode: "UPI" },
    { id: 7, clinicName: "New Yelahanka", doctorName: "Dr.pooja kumari", patientCode: "P93378", patientName: "chandan M", mobileNo: "7892698504", grandAmount: "800.00", paidAmount: "800.00", pendingAmount: "0.00", paymentMode: "UPI" },
    { id: 8, clinicName: "Wadgaon Sheri", doctorName: "Dr.Dhanashree Shinde", patientCode: "P114516", patientName: "subhash tondarkar", mobileNo: "9822714570", grandAmount: "37000.00", paidAmount: "9000.00", pendingAmount: "28000.00", paymentMode: "Cash" },
    { id: 9, clinicName: "Wadgaon Sheri", doctorName: "Dr.Dhanashree Shinde", patientCode: "P114516", patientName: "subhash tondarkar", mobileNo: "9822714570", grandAmount: "37000.00", paidAmount: "17999.99", pendingAmount: "19000.01", paymentMode: "UPI" },
    { id: 10, clinicName: "Hoodi", doctorName: "Dr.Deepthi Shankar", patientCode: "P111805", patientName: "Soumya Shree R Sinnur", mobileNo: "7022168361", grandAmount: "1000.00", paidAmount: "1000.00", pendingAmount: "0.00", paymentMode: "UPI" },
  ]);

  const [filteredReportData, setFilteredReportData] = useState(reportData);

  useEffect(() => {
    setFilteredReportData(reportData);
  }, [reportData]);

  const handleSearch = () => {
    let result = reportData;

    if (clinicName) {
      const searchStr = clinicName.toLowerCase();
      result = result.filter(item => 
        item.clinicName.toLowerCase().includes(searchStr)
      );
    }
    
     if (fromDate) {
       // Placeholder for date logic
    }
    
    if (toDate) {
       // Placeholder for date logic
    }

    setFilteredReportData(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    exportToExcel(filteredReportData, "Clinic_Medicines_Collection_Report");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportData.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalAmount = filteredReportData.reduce((acc, curr) => {
      // Remove commas from amount string before parsing
      const amountStr = String(curr.paidAmount).replace(/,/g, '');
      return acc + parseFloat(amountStr || 0);
  }, 0);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          CLINIC MEDICINES COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-[#393053] p-4 rounded-lg border border-gray-200 dark:border-[#443C68]/50">
        {/* Clinic Name */}
        <div className="w-full md:w-1/4 space-y-1">
           <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-500 dark:text-white/60 bg-white dark:bg-[#443C68]">
                <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="adajan">ADAJAN</SelectItem>
                <SelectItem value="adyar">ADYAR</SelectItem>
                <SelectItem value="airoli">Airoli</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/4 space-y-1">
           <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white bg-white dark:bg-[#443C68]"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/4 space-y-1">
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

        {/* Total Paid Amount */}
        <div className="w-full md:w-auto flex-1 flex justify-end items-end h-10 pb-1">
             <span className="text-sm font-medium text-gray-700 dark:text-white/75">Total Paid Amount : {totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Doctor Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Patient Code
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Patient Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Mobile No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Grand Amount
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Paid Amount
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                 Pending Amount
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                 Payment Mode
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
                  {row.clinicName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.doctorName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.patientCode}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.patientName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.mobileNo}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.grandAmount}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.paidAmount}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.pendingAmount}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 py-3">
                  {row.paymentMode}
                </TableCell>
              </TableRow>
            ))}
             <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50 bg-gray-50 dark:bg-[#393053]/30">
                 <TableCell colSpan={7} className="border-r border-gray-200 dark:border-[#443C68]/50 py-3 text-right pr-4 font-bold text-gray-700 dark:text-white/75">
                    Total
                 </TableCell>
                 <TableCell className="font-bold text-gray-700 dark:text-white/75 py-3 border-r border-gray-200 dark:border-[#443C68]/50">
                    {totalAmount.toFixed(2)}
                 </TableCell>
                  <TableCell colSpan={2}></TableCell>
             </TableRow>
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
