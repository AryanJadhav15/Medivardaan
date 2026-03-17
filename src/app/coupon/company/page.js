"use client";

import React, { useState } from "react";
import { Settings, CheckCircle, Trash2 } from "lucide-react";
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

export default function Company() {
  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState("");

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    mobile: "",
    email: "",
  });

  // Mock data state
  const [companies, setCompanies] = useState([
    { id: 1, type: "Organisation", name: "MAC Test", mobile: "90457154854", email: "asd@gmail.com" },
    { id: 2, type: "Company", name: "Test 456", mobile: "9000456854", email: "qwe800@Gmail.com" },
    { id: 3, type: "Company", name: "IG", mobile: "9858695865", email: "asd885@Gmail.com" },
    { id: 4, type: "Organisation", name: "ORTHOSQUARE MDC", mobile: "7021099509", email: "akanksha.t@orthosquare.in" },
    { id: 5, type: "Organisation", name: "Test1", mobile: "07383146643", email: "mehulrana1901@gmail.com" },
  ]);

  // Derived filtered data
  const filteredCompanies = companies.filter((company) => {
    const matchName = company.name.toLowerCase().includes(name.toLowerCase());
    const matchType = companyType && companyType !== "all" ? company.type === companyType : true;
    return matchName && matchType;
  });

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  // Handle Open Logic
  const handleAddNew = () => {
    setEditingCompany(null);
    setFormData({ type: "", name: "", mobile: "", email: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      type: company.type,
      name: company.name,
      mobile: company.mobile,
      email: company.email,
    });
    setIsDialogOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      // Update existing
      setCompanies(
        companies.map((c) =>
          c.id === editingCompany.id ? { ...c, ...formData } : c
        )
      );
    } else {
      // Add new
      const newId = Math.max(...companies.map((c) => c.id), 0) + 1;
      setCompanies([...companies, { id: newId, ...formData }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          COMPANY / ORGANISATION LIST
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full flex gap-2 items-center">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs"
          />
          <Select value={companyType} onValueChange={setCompanyType}>
            <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs">
              <SelectValue placeholder="-- Select Company Type --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Organisation">Organisation</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="NGO">NGO</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
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
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Company Type</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Company Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Mobile</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Email</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.type}</TableCell>
                <TableCell className="dark:text-white/75">{row.name}</TableCell>
                <TableCell className="dark:text-white/75">{row.mobile}</TableCell>
                <TableCell className="dark:text-white/75">{row.email}</TableCell>
                <TableCell className="dark:text-white/75">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(row)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog Overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#393053] rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {editingCompany ? "Edit Company" : "Add New Company"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Company Type
                </label>
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
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Company Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Mobile
                </label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Email
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  type="email"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-medivardaan-blue hover:bg-medivardaan-blue-dark">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
