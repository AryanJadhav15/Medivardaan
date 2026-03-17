"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function LabServiceMapping() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    labName: "",
    typeOfWork: "",
    amountType: "Rupee",
    amount: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Lab Service Mapping
  const [data, setData] = useState([
    { id: 1, labName: "Flexismile", typeOfWork: "Essix Retainer", amount: "300.00" },
    { id: 2, labName: "Flexismile", typeOfWork: "Aligner", amount: "600.00" },
    { id: 3, labName: "32 DENTAL LAB", typeOfWork: "VEENERS/LAMINATE", amount: "0.00" },
    { id: 4, labName: "32 DENTAL LAB", typeOfWork: "TEMPORARY-COLD", amount: "0.00" },
    { id: 5, labName: "32 DENTAL LAB", typeOfWork: "TEMPORARY-HEAT", amount: "0.00" },
    { id: 6, labName: "32 DENTAL LAB", typeOfWork: "SPEACIAL TRAY", amount: "0.00" },
    { id: 7, labName: "32 DENTAL LAB", typeOfWork: "JR", amount: "0.00" },
    { id: 8, labName: "32 DENTAL LAB", typeOfWork: "TEETH SETTING", amount: "0.00" },
    { id: 9, labName: "32 DENTAL LAB", typeOfWork: "ZIRCONIA 5YW", amount: "0.00" },
    { id: 10, labName: "32 DENTAL LAB", typeOfWork: "PFM", amount: "350.00" }
  ]);

  // Derived state for filtered data
  const filteredData = data.filter((item) => {
    if (searchTerm === "" || searchTerm === "all") return true;
    return item.typeOfWork === searchTerm;
  });

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
    setFormData({ labName: "", typeOfWork: "", amountType: "Rupee", amount: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({
      labName: item.labName,
      typeOfWork: item.typeOfWork,
      amountType: "Rupee", // Assuming default as not in table data
      amount: item.amount,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData(data.filter((item) => item.id !== id));
      if (currentPage > 1 && Math.ceil((data.length - 1) / itemsPerPage) < currentPage) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.labName || !formData.typeOfWork) return;

    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId
            ? { ...item, ...formData, amount: parseFloat(formData.amount || 0).toFixed(2) }
            : item
        )
      );
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((i) => i.id)) + 1 : 1;
      setData([
        ...data,
        {
          id: newId,
          ...formData,
          amount: parseFloat(formData.amount || 0).toFixed(2),
        },
      ]);
    }
    setIsView("list");
    setFormData({ labName: "", typeOfWork: "", amountType: "Rupee", amount: "" });
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsView("list");
    setFormData({ labName: "", typeOfWork: "", amountType: "Rupee", amount: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          LAB
        </h1>
      </div>

      {isView === "list" ? (
        <>
          {/* Filters */}
          <div className="flex justify-between items-center gap-4">
            <div className="w-full md:max-w-md flex gap-2">
                 <div className="flex-1">
                    <Select value={searchTerm} onValueChange={setSearchTerm}>
                        <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                        <SelectValue placeholder="---Type Of work Select ---" />
                        </SelectTrigger>
                        <SelectContent>
                             {/* Populate unique Type of Works for filtering */}
                            {Array.from(new Set(data.map(item => item.typeOfWork))).map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                             <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <Button onClick={() => setSearchTerm("")} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors">
                     Clear
                 </Button>
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
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Type Of Work</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Type Of Work Amount</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                    currentData.map((row) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{row.id}</TableCell>
                        <TableCell className="dark:text-white/75">{row.labName}</TableCell>
                        <TableCell className="dark:text-white/75">{row.typeOfWork}</TableCell>
                        <TableCell className="dark:text-white/75">{row.amount}</TableCell>
                        <TableCell className="dark:text-white/75">
                            <div className="flex items-center justify-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleEdit(row)}
                                    className="h-4 w-4 text-gray-600 dark:text-white/60 hover:text-green-600"
                                >
                                    <CheckCircle className="h-4 w-4" />
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
                        <TableCell colSpan={5} className="text-center text-gray-500 dark:text-white/50 h-24">
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
                    <label className="text-sm font-medium text-gray-700 dark:text-white/75">Lab Name</label>
                    <Select 
                        value={formData.labName} 
                        onValueChange={(val) => setFormData({...formData, labName: val})}
                    >
                        <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                        <SelectValue placeholder="--- Select Lab ---" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Flexismile">Flexismile</SelectItem>
                        <SelectItem value="32 DENTAL LAB">32 DENTAL LAB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/75">Type Of Work</label>
                    <Select 
                        value={formData.typeOfWork}
                         onValueChange={(val) => setFormData({...formData, typeOfWork: val})}
                    >
                        <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                        <SelectValue placeholder="--- Select Type Of work ---" />
                        </SelectTrigger>
                        <SelectContent>
                               {/* Use unique Type of Works from initial data or predefined list */}
                               {Array.from(new Set(data.map(item => item.typeOfWork))).map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                             {/* Fallback items if data is deleted and we need options */}
                             <SelectItem value="New Work Type">New Work Type</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="flex items-center space-x-2">
                    <RadioGroup 
                        value={formData.amountType} 
                        onValueChange={(val) => setFormData({...formData, amountType: val})}
                        className="flex items-center space-x-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Rupee" id="r1" />
                            <label htmlFor="r1" className="text-sm font-medium text-gray-700 dark:text-white/75">Rupee (₹)</label>
                        </div>
                         {/* Hidden or not in screenshot? Screenshot only shows Rupee selected. Assuming % might be an option. Keeping simple for now as per screenshot */}
                    </RadioGroup>
                </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white/75">Type Of Work Amount</label>
                     <Input
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full"
                        placeholder="Commission"
                    />
                 </div>
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
