"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Settings, Search, X, FileSpreadsheet, Receipt } from "lucide-react"; 
import CustomPagination from "@/components/ui/custom-pagination";

// Hooks
import { useInvoices } from "@/hooks/useInvoices";
import { useDoctors } from "@/hooks/useDoctors";

export default function ViewInvoicePage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    doctorName: "",
    patientName: "",
    invoiceNo: "",
    fromDate: new Date().toISOString().split("T")[0], 
    toDate: new Date().toISOString().split("T")[0],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Data
  const { data: invoices = [], isLoading, error, refetch } = useInvoices(filters);
  const { data: doctors = [] } = useDoctors();

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    refetch();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClear = () => {
    setFilters({
      clinicName: "",
      doctorName: "",
      patientName: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
    });
    // Optional: automatic refetch on clear or wait for search
  };

  // Client-side pagination logic (assuming API returns all data for now as per previous patterns)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-[#443C68]/50">
        
            <Receipt className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          View Invoices
        </h1>
      </div>

      {/* Filters Section */}
      <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
        <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Clinic Name */}
                <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Clinic Name</Label>
                <Select
                    value={filters.clinicName}
                    onValueChange={(val) => handleFilterChange("clinicName", val)}
                >
                    <SelectTrigger className="h-10 bg-background border-input">
                    <SelectValue placeholder="All Clinics" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="panvel">Panvel</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="nashik">Nashik</SelectItem>
                    <SelectItem value="dwarka">Dwarka</SelectItem>
                    <SelectItem value="vile-parle">Vile-Parle East</SelectItem>
                    <SelectItem value="kharghar">Kharghar</SelectItem>
                    <SelectItem value="lajpat-nagar">Lajpat Nagar</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                {/* Doctor Name */}
                <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Doctor Name</Label>
                <Select
                    value={filters.doctorName}
                    onValueChange={(val) => handleFilterChange("doctorName", val)}
                >
                    <SelectTrigger className="h-10 bg-background border-input">
                    <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent>
                    {doctors.map((doc) => (
                        <SelectItem key={doc.doctorID} value={doc.name}>
                        {doc.name}
                        </SelectItem>
                    ))}
                    {!doctors.length && <SelectItem value="dr-mock">Dr. Mock</SelectItem>}
                    </SelectContent>
                </Select>
                </div>

                {/* Patient Name */}
                <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Patient Name</Label>
                <Input
                    className="h-10 bg-background border-input"
                    placeholder="Search by name..."
                    value={filters.patientName}
                    onChange={(e) => handleFilterChange("patientName", e.target.value)}
                />
                </div>

                {/* Invoice No */}
                <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Invoice No</Label>
                <Input
                    className="h-10 bg-background border-input"
                    placeholder="INV-001..."
                    value={filters.invoiceNo}
                    onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
                />
                </div>
            </div>

            {/* Second Row Filters & Buttons */}
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="space-y-2 w-full md:w-48">
                        <Label className="text-sm font-medium text-foreground/80">From Date</Label>
                        <Input
                            type="date"
                            className="h-10 bg-background border-input hover:cursor-pointer"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 w-full md:w-48">
                        <Label className="text-sm font-medium text-foreground/80 " >To Date</Label>
                        <Input
                            type="date"
                            className="h-10 bg-background border-input hover:cursor-pointer"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange("toDate", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <Button
                    onClick={handleSearch}
                    className="flex-1 md:flex-none bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors h-10 px-6 shadow-sm"
                    >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                    </Button>
                    <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 md:flex-none border-input hover:bg-accent hover:text-accent-foreground h-10 px-6"
                    >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                    </Button>
                </div>
            </div>
            
             {/* Total Count */}
             <div className="flex justify-end pt-2">
                 <span className="text-sm text-gray-600 dark:text-white/60 font-medium">Total Records: {invoices.length}</span>
             </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="border-border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
               <div className="flex justify-center items-center py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mr-3" />
                  <span>Loading invoices...</span>
               </div>
            ) : (
            <Table>
              <TableHeader >
                <TableRow className="border-b border-gray-100 dark:border-[#443C68]/50 hover:bg-primary/10 dark:hover:bg-[#393053]">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Clinic</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Pt. Code</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Mobile</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Total</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Paid</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Pending</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((inv, index) => (
                    <TableRow key={inv.invoiceID || index} className="border-b border-gray-50 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 text-xs">
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell className="py-2 font-medium text-gray-700 dark:text-white/90 uppercase hover:underline">{inv.invoiceNo}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{inv.clinicName}</TableCell>
                      <TableCell className="py-2 text-xs font-mono text-gray-500 dark:text-white/50">{inv.patientCode}</TableCell>
                      <TableCell className="py-2 font-medium text-gray-700 dark:text-white/90 uppercase">{inv.patientName}</TableCell>
                      <TableCell className="py-2 text-gray-600 dark:text-white/75">{inv.mobileNo}</TableCell>
                      <TableCell className="py-2 text-right font-medium text-gray-700 dark:text-white/75">₹{Number(inv.grandTotal).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="py-2 text-right text-green-600 dark:text-green-400 font-semibold">₹{Number(inv.paidAmount).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="py-2 text-right text-orange-600 dark:text-orange-400 font-semibold">₹{Number(inv.pendingAmount || 0).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="py-2 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs hover:bg-primary hover:text-white border-primary/20 text-primary"
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={10} className="text-center py-16 text-muted-foreground bg-muted/5">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="w-10 h-10 text-muted-foreground/50" />
                            <p>No invoices found matching your filters.</p>
                            <Button variant="link" onClick={handleClear} className="text-primary">Clear Filters</Button>
                        </div>
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            )}
          </div>
          
           {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-[#443C68]/50 bg-gray-50 dark:bg-[#18122B]/50">
                 <div className="hidden sm:flex w-[100px]">
                    <span className="text-xs text-gray-500 dark:text-white/50">
                        Page {currentPage} of {Math.ceil(invoices.length / itemsPerPage)}
                    </span>
                 </div>
                 <CustomPagination 
                    totalItems={invoices.length} 
                    itemsPerPage={itemsPerPage} 
                    currentPage={currentPage} 
                    onPageChange={setCurrentPage} 
                 />
                 <div className="flex w-[100px] justify-end">
                    <Button variant="outline" size="sm" className="h-8 w-8 text-green-700 border-green-700 hover:bg-green-50 p-0">
                        <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                 </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
