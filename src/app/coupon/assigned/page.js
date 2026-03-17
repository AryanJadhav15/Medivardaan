"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2 } from "lucide-react";
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

export default function AssignedCoupon() {
  const [searchType, setSearchType] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    companyName: "",
    couponNo: "",
    amount: "",
    name: "",
    mobile: "",
    email: ""
  });

  // Mock data for Assigned Coupon
  const [assignedCoupons, setAssignedCoupons] = useState([
    { id: 1, type: "Company", companyName: "Test 456", couponNo: "X06OLB", amount: "1000.00", name: "PRAVINCHANDHRA AMBAL", mobile: "9000456854", email: "mehulrana1901@gmail.com" },
    { id: 2, type: "Company", companyName: "Test 456", couponNo: "PVQP77", amount: "1000.00", name: "aa aa", mobile: "45854455444", email: "mehulrana1901@gmail.com" },
    { id: 3, type: "Organisation", companyName: "Ortho Test", couponNo: "BNRI1A", amount: "1000.00", name: "Mehul Rana", mobile: "9099960633", email: "asd@gmail.com" },
    { id: 4, type: "Organisation", companyName: "ORTHOSQUARE MDC", couponNo: "9045CD", amount: "500.00", name: "Mehul Raana", mobile: "9099960633", email: "" },
  ]);

  // Handle Search
  const filteredData = assignedCoupons.filter(item => {
      const matchType = !searchType || searchType === "all" || item.type === searchType;
      const matchCompany = !searchCompany || item.companyName.toLowerCase().includes(searchCompany.toLowerCase());
      return matchType && matchCompany;
  });

  const handleAddNew = () => {
      setFormData({
        type: "", companyName: "", couponNo: "", amount: "", name: "", mobile: "", email: ""
      });
      setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      const newId = Math.max(...assignedCoupons.map(c => c.id), 0) + 1;
      setAssignedCoupons([...assignedCoupons, { id: newId, ...formData }]);
      setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          COMPANY / ORGANISATION ASSIGNED COUPON
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full flex gap-2 items-center">
            <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs">
                <SelectValue placeholder="-- Select Company Type --" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Organisation">Organisation</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                </SelectContent>
            </Select>

             <Select value={searchCompany} onValueChange={setSearchCompany}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs">
                <SelectValue placeholder="--- Select Company---" />
                </SelectTrigger>
                <SelectContent>
                     {/* Unique company names for filter */}
                    {[...new Set(assignedCoupons.map(item => item.companyName))].map(name => (
                         <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
             <Button className="bg-[#D35400] hover:bg-[#A04000] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
              <Button 
                onClick={handleAddNew}
                className="bg-medivardaan-blue hover:bg-medivardaan-blue-dark text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New
            </Button>
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E8F8F5] dark:bg-[#393053]">
            <TableRow className="hover:bg-[#E8F8F5] dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Type</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Company Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Coupon No</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Amount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Name</TableHead>
               <TableHead className="font-bold text-gray-700 dark:text-white/75">Mobile No</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-white/75">EmailId</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{row.type}</TableCell>
                <TableCell className="dark:text-white/75">{row.companyName}</TableCell>
                <TableCell className="dark:text-white/75">{row.couponNo}</TableCell>
                <TableCell className="dark:text-white/75">{row.amount}</TableCell>
                <TableCell className="dark:text-white/75">{row.name}</TableCell>
                <TableCell className="dark:text-white/75">{row.mobile}</TableCell>
                <TableCell className="dark:text-white/75">{row.email}</TableCell>
              </TableRow>
            ))}
             {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No assignments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Add Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#393053] rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Assign New Coupon
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Type</label>
                 <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Organisation">Organisation</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Company Name</label>
                <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/75">Coupon No</label>
                    <Input required value={formData.couponNo} onChange={e => setFormData({...formData, couponNo: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/75">Amount</label>
                    <Input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Person Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Mobile</label>
                <Input required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Email</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-medivardaan-blue hover:bg-medivardaan-blue-dark">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
