"use client";

import React, { useState, useEffect } from "react";
import { Settings, FileSpreadsheet, Loader2 } from "lucide-react";
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
import { reportsService } from "@/api/reports";
import { toast } from "sonner";

export default function DoctorAttendanceReportPage() {
  const [selectedOption, setSelectedOption] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getDoctorAttendanceReport({
        FromDate: fromDate,
        ToDate: toDate,
      });
      if (Array.isArray(data)) {
        setReportData(data);
      } else if (data && Array.isArray(data.data)) {
        setReportData(data.data);
      } else if (data && Array.isArray(data.Data)) {
        setReportData(data.Data);
      } else {
        setReportData([]);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching doctor attendance report:", error);
      toast.error(error.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleExport = () => {
    exportToExcel(reportData, "Doctor_Attendance_Report");
  };

  // Safe getter functions to handle potential API field name variations
  const getDoctorName = (item) => item.doctor || item.doctorName || item.DoctorName || item.strDoctorName || "-";
  const getClinicName = (item) => item.clinic || item.clinicName || item.ClinicName || item.strClinicName || "-";
  const getDate = (item) => item.date || item.attendanceDate || item.AttendanceDate || item.dtDate || "-";
  const getInTime = (item) => item.inTime || item.InTime || item.strInTime || "-";
  const getOutTime = (item) => item.outTime || item.OutTime || item.strOutTime || "-";

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const clinicName = getClinicName(item);
      const matchesClinic = selectedOption === "all" || !selectedOption || clinicName === selectedOption;
      
      let matchesDate = true;
      const itemDateStr = getDate(item);
      if (itemDateStr && itemDateStr !== "-") {
        if (fromDate) matchesDate = matchesDate && new Date(itemDateStr) >= new Date(fromDate);
        if (toDate) matchesDate = matchesDate && new Date(itemDateStr) <= new Date(toDate);
      }

      return matchesClinic && matchesDate;
  });

  // Extract distinct clinics for the select dropdown based on actual data
  const distinctClinics = [...new Set(reportData.map(getClinicName).filter(c => c && c !== "-"))];

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
                <SelectItem value="all">All Clinics</SelectItem>
                {distinctClinics.map((clinic, idx) => (
                    <SelectItem key={idx} value={clinic}>{clinic}</SelectItem>
                ))}
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

        <Button 
            onClick={fetchReportData}
            disabled={loading}
            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium w-full md:w-auto flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-medivardaan-teal" />
                   </TableCell>
                </TableRow>
            ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                <TableRow key={item.id || index} >
                    <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="dark:text-white/75">{getDoctorName(item)}</TableCell>
                    <TableCell className="dark:text-white/75">{getClinicName(item)}</TableCell>
                    <TableCell className="dark:text-white/75">{getDate(item)}</TableCell>
                    <TableCell className="dark:text-white/75">{getInTime(item)}</TableCell>
                    <TableCell className="dark:text-white/75">{getOutTime(item)}</TableCell>
                </TableRow>
                ))
            ) : (
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
          {filteredData.length > 0 && (
            <CustomPagination 
                totalItems={filteredData.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
          )}
      </div>
    </div>
  );
}
