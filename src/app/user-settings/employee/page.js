"use client";

import React, { useState } from "react";
import { Settings, CheckCircle2, Trash2, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomPagination from "@/components/ui/custom-pagination";

const EMPLOYEES_DATA = [
  {
    id: 1,
    empCode: "EMP3",
    name: "sneha gaikwad",
    mobile: "7738328642",
    email: "",
    regDate: "2019-08-21",
    photo: null,
  },
  {
    id: 2,
    empCode: "EMP9",
    name: "sayali palshetkar",
    mobile: "8424930024",
    email: "",
    regDate: "2019-11-06",
    photo: null,
  },
  {
    id: 3,
    empCode: "EMP11",
    name: "Account a",
    mobile: "5566448855",
    email: "",
    regDate: "2020-03-13",
    photo: null,
  },
  {
    id: 4,
    empCode: "EMP12",
    name: "Nikita Rajaram Mhapankar",
    mobile: "9004310736",
    email: "",
    regDate: "2020-08-28",
    photo: null,
  },
  {
    id: 5,
    empCode: "EMP13",
    name: "seher shaikh",
    mobile: "9022942698",
    email: "",
    regDate: "2020-09-09",
    photo: null,
  },
  {
    id: 6,
    empCode: "EMP14",
    name: "Mahek Kanojiya",
    mobile: "7700011473",
    email: "mahekanojiya01@gmail.com",
    regDate: "2020-09-30",
    photo: null,
  },
];

const EmployeePage = () => {
  const [employees, setEmployees] = useState(EMPLOYEES_DATA);
  
  // Search States
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchEmpCode, setSearchEmpCode] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    empCode: "",
    name: "",
    mobile: "",
    email: "",
    regDate: new Date().toISOString().split('T')[0], // Default today
  });

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesName = emp.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesMobile = emp.mobile.includes(searchMobile);
    const matchesCode = emp.empCode.toLowerCase().includes(searchEmpCode.toLowerCase());
    return matchesName && matchesMobile && matchesCode;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setFormData({
      empCode: "",
      name: "",
      mobile: "",
      email: "",
      regDate: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (emp) => {
    setIsEditing(true);
    setCurrentId(emp.id);
    setFormData({
      empCode: emp.empCode,
      name: emp.name,
      mobile: emp.mobile,
      email: emp.email || "",
      regDate: emp.regDate,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === currentId ? { ...emp, ...formData } : emp
        )
      );
    } else {
      const newEmployee = {
        id: employees.length + 1, // Simple ID generation
        ...formData,
        photo: null,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="w-full p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-medivardaan-teal dark:text-medivardaan-purple" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal dark:text-medivardaan-purple">
          EMPLOYEE
        </h1>
      </div>

      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-6 space-y-6">
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-white/60">Employee Name</Label>
              <Input 
                placeholder="Employee Name" 
                className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#443C68]/50"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-white/60">Mobile No.</Label>
              <Input 
                placeholder="Mobile No." 
                className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#443C68]/50"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-white/60">Employee Code</Label>
              <Input 
                placeholder="Employee Code" 
                className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#443C68]/50"
                value={searchEmpCode}
                onChange={(e) => setSearchEmpCode(e.target.value)}
              />
            </div>
            <div>
              <Button 
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors dark:bg-primary dark:hover:bg-primary/90 px-8"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Add New Button (Right Aligned) */}
          <div className="flex justify-end">
            <Button 
                onClick={openAddDialog}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors dark:bg-primary dark:hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border border-gray-200 dark:border-[#443C68]/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-primary/20">
                <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50 hover:bg-transparent">
                  <TableHead className="w-16 text-gray-700 dark:text-white/90 font-semibold">Sr. No.</TableHead>
                  <TableHead className="w-32 text-gray-700 dark:text-white/90 font-semibold">Photo</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-semibold">Emp Code</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-semibold">Mobile No.</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-semibold">Email ID</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-semibold">Reg Date</TableHead>
                  <TableHead className="w-24 text-right text-gray-700 dark:text-white/90 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((emp, index) => (
                    <TableRow 
                        key={emp.id} 
                        className="border-b last:border-b-0 border-gray-100 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 transition-colors"
                    >
                        <TableCell className="font-medium text-gray-900 dark:text-white">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#393053] border border-gray-200 dark:border-[#443C68]/50 flex items-center justify-center">
                            <span className="text-gray-400 dark:text-white/40 text-xs">Photo</span>
                        </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-white/75">{emp.empCode}</TableCell>
                        <TableCell className="text-gray-700 dark:text-white/75 uppercase">{emp.name}</TableCell>
                        <TableCell className="text-gray-700 dark:text-white/75">{emp.mobile}</TableCell>
                        <TableCell className="text-gray-700 dark:text-white/75">{emp.email}</TableCell>
                        <TableCell className="text-gray-700 dark:text-white/75">{emp.regDate}</TableCell>
                        <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                             <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(emp)}
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                            >
                            <Pencil size={16} />
                            </Button>
                            <Button
                            size="icon"
                            variant="ghost" 
                            onClick={() => handleDelete(emp.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                            >
                            <Trash2 size={16} />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-white/50">
                            No employees found
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
           <div className="flex justify-end">
                 <CustomPagination 
                    totalItems={filteredEmployees.length} 
                    itemsPerPage={itemsPerPage} 
                    currentPage={currentPage} 
                    onPageChange={setCurrentPage} 
                />
           </div>

        </CardContent>
      </Card>
    
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="empCode" className="text-right">
                Emp Code
              </Label>
              <Input
                id="empCode"
                name="empCode"
                value={formData.empCode}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="regDate" className="text-right">
                Reg Date
              </Label>
              <Input
                id="regDate"
                name="regDate"
                type="date"
                value={formData.regDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors">
                {isEditing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeePage;
