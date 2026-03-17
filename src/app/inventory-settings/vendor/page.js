"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Vendor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    clinicName: "",
    vendorType: "",
    vendorName: "",
    mobileNo: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Vendor
  const [data, setData] = useState([
    {
        id: 1,
        clinicName: "Nanganallur",
        vendorType: "Chair Repair",
        vendorName: "APP DENTAL EQUIPMENTS",
        mobileNo: "9385854891"
    },
    {
        id: 2,
        clinicName: "Nanganallur",
        vendorType: "Lab Bill",
        vendorName: "ORTHODENTCO",
        mobileNo: "9944223424"
    },
    {
        id: 3,
        clinicName: "Nanganallur",
        vendorType: "Lab Bill",
        vendorName: "VINAYAGA",
        mobileNo: "7550066982"
    },
    {
        id: 4,
        clinicName: "Nanganallur",
        vendorType: "Chair Repair",
        vendorName: "BHASKAR",
        mobileNo: "9894828083"
    },
    {
        id: 5,
        clinicName: "Nanganallur",
        vendorType: "Medical",
        vendorName: "MASOOD LASER UNIT",
        mobileNo: "9884313950"
    },
    {
        id: 6,
        clinicName: "thanisandra",
        vendorType: "Courier",
        vendorName: "porter app",
        mobileNo: "8655401658"
    },
    {
        id: 7,
        clinicName: "thanisandra",
        vendorType: "Water Refill",
        vendorName: "thanisandra water tanker",
        mobileNo: "9702057226"
    },
    {
        id: 8,
        clinicName: "MULUND",
        vendorType: "Incentive",
        vendorName: "Mahek",
        mobileNo: "7700011473"
    },
    {
        id: 9,
        clinicName: "Vasai west",
        vendorType: "Rent",
        vendorName: "mamta",
        mobileNo: "9067895507"
    },
    {
        id: 10,
        clinicName: "Navrangpura",
        vendorType: "scanner",
        vendorName: "unicorn lab",
        mobileNo: "7405707811"
    }
  ]);

  // Derived state for filtered data
  const filteredData = data.filter((item) =>
    item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAdd = () => {
    setIsView("form");
    setFormData({ clinicName: "", vendorType: "", vendorName: "", mobileNo: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({
      clinicName: item.clinicName,
      vendorType: item.vendorType,
      vendorName: item.vendorName,
      mobileNo: item.mobileNo,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setData(data.filter((item) => item.id !== id));
      if (currentPage > 1 && Math.ceil((data.length - 1) / itemsPerPage) < currentPage) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.vendorName || !formData.mobileNo) return; // Basic validation

    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1;
      setData([...data, { id: newId, ...formData }]);
    }
    setIsView("list");
    setFormData({ clinicName: "", vendorType: "", vendorName: "", mobileNo: "" });
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsView("list");
    setFormData({ clinicName: "", vendorType: "", vendorName: "", mobileNo: "" });
    setEditingId(null);
  };

  // Extract unique options for dropdowns
  const clinicOptions = Array.from(new Set(data.map(item => item.clinicName))).filter(Boolean);
  const vendorTypeOptions = Array.from(new Set(data.map(item => item.vendorType))).filter(Boolean);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          VENDOR
        </h1>
      </div>

      {isView === "list" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
                <Input
                    placeholder="Search by Name, Clinic, or Type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 flex-1"
                />
                 <Button onClick={() => setSearchTerm("")} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                   Clear
                 </Button>
                 <Button onClick={handleAdd} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                   Add Vendor
                 </Button>
            </div>
            
             <div className="text-sm text-gray-500 dark:text-white/50">
                Total : {filteredData.length}
            </div>
          </div>

          {/* Table */}
           <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
                <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Vendor Type</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Vendor Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Mobile No</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                    currentData.map((row) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{row.id}</TableCell>
                        <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                        <TableCell className="dark:text-white/75">{row.vendorType}</TableCell>
                        <TableCell className="dark:text-white/75">{row.vendorName}</TableCell>
                        <TableCell className="dark:text-white/75">{row.mobileNo}</TableCell>
                        <TableCell className="dark:text-white/75">
                            <div className="flex items-center justify-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEdit(row)}
                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(row.id)}
                                    className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 dark:text-white/50 h-24">
                            No records found
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

           {/* Pagination */}
           <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-500 dark:text-white/50">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors" : ""}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </>
      ) : (
        /* Form View */
        <div className="bg-white dark:bg-[#393053] p-6 rounded-lg shadow-sm space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Select 
                        value={formData.clinicName} 
                        onValueChange={(val) => setFormData({...formData, clinicName: val})}
                    >
                        <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                            <SelectValue placeholder="-- Select Clinic --" />
                        </SelectTrigger>
                        <SelectContent>
                             {clinicOptions.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                             {/* Static fallback if no data */}
                             {clinicOptions.length === 0 && <SelectItem value="Nanganallur">Nanganallur</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Select 
                        value={formData.vendorType} 
                        onValueChange={(val) => setFormData({...formData, vendorType: val})}
                    >
                        <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                            <SelectValue placeholder="-- Select Vendor Type --" />
                        </SelectTrigger>
                        <SelectContent>
                             {vendorTypeOptions.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                             {/* Static fallback if no data */}
                             {vendorTypeOptions.length === 0 && <SelectItem value="Medical">Medical</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Input
                        placeholder="Vendor Name"
                        value={formData.vendorName}
                        onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                        className="w-full"
                    />
                </div>
                 <div className="space-y-2">
                    <Input
                        placeholder="Enter Mobile"
                        value={formData.mobileNo}
                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                        className="w-full"
                    />
                </div>
           </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px]">
              Submit
            </Button>
            <Button onClick={handleCancel} variant="destructive" className="bg-primary hover:bg-primary/90 min-w-[100px]">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
