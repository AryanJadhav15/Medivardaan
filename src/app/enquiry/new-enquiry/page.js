"use client";

import React, { useState, useEffect } from "react";
import { getLeads } from "@/api/leads";
import { transformAPILeadToDisplay } from "@/utils/leadsTransformers";
import { Pagination } from "@/components/Pagination";
import { TableWrapper } from "@/components/shared/TableWrapper";
import { Card, CardContent } from "@/components/ui/card";
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
import { Settings, Eye, Trash2, Edit, Search, Plus, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { useClinics } from "@/hooks/useMasterData";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";

export default function NewLeadPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    name: "",
    mobileNo: "",
    clinic: "",
    fromDate: "",
    toDate: "",
  });

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Master Data
  const { data: clinics = [] } = useClinics();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (searchFilters = filters, page = currentPage) => {
    try {
      setIsLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(searchFilters).filter(([_, v]) => v !== "")
      );
      
      const queryParams = {
        ...cleanFilters,
        PageNumber: page,
        PageSize: pageSize, 
      };

      const data = await getLeads(queryParams);
      if (Array.isArray(data) && data.length > 0) {
          console.log("DEBUG: Raw Lead Data (Item 0):", data[0]);
      }
      
      const transformedLeads = Array.isArray(data) ? data.map((lead, index) => ({
        ...transformAPILeadToDisplay(lead),
         // Calculate correct SrNo based on page and index
        srNo: ((page - 1) * pageSize) + index + 1
      })) : [];

      setLeads(transformedLeads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    if (field === "mobileNo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      setFilters((prev) => ({ ...prev, [field]: numericValue }));
      return;
    }
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLeads(filters, 1);
  };

  const clearFilters = () => {
      setFilters({
        name: "",
        mobileNo: "",
        clinic: "",
        fromDate: "",
        toDate: "",
      });
      setCurrentPage(1);
      fetchLeads({
        name: "",
        mobileNo: "",
        clinic: "",
        fromDate: "",
        toDate: "",
      }, 1);
  };

  const handlePageChangeWrapper = (newPage) => {
    setCurrentPage(newPage);
    fetchLeads(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Hardcoded total pages as per existing logic (API doesn't return count yet)
  const totalPages = 10000;

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-[#18122B] min-h-screen">
      <PageHeader 
        title="LEAD" 
        icon={ClipboardList} 
      />

      {/* Filter Section - Standardized Layout */}
      <Card className="border-2 border-primary/10 dark:border-[#443C68]/50 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
             {/* Name */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Name</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search Name"
                        value={filters.name}
                        onChange={(e) => handleFilterChange("name", e.target.value)}
                        className="pl-9 bg-white dark:bg-[#393053]"
                    />
                </div>
             </div>

             {/* Mobile */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Mobile No</Label>
                <Input
                    placeholder="Search Mobile"
                    value={filters.mobileNo}
                    onChange={(e) => handleFilterChange("mobileNo", e.target.value)}
                    className="bg-white dark:bg-[#393053]"
                />
             </div>

             {/* Clinic */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">Clinic</Label>
                <Select value={filters.clinic} onValueChange={(value) => handleFilterChange("clinic", value)}>
                    <SelectTrigger className="bg-white dark:bg-[#393053]">
                      <SelectValue placeholder="Select Clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clinics</SelectItem>
                      {clinics && clinics.map((clinic) => (
                          <SelectItem key={clinic.clinicId || clinic.id} value={(clinic.clinicId || clinic.id).toString()}>
                              {clinic.clinicName || clinic.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
             </div>

             {/* From Date */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">From Date</Label>
                <Input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                    className="bg-white dark:bg-[#393053]"
                />
             </div>

             {/* To Date */}
             <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">To Date</Label>
                <Input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                    className="bg-white dark:bg-[#393053]"
                />
             </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-[#443C68]/50">
             <div className="flex gap-3">
                 <Button onClick={handleSearch} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px]">
                    <Search className="w-4 h-4 mr-2" /> Search
                 </Button>
                 <Button onClick={clearFilters} variant="outline" className="text-gray-600 dark:text-white/60">
                    Clear
                 </Button>
             </div>
             
             <Button onClick={() => router.push("/enquiry/add-enquiry-form")} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors">
                <Plus className="w-4 h-4 mr-2" /> Add New Lead
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <TableWrapper>
            <Table className="border-0 bg-transparent">
              <TableHeader >
                <TableRow className="hover:bg-primary/10">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Lead No</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Mobile No</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Source Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Status</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Date</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-40 text-center">
                       <Spinner className="mx-auto text-primary" />
                       <p className="text-sm text-gray-500 dark:text-white/50 mt-2">Loading leads...</p>
                    </TableCell>
                  </TableRow>
                ) : (
                leads.length > 0 ? (
                  leads.map((lead, index) => (
                  <TableRow
                    key={index}
                    
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">{lead.srNo}</TableCell>
                    <TableCell className="text-gray-600 dark:text-white/60">{lead.leadNo}</TableCell>
                    <TableCell className="font-medium text-gray-800 dark:text-white/90">{lead.name}</TableCell>
                    <TableCell>{lead.mobileNo}</TableCell>
                    <TableCell>{lead.clinicName}</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{lead.sourceName}</span></TableCell>
                    <TableCell><span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize">{lead.status}</span></TableCell>
                    <TableCell className="text-gray-500 dark:text-white/50 text-sm">{lead.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                            onClick={() => router.push(`/enquiry/add-enquiry-form?mode=view&id=${lead.EnquiryID || lead.enquiryId || lead.enquiryID || lead.id || (lead.leadNo ? lead.leadNo.replace('E','') : '')}`)}
                            title="View"
                         >
                            <Eye className="w-4 h-4" />
                         </Button>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                            onClick={() => router.push(`/enquiry/add-enquiry-form?mode=edit&id=${lead.EnquiryID || lead.enquiryId || lead.enquiryID || lead.id || (lead.leadNo ? lead.leadNo.replace('E','') : '')}`)}
                            title="Edit"
                         >
                            <Edit className="w-4 h-4" />
                         </Button>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                            title="Delete"
                         >
                            <Trash2 className="w-4 h-4" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-40 text-center text-gray-500 dark:text-white/50">
                     <div className="flex flex-col items-center justify-center">
                        <p>No leads found matching your filters.</p>
                        <Button variant="link" onClick={clearFilters} className="mt-2 text-primary">Clear Filters</Button>
                     </div>
                  </TableCell>
                </TableRow>
              )
            )}
              </TableBody>
            </Table>
      </TableWrapper>

      {!isLoading && leads.length > 0 && (
        <div className="flex justify-end pt-2">
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChangeWrapper}
            showTotalPages={false}
            />
        </div>
      )}
    </div>
  );
}
