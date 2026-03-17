"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, ArrowDownCircle, Settings } from "lucide-react";
import * as XLSX from "xlsx";
import CustomPagination from "@/components/ui/custom-pagination";

export default function AccountantExpensePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    {
      id: 1,
      bank: "SBI",
      date: "30-Sep-2022",
      party: "aa",
      natureOfExpense: "100",
      gross: "100.00",
      tds: "100.00",
      netAmount: "100.00",
      modeOfPayment: "Paytm",
      clinic: "aa",
      billNo: "1212121",
      heads: "zzz",
    },
    {
      id: 2,
      bank: "SBI",
      date: "30-Sep-2022",
      party: "aa",
      natureOfExpense: "100",
      gross: "100.00",
      tds: "100.00",
      netAmount: "100.00",
      modeOfPayment: "Paytm",
      clinic: "aa",
      billNo: "1212121",
      heads: "zzz",
    },
    {
      id: 3,
      bank: "SBI",
      date: "10-Mar-2022",
      party: "Test",
      natureOfExpense: "5000",
      gross: "5000.00",
      tds: "5000.00",
      netAmount: "5000.00",
      modeOfPayment: "Paytm",
      clinic: "Test Clinic",
      billNo: "854785445",
      heads: "Test",
    },
  ]);

  const handleDownloadBlankSheet = () => {
    const headers = [
      {
        bank: "",
        date: "",
        party: "",
        natureOfExpense: "",
        gross: "",
        tds: "",
        netAmount: "",
        modeOfPayment: "",
        clinic: "",
        billNo: "",
        heads: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(headers);
    
    // Fix headers row (optional: make them more readable if needed, or stick to keys)
    // XLSX.utils.sheet_add_aoa(worksheet, [["Bank", "Date", "Party", "Nature Of Expense", "Gross", "Tds", "Net Amount", "Mode Of Payment", "Clinic", "Bill Or Ref No", "Major And Minor Heads"]], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Template");
    XLSX.writeFile(workbook, "Accountant_Expense_Template.xlsx");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data && data.length > 0) {
        // Map data to ensure structure matches state (assuming template keys match)
        // Note: Imported data keys depend on the Excel headers. 
        // If template uses keys 'bank', 'date' etc directly, fine.
        // If template uses nice headers "Bank", "Date", mapping is needed.
        
        // For simplicity, assuming validation is loose or template matches keys.
        // Adding simple ID generation
        const newEntries = data.map((item, index) => ({
          id: Date.now() + index, // simple unique id
          bank: item.bank || item.Bank || "",
          date: item.date || item.Date || "",
          party: item.party || item.Party || "",
          natureOfExpense: item.natureOfExpense || item["Nature Of Expense"] || "",
          gross: item.gross || item.Gross || "",
          tds: item.tds || item.Tds || "",
          netAmount: item.netAmount || item["Net Amount"] || "",
          modeOfPayment: item.modeOfPayment || item["Mode Of Payment"] || "",
          clinic: item.clinic || item.Clinic || "",
          billNo: item.billNo || item.bill || item["Bill Or Ref No"] || "",
          heads: item.heads || item["Major And Minor Heads"] || "",
        }));

        setReportData((prev) => [...prev, ...newEntries]);
      }
      
      // Reset input
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#18122B] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          ACCOUNTANT EXPENSE
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".xlsx, .xls" 
          className="hidden" 
        />
        <Button 
          onClick={handleImportClick}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Import Excel
        </Button>
        <Button 
          onClick={handleDownloadBlankSheet}
          className="bg-blue-800 hover:bg-blue-900 text-white gap-2 transition-colors"
        >
          <ArrowDownCircle className="w-4 h-4" />
          Download Blank Sheet
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Sr. No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Bank
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Party
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Nature Of Expense
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Gross
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Tds
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Net Amount
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Mode Of Payment
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Clinic
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 border-r border-white dark:border-[#635985]/40">
                Bill Or Ref No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90">
                Major And Minor Heads
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
                  {row.bank}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.date}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.party}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.natureOfExpense}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.gross}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.tds}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.netAmount}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.modeOfPayment}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.clinic}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 border-r border-gray-200 dark:border-[#443C68]/50 py-3">
                  {row.billNo}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-white/75 py-3">
                  {row.heads}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       {/* Footer / Pagination */}
       <div className="flex justify-between items-center mt-4">
        {/* Pagination component */}
        <CustomPagination 
            totalItems={reportData.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
