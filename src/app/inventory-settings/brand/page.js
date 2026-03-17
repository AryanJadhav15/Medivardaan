"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2 } from "lucide-react";
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
import CustomPagination from "@/components/ui/custom-pagination";

export default function Brand() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({ brandName: "" });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Brand
  const [data, setData] = useState([
    { id: 1, brandName: "3B Ortho" },
    { id: 2, brandName: "3M" },
    { id: 3, brandName: "Agaro" },
    { id: 4, brandName: "Airtel" },
    { id: 5, brandName: "Allure" },
    { id: 6, brandName: "Anabond" },
    { id: 7, brandName: "Angelus" },
    { id: 8, brandName: "Anthos" },
    { id: 9, brandName: "API" },
    { id: 10, brandName: "Apple" }
  ]);

  const filteredData = data.filter((item) =>
    item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleAdd = () => {
    setIsView("form");
    setFormData({ brandName: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({ brandName: item.brandName });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setData(data.filter((item) => item.id !== id));
      // Reset page if current page becomes empty
      if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.brandName) return;
    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...item, brandName: formData.brandName } : item));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
      setData([...data, { id: newId, brandName: formData.brandName }]);
    }
    setIsView("list");
  };

  const handleCancel = () => {
    setIsView("list");
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple animate-spin-slow" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">Brand</h1>
      </div>

      {isView === "list" ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
                <Input
                    placeholder="Search Brand Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 flex-1"
                />
                 <Button onClick={() => setSearchTerm("")} variant="outline" className="mr-2 px-6 font-medium shadow-sm transition-all whitespace-nowrap border-primary text-primary hover:bg-primary/10">
                    Clear
                 </Button>
                 <Button onClick={handleAdd} className="bg-primary hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                    + Add New
                 </Button>
            </div>
             <div className="text-sm text-gray-500 dark:text-white/50">Total : {filteredData.length}</div>
          </div>

          <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
                <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Brand Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((row, index) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="dark:text-white/75 font-medium">{row.brandName}</TableCell>
                        <TableCell className="dark:text-white/75">
                            <div className="flex items-center justify-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400">
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
                    <TableRow><TableCell colSpan={3} className="text-center text-gray-500 dark:text-white/50 h-24">No records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center pt-2">
             <div className="text-sm text-gray-500 dark:text-white/50 invisible">Spacing</div>
             <CustomPagination 
                totalItems={filteredData.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
                onPageChange={setCurrentPage} 
            />
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-[#393053] p-6 rounded-lg shadow-sm space-y-6 max-w-2xl mx-auto">
           <div className="space-y-4">
               <h3 className="font-bold text-primary border-b pb-2 uppercase">{editingId ? 'Edit Brand' : 'Add New Brand'}</h3>
               <div className="space-y-2">
                    <label className="text-sm font-medium">Brand Name <span className="text-red-500">*</span></label>
                    <Input 
                        value={formData.brandName} 
                        onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} 
                        className="w-full bg-white dark:bg-[#393053]" 
                        placeholder="Enter Brand Name"
                    />
                </div>
           </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-[#443C68]/50">
            <Button onClick={handleCancel} variant="outline" className="min-w-[100px]">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] text-white min-w-[100px]">
                {editingId ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
