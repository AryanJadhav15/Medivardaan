"use client";

import React, { useState, useEffect } from "react";
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
import { getMedicinesCollectionReport } from "@/api/reports";

export default function MedicinesCollectionReportPage() {
  const [clinic, setClinic] = useState("all");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const [reportData, setReportData] = useState([]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      setCurrentPage(1);
      
      const params = {};
      if (fromDate) params.FromDate = fromDate;
      if (toDate) params.ToDate = toDate;

      const data = await getMedicinesCollectionReport(params);
      const responseArray = Array.isArray(data) ? data : [];
      
      const mappedData = responseArray.map((item, index) => ({
        id: index + 1,
        clinic: item.clinicName || item.ClinicName || item.clinic || "N/A",
        doctor: item.doctorName || item.DoctorName || item.doctor || "N/A",
        medicine: item.medicinesName || "N/A",
        price: item.price || item.Price || 0,
        qty: item.quantity || item.Quantity || item.qty || item.Qty || 0,
        discount: item.discount || item.Discount || item.totalDiscount || item.TotalDiscount || 0,
        collection: item.totalCollection || item.TotalCollection || item.collection || item.Collection || item.amount || item.Amount || 0,
        date: item.date || item.Date || item.createdDate || item.CreatedDate || "",
      }));
      setReportData(mappedData);
    } catch (error) {
      console.error("Failed to fetch medicines collection report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExport = () => {
    exportToExcel(reportData, "Medicines_Collection_Report");
  };

  // Unique clinic names derived from the fetched data for the dropdown
  const uniqueClinicNames = [...new Set(reportData.map((item) => item.clinic).filter(Boolean))].sort();

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = clinic === "all" || item.clinic === clinic;
      const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
      const matchesMedicine = item.medicine.toLowerCase().includes(medicineName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date || new Date()) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date || new Date()) <= new Date(toDate);

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
                {uniqueClinicNames.filter(name => name !== "N/A" && name !== "").map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
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
             <Button
              onClick={fetchReport}
              disabled={isLoading}
              className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-all px-8 font-medium w-full md:w-auto h-10 mt-5"
            >
              {isLoading ? "Loading..." : "Search"}
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
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right">Price</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right">Qty</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right">Total Discount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right">Total Collection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-white/50">Loading report data...</TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            ) : (
              currentItems.map((item, index) => (
                <TableRow key={item.id} >
                  <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                   <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                  <TableCell className="dark:text-white/75 uppercase">{item.medicine}</TableCell>
                  <TableCell className="dark:text-white/75 text-right">{item.price}</TableCell>
                  <TableCell className="dark:text-white/75 text-right">{item.qty}</TableCell>
                  <TableCell className="dark:text-white/75 text-right">{item.discount}</TableCell>
                  <TableCell className="dark:text-white/75 text-right">{item.collection}</TableCell>
                </TableRow>
              ))
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
