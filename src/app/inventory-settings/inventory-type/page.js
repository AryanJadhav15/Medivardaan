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
import { Label } from "@/components/ui/label";

export default function InventoryType() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    type: "Material", // Default selection
    name: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Inventory Type
  const [data, setData] = useState([
    { id: 1, type: "Medicine", name: "Medicine" },
    { id: 2, type: "Material", name: "Equipment" }, // Assuming valid types
    { id: 3, type: "Material", name: "Consumable" },
    { id: 4, type: "Material", name: "Stationery" },
    { id: 5, type: "Material", name: "Furniture" },
    { id: 6, type: "Material", name: "Electronics" },
    { id: 7, type: "Material", name: "Lab Supplies" },
    { id: 8, type: "Material", name: "Dental Tools" },
    { id: 9, type: "Material", name: "Cleaning Supplies" },
    { id: 10, type: "Material", name: "Uniforms" }
  ]);

  // Filter based on search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setFormData({ type: "Material", name: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({ type: item.type, name: item.name });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this inventory type?")) {
      setData(data.filter((item) => item.id !== id));
      if (currentPage > 1 && Math.ceil((data.length - 1) / itemsPerPage) < currentPage) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.name) return; // Basic validation

    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1;
      // Note: The list view in original showed just one column "Inventory Type" which seemed to be the name using the mock data provided previously.
      // But the form clearly has Type (Radio) and Name (Input). Use 'name' for display in table based on context, or show both?
      // Original mock data was just `{ id: 1, inventoryType: "Medicine" }`.
      // The new form implies we need to store both. I'll update the table to show what's relevant or just the name if that's what "Inventory Type" meant.
      // Given the form has "Inventory Type Name", I will display the Name. I'll also display the Type (Material/Medicine) if space permits or if intended.
      // Looking at the header "Inventory Type", it might be the Name. I'll check previous file... "Inventory Type" column list.
      // I'll assume the column "Inventory Type" refers to the Name entered, but I'll add a Type column too for clarity or stick to just name if that was the convention.
      // Re-reading: The previous file had one column "Inventory Type" listing "Medicine", "Equipment". 
      // The NEW form has a radio for Material/Medicine AND a text input "Inventory Type Name".
      // So likely the table should show the Name. 
      setData([...data, { id: newId, ...formData }]);
    }
    setIsView("list");
  };

  const handleCancel = () => {
    setIsView("list");
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          INVENTORY TYPE
        </h1>
      </div>

      {isView === "list" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
                <Input
                    placeholder="Search Inventory Type"
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
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Type Category</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Inventory Type Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                    currentData.map((row) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{row.id}</TableCell>
                        <TableCell className="dark:text-white/75">{row.type}</TableCell>
                        <TableCell className="dark:text-white/75">{row.name}</TableCell>
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
                        <TableCell colSpan={4} className="text-center text-gray-500 dark:text-white/50 h-24">
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
                        className={currentPage === page ? "bg-primary hover:bg-[#0b5c7a] text-white" : ""}
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
            {/* Form Content */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                 {/* Radio Group */}
                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="material"
                            name="type"
                            value="Material"
                            checked={formData.type === "Material"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-[#443C68]/50 focus:ring-blue-500"
                        />
                        <Label htmlFor="material" className="text-base font-medium text-gray-700 dark:text-white/75">Material</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <input
                            type="radio"
                            id="medicine"
                            name="type"
                            value="Medicine"
                            checked={formData.type === "Medicine"}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-[#443C68]/50 focus:ring-blue-500"
                        />
                        <Label htmlFor="medicine" className="text-base font-medium text-gray-700 dark:text-white/75">Medicine</Label>
                    </div>
                </div>

                {/* Text Input */}
                <div className="flex-1 max-w-md">
                     <Input
                        placeholder="Inventory Type Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white dark:bg-[#393053]"
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-[#443C68]/50 my-6"></div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] text-white min-w-[100px]">
              Submit
            </Button>
            <Button onClick={handleCancel} variant="destructive" className="bg-primary hover:bg-[#0b5c7a] min-w-[100px]">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
