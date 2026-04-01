"use client";

import React, { useState, useEffect } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getContactDetails } from "@/api/reports";

export default function ContactDetailsPage() {
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const itemsPerPage = 10;

  const fetchContacts = async (page = 1, name = nameFilter) => {
    try {
      setIsLoading(true);
      const data = await getContactDetails({ PageNumber: page, PageSize: itemsPerPage, Name: name });
      const responseArray = Array.isArray(data) ? data : [];

      // Extract totalRows from the first record (backend embeds it in each row)
      const total = responseArray[0]?.totalRows ?? responseArray[0]?.TotalRows ?? responseArray.length;
      setTotalRows(total);

      const mapped = responseArray.map((item, index) => ({
        id: (page - 1) * itemsPerPage + index + 1,
        name: item.name || item.Name || item.contactName || item.ContactName || "N/A",
        mobile: item.mobileNo || item.MobileNo || item.mobile || item.Mobile || item.phoneNo || "N/A",
      }));
      setContacts(mapped);
    } catch (error) {
      console.error("Failed to fetch contact details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, []);

  // When page changes, fetch the new page from the server
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchContacts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchContacts(1, nameFilter);
  };

  const handleExport = () => {
    exportToExcel(contacts, "Contact_Details");
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileSpreadsheet className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          CONTACT DETAILS
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="text-xs font-medium text-gray-700 dark:text-white/75">Name</label>
          <Input
            placeholder="Search Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full"
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium transition-all w-full md:w-auto"
        >
          {isLoading ? "Loading..." : "Search"}
        </Button>
      </div>

      {/* Total Count */}
      <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
        Total : {totalRows.toLocaleString()}
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[80px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 text-right pr-12">Mobile Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-white/50">Loading contacts...</TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-white/50">No matching records found</TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="dark:text-white/75">{contact.id}</TableCell>
                  <TableCell className="dark:text-white/75 uppercase">{contact.name}</TableCell>
                  <TableCell className="dark:text-white/75 text-right pr-12">{contact.mobile}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" size="icon" onClick={handleExport} className="text-green-600 hover:text-green-700">
          <FileSpreadsheet className="w-8 h-8" />
        </Button>

        {/* Pagination — driven by server totalRows */}
        <CustomPagination
          totalItems={totalRows}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
