"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Home, Plus, Trash2, FileSpreadsheet, ClipboardList } from "lucide-react"
import Link from "next/link"
import CustomPagination from "@/components/ui/custom-pagination"
import { PageHeader } from "@/components/shared/PageHeader"

export default function AreaManagerLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Dummy data
  const [data, setData] = useState([
    { srNo: 1, name: "Dr.RUCHI BHANSALI" },
    { srNo: 2, name: "Sayali Jadhav" },
    { srNo: 3, name: "Dr.Nilay Vakharia" },
    { srNo: 4, name: "Dr.isha jain" },
    { srNo: 5, name: "Dr.Harshada Mane" },
    { srNo: 6, name: "Dr.Akhil Nair" },
    { srNo: 7, name: "Dr.Anagha Patil Chavan" },
    { srNo: 8, name: "Dr.Apurva Vaidya" },
    { srNo: 9, name: "Dr.PARIDHI SHUKLA" },
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  const totalItems = data.length

  const handleSearch = () => {
    console.log("Searching for:", searchTerm)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddNew = () => {
    console.log("Add New Area Manager")
  }

  const handleDelete = (id) => {
      console.log("Delete item", id)
      // confirm logic here
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50 dark:bg-[#18122B] transition-colors duration-200">
      {/* Breadcrumb */}
      

      {/* Header */}
      <PageHeader 
        title="AREA MANAGER LEADS" 
        icon={ClipboardList} 
      />

      {/* Filter & Action Section */}
      <Card className="border-none shadow-sm bg-white dark:bg-[#18122B]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                <div className="w-full md:w-[300px]">
                    <Input 
                        placeholder="Area Manager Name" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white dark:bg-[#18122B] border-gray-200 dark:border-[#443C68]/50 dark:text-white/90 h-10 w-full"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                        onClick={handleSearch}
                        className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px] h-10"
                    >
                        Search
                    </Button>
                    <Button 
                        onClick={handleAddNew}
                        className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px] h-10"
                    >
                        Add New
                    </Button>
                </div>
             </div>
             
             {/* Total Count */}
             <div className="text-sm font-medium text-gray-600 dark:text-white/60">
                Total : {totalItems}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="rounded-md border dark:border-[#443C68]/50 bg-white dark:bg-[#18122B] shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader >
            <TableRow className="dark:border-[#443C68]/50">
              <TableHead className="w-[80px] font-bold text-primary dark:text-primary border-r border-primary/20">Sr No.</TableHead>
              <TableHead className="font-bold text-primary dark:text-primary border-r border-primary/20">Area Manager</TableHead>
              <TableHead className="w-[80px] font-bold text-primary dark:text-primary text-center">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="dark:border-[#443C68]/50">
                <TableCell colSpan={3} className="h-24 text-center bg-gray-50/50 dark:bg-[#18122B]/50 text-muted-foreground dark:text-white/50">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 dark:bg-[#18122B]/50 dark:hover:bg-[#393053]/50 border-b border-gray-100 dark:border-[#443C68]/50">
                  <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.srNo}</TableCell>
                  <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 text-blue-600 hover:underline cursor-pointer dark:text-[#635985]">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                        onClick={() => handleDelete(item.srNo)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
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
      
      {/* Footer / Excel Icon */}
      <div>
        <Button variant="outline" size="icon" className="h-10 w-10 text-green-600 border-green-200 hover:bg-green-50 dark:bg-[#18122B] dark:border-[#443C68]/50 dark:text-green-500 dark:hover:bg-[#393053]">
            <FileSpreadsheet className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
