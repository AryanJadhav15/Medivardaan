"use client"

import React, { useState } from "react"
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
import { Settings, Home, Plus, ClipboardList } from "lucide-react"
import Link from "next/link"
import CustomPagination from "@/components/ui/custom-pagination"
import { PageHeader } from "@/components/shared/PageHeader"
import { TableWrapper } from "@/components/shared/TableWrapper"

export default function UploadLeadsPage() {
  // Dummy data
  const [data, setData] = useState([
    {
      srNo: 1,
      enquiryDate: "04-Jan-2022",
      name: "",
      adId: "23849223996810300",
      adName: "Braces Ad",
      adSetId: "23849223996800300",
      adSetName: "Borivali-Kandivali | 18-45",
      campaignName: "Braces | Lead Generation | 18-45 | 10-12-2021",
      formId: "711088119863312",
      formName: "Orthosquare Leads Form",
      isOrganic: "False",
      platform: "fb",
      email: "shetty.anu31@gmail.com",
      mobile: "917506425926",
      cityName: "Mumbai",
      postCode: "400067",
      retailerItemId: "",
      region: "Borivali - Kandivali",
      clinicName: "Kandivali West",
      status: "",
      lblClinic: ""
    },
    {
        srNo: 2,
        enquiryDate: "04-Jan-2022",
        name: "",
        adId: "23849223665540300",
        adName: "Braces Ad",
        adSetId: "23849223665550300",
        adSetName: "Thane | 18-45",
        campaignName: "Braces | Lead Generation | 18-45 | 10-12-2021",
        formId: "711088119863312",
        formName: "Orthosquare Leads Form",
        isOrganic: "False",
        platform: "ig",
        email: "prafulvaity9@gmail.com",
        mobile: "919867969199",
        cityName: "Thane",
        postCode: "400601",
        retailerItemId: "",
        region: "Thane",
        clinicName: "RMR",
        status: "Interested",
        lblClinic: ""
    },
    {
        srNo: 3,
        enquiryDate: "04-Jan-2022",
        name: "",
        adId: "23849223590830300",
        adName: "Braces Ad",
        adSetId: "23849223590820300",
        adSetName: "Dr. Nimita | 18-45",
        campaignName: "Braces | Lead Generation | 18-45 | 10-12-2021",
        formId: "711088119863312",
        formName: "Orthosquare Leads Form",
        isOrganic: "False",
        platform: "fb",
        email: "sk6302171@gmail.com",
        mobile: "919769522349",
        cityName: "Mumbai",
        postCode: "400017",
        retailerItemId: "",
        region: "CSK",
        clinicName: "Sion",
        status: "",
        lblClinic: ""
    }
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  const totalItems = data.length

  const handleImport = () => {
    alert("Import functionality to be implemented")
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50 dark:bg-[#18122B] transition-colors duration-200">
      {/* Breadcrumb */}
    

      {/* Header */}
      <PageHeader 
        title="LEADS" 
        icon={ClipboardList} 
      />

      {/* Action Section */}
      <div className="bg-white dark:bg-[#18122B] p-4 rounded-md shadow-sm border border-gray-100 dark:border-[#443C68]/50 flex items-center">
        <Button 
            onClick={handleImport}
            className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 dark:bg-green-700 dark:hover:bg-green-600"
        >
            <Plus className="w-4 h-4" />
            Import Excel
        </Button>
      </div>

      {/* Results Table */}
      <TableWrapper className="flex flex-col">
        {/* We need horizontal scroll for this table due to many columns */}
        <div className="overflow-x-auto">
            <Table style={{ minWidth: '2500px' }} className="border-0">
            <TableHeader >
                <TableRow className="dark:border-[#443C68]/50">
                <TableHead className="w-[50px] font-bold text-primary dark:text-primary border-r border-primary/20">Sr. No.</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[100px] border-r border-primary/20">Enquiry Date</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[120px] border-r border-primary/20">Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Ad Id</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[120px] border-r border-primary/20">Ad Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Ad Set Id</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Ad Set Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[200px] border-r border-primary/20">Campaign Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Form Id</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Form Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[80px] border-r border-primary/20">Is Organic</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[80px] border-r border-primary/20">Plat Form</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[200px] border-r border-primary/20">Email Id</TableHead>
                
                {/* New Columns */}
                <TableHead className="font-bold text-primary dark:text-primary w-[120px] border-r border-primary/20">Mobile</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[120px] border-r border-primary/20">City Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[100px] border-r border-primary/20">Post Code</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[120px] border-r border-primary/20">Retailer Item Id</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Region</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[150px] border-r border-primary/20">Clinic Name</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[100px] border-r border-primary/20">Status</TableHead>
                <TableHead className="font-bold text-primary dark:text-primary w-[100px]">lblClinic</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                <TableRow className="dark:border-[#443C68]/50">
                    <TableCell colSpan={21} className="h-24 text-center bg-gray-50/50 dark:bg-[#18122B]/50 text-muted-foreground dark:text-white/50">
                    No Record Available
                    </TableCell>
                </TableRow>
                ) : (
                data.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50 dark:bg-[#18122B]/50 dark:hover:bg-[#393053]/50 border-b border-gray-100 dark:border-[#443C68]/50">
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.srNo}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.enquiryDate}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.name}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.adId}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.adName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.adSetId}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.adSetName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.campaignName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.formId}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.formName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.isOrganic}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.platform}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.email}</TableCell>
                    
                    {/* New Cells */}
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.mobile}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.cityName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.postCode}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.retailerItemId}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.region}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.clinicName}</TableCell>
                    <TableCell className="border-r border-gray-100 dark:border-[#443C68]/50 dark:text-white/75">{item.status}</TableCell>
                    <TableCell className="dark:text-white/75">{item.lblClinic}</TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </div>

        {/* Pagination */}
        <div className="px-4 border-t border-gray-100 dark:border-[#443C68]/50">
            <CustomPagination 
                totalItems={totalItems} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
      </TableWrapper>
    </div>
  )
}
