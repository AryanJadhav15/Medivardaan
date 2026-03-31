"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Home, ClipboardList } from "lucide-react"
import Link from "next/link"
import CustomPagination from "@/components/ui/custom-pagination"
import { PageHeader } from "@/components/shared/PageHeader"

export default function PendingFollowupsPage() {
  const [filters, setFilters] = useState({
    clinic: "",
    doctorName: "",
    fromDate: "2025-11-23", 
    toDate: "2025-12-23",
  })

  // Placeholder for data - simulated large dataset capability
  const [data, setData] = useState([])
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  const totalItems = data.length 

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50 dark:bg-[#18122B] transition-colors duration-200">
      {/* Breadcrumb */}
      

      {/* Header */}
      <PageHeader 
        title="Pending Follow up Report" 
        icon={ClipboardList} 
      />

      {/* Filter Section */}
      <Card className="border-none shadow-sm bg-white dark:bg-[#18122B]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
             {/* Clinic Select */}
            <div className="w-full">
              <Select 
                value={filters.clinic} 
                onValueChange={(val) => setFilters({...filters, clinic: val})}
              >
                <SelectTrigger className="w-full bg-white dark:bg-[#18122B] border-gray-200 dark:border-[#443C68]/50 dark:text-white/90">
                  <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#18122B] dark:border-[#443C68]/50">
                  <SelectItem value="panvel" className="dark:text-white/90 dark:focus:bg-slate-800">Panvel</SelectItem>
                  <SelectItem value="pune" className="dark:text-white/90 dark:focus:bg-slate-800">Pune</SelectItem>
                  <SelectItem value="mumbai" className="dark:text-white/90 dark:focus:bg-slate-800">Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Name */}
            <div className="w-full">
              <Input 
                placeholder="Doctor Name" 
                value={filters.doctorName}
                onChange={(e) => setFilters({...filters, doctorName: e.target.value})}
                className="w-full bg-white dark:bg-[#18122B] border-gray-200 dark:border-[#443C68]/50 dark:text-white/90 dark:placeholder:text-white/50"
              />
            </div>

            {/* From Date */}
            <div className="w-full">
              <Input 
                type="date" 
                value={filters.fromDate}
                onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                className="w-full bg-white dark:bg-[#18122B] border-gray-200 dark:border-[#443C68]/50 dark:text-white/90"
              />
            </div>

            {/* To Date */}
            <div className="w-full">
              <Input 
                type="date" 
                value={filters.toDate}
                onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                 className="w-full bg-white dark:bg-[#18122B] border-gray-200 dark:border-[#443C68]/50 dark:text-white/90"
              />
            </div>

             {/* Search Button */}
            <div className="w-full">
              <Button 
                onClick={handleSearch}
                className="w-full bg-[#0f7396] hover:bg-[#0f7396]/90 text-white dark:bg-[#635985] dark:hover:bg-[#0f7396]/90 h-10"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="rounded-md border dark:border-[#443C68]/50 bg-white dark:bg-[#18122B] shadow-sm overflow-hidden flex flex-col">
         {/* Total Count Bar */}
        <div className="flex justify-end px-4 py-2 bg-gray-50 dark:bg-[#18122B] border-b dark:border-[#443C68]/50 text-sm font-medium text-gray-600 dark:text-white/60">
          Total : {totalItems}
        </div>
        
        <Table>
          <TableHeader className="bg-primary/20 dark:bg-[#635985]/20">
            <TableRow className="dark:border-[#443C68]/50">
              <TableHead className="w-[80px] font-bold text-[#0f7396] dark:text-[#635985]">Sr. No.</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Visitor Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Mobile</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Enquiry For</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Enquiry Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Followup Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="dark:border-[#443C68]/50">
                <TableCell colSpan={7} className="h-24 text-center bg-gray-50/50 dark:bg-[#18122B]/50 text-muted-foreground dark:text-white/50">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="dark:border-[#443C68]/50 cursor-pointer hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50">
                  <TableCell className="dark:text-white/75">{idx + 1 + ((currentPage - 1) * itemsPerPage)}</TableCell>
                  <TableCell className="dark:text-white/75">{item.name}</TableCell>
                  {/* ... other cells */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-4 border-t border-gray-100 dark:border-[#443C68]/50">
            <CustomPagination 
                totalItems={totalItems} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  )
}
