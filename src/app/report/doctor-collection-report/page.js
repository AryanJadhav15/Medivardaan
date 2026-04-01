"use client";

import React, { useState, useEffect } from "react";
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
import { getDoctorCollectionReport } from "@/api/reports";

export default function DoctorCollectionReportPage() {
  const [clinic, setClinic] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const [reportData, setReportData] = useState([]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      setCurrentPage(1);
      const data = await getDoctorCollectionReport(fromDate, toDate);
      const responseArray = Array.isArray(data) ? data : [];
      const mappedData = responseArray.map((item, index) => ({
        id: index + 1,
        clinic: item.clinicName || item.ClinicName || "N/A",
        doctor: item.doctorName || item.DoctorName || "N/A",
        treatmentAmount: item.treatmentPaidAmount ?? item.TreatmentPaidAmount ?? 0,
        medicineAmount: item.medicinesPaidAmount ?? item.MedicinesPaidAmount ?? 0,
      }));
      setReportData(mappedData);
    } catch (error) {
      console.error("Failed to fetch doctor collection report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExport = () => {
    exportToExcel(reportData, "Doctor_Collection_Report");
  };

  // Unique clinic names derived from the fetched data for the dropdown
  const uniqueClinicNames = [...new Set(reportData.map((item) => item.clinic).filter(Boolean))].sort();

  // Filter Data (date filtering is done server-side via the Search button)
  const filteredData = reportData.filter((item) => {
    const matchesClinic = !clinic || clinic === "all" || item.clinic === clinic;
    const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
    return matchesClinic && matchesDoctor;
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
                    {uniqueClinicNames.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
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

          <Button onClick={fetchReport} disabled={isLoading} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white transition-colors px-8 font-medium shadow-sm md:w-auto w-full">
            {isLoading ? "Loading..." : "Search"}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-white/50">Loading report data...</TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            ) : (
              currentItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell className="dark:text-white/75">{item.clinic}</TableCell>
                  <TableCell className="dark:text-white/75">{item.doctor}</TableCell>
                  <TableCell className="dark:text-white/75">{item.treatmentAmount}</TableCell>
                  <TableCell className="dark:text-white/75">{item.medicineAmount}</TableCell>
                </TableRow>
              ))
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
