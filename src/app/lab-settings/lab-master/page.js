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

export default function LabMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({ labName: "" });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Lab Master
  const [data, setData] = useState([
    { id: 1, labName: "Flexismile" },
    { id: 2, labName: "32 DENTAL LAB" },
    { id: 3, labName: "DENTCARE" },
    { id: 4, labName: "ILLUSION" },
    { id: 5, labName: "KRISTAL" },
    { id: 6, labName: "METROPOLIS" },
    { id: 7, labName: "SUBURBAN" },
  ]);

  // Derived state for filtered data
  const filteredData = data.filter((item) =>
    item.labName.toLowerCase().includes(searchTerm.toLowerCase())
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
    setFormData({ labName: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({ labName: item.labName });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData(data.filter((item) => item.id !== id));
      if (
        currentPage > 1 &&
        Math.ceil((data.length - 1) / itemsPerPage) < currentPage
      ) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.labName.trim()) return;

    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, labName: formData.labName } : item
        )
      );
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1;
      setData([...data, { id: newId, labName: formData.labName }]);
    }
    setIsView("list");
    setFormData({ labName: "" });
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsView("list");
    setFormData({ labName: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          LAB MASTER
        </h1>
      </div>

      {isView === "list" ? (
        <>
          {/* Filters */}
          <div className="flex justify-between items-center gap-4">
            <div className="w-full md:max-w-md">
                 <Input 
                    placeholder="Search Lab Name" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                 />
            </div>
            
            <Button 
                onClick={handleAdd}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New Lab
            </Button>
          </div>

          {/* Table */}
           <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
                <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Lab Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                    currentData.map((row) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{row.id}</TableCell>
                        <TableCell className="dark:text-white/75">{row.labName}</TableCell>
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
                        <TableCell colSpan={3} className="text-center text-gray-500 dark:text-white/50 h-24">
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
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-white/75">Lab Name</label>
                 <Input
                    value={formData.labName}
                    onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                    className="w-full"
                    placeholder=""
                />
            </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white min-w-[100px]">
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
