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

export default function FollowUpReportPage() {
  const [filters, setFilters] = useState({
    clinic: "",
    doctorName: "",
    fromDate: "", 
    toDate: "",
  })

  // Dummy data
  const [allData, setAllData] = useState([
    { srNo: 1, patientName: "prashant desai", mobile: "7045544960", nextFollowUp: "23-Dec-2025", source: "Reference", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 2, patientName: "Karan Mithbawkar", mobile: "9664226872", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 3, patientName: "Snehal Bornaks", mobile: "9137872164", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 4, patientName: "Suryabham Yadav", mobile: "9029230585", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 5, patientName: "Hardik Joshi", mobile: "9029230585", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 6, patientName: "Siddhi Jadhav", mobile: "8291011876", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 7, patientName: "Pooja Modi", mobile: "9757316731", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 8, patientName: "Jijabai Vidhate", mobile: "9511753941", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 9, patientName: "Tanya Madhani", mobile: "2487788628", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 10, patientName: "Punya Arora", mobile: "8527132822", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 11, patientName: "Extra Record 1", mobile: "0000000001", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 12, patientName: "Extra Record 2", mobile: "0000000002", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = allData.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = allData.length

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
        title="FOLLOW UP REPORT" 
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
            <div className="w-full flex items-center gap-3">
              <Button 
                onClick={handleSearch}
                className="flex-1 bg-[#0f7396] hover:bg-[#0f7396]/90 text-white dark:bg-[#635985] dark:hover:bg-[#0f7396]/90 h-10"
              >
                Search
              </Button>
              <div className="text-sm font-medium text-gray-500 dark:text-white/60 whitespace-nowrap">
                Records Found : {totalItems}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Results Table */}
      <div className="rounded-md border dark:border-[#443C68]/50 bg-white dark:bg-[#18122B] shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader className="bg-primary/20 dark:bg-[#635985]/20">
            <TableRow className="dark:border-[#443C68]/50">
              <TableHead className="w-[60px] font-bold text-[#0f7396] dark:text-[#635985]">Sr No.</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Patient Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Mobile No</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Next Follow Up Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Source Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Conversation Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Conversation Details</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#635985]">Follow Up By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow className="dark:border-[#443C68]/50">
                <TableCell colSpan={8} className="h-24 text-center bg-gray-50/50 dark:bg-[#18122B]/50 text-muted-foreground dark:text-white/50">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 dark:bg-[#18122B]/50 dark:hover:bg-[#393053]/50 dark:border-[#443C68]/50">
                  <TableCell className="dark:text-white/75">{item.srNo}</TableCell>
                  <TableCell className="dark:text-white/75">{item.patientName}</TableCell>
                  <TableCell className="dark:text-white/75">{item.mobile}</TableCell>
                  <TableCell className="dark:text-white/75">{item.nextFollowUp}</TableCell>
                  <TableCell className="uppercase dark:text-white/75">{item.source}</TableCell>
                  <TableCell className="dark:text-white/75">{item.conversationDate}</TableCell>
                  <TableCell className="dark:text-white/75">{item.conversationDetails}</TableCell>
                  <TableCell className="dark:text-white/75">{item.followUpBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination at bottom */}
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
