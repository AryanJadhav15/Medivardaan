"use client";

import React, { useState } from "react";
import { Settings, Trash2, FileSpreadsheet, Plus, Pencil } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import CustomPagination from "@/components/ui/custom-pagination";
import { exportToExcel } from "@/utils/exportToExcel";

const AREA_MANAGERS_DATA = [
  { id: 1, name: "Dr.RUCHII BHANSALI" },
  { id: 2, name: "Sayali Jadhav" },
  { id: 3, name: "Dr.Kunal Shet" },
  { id: 4, name: "Dr.Nilay Vakharia" },
  { id: 5, name: "Dr.Isha jain" },
  { id: 6, name: "Dr.Akhil Nair" },
  { id: 7, name: "Dr.Anagha Patil Chavan" },
  { id: 8, name: "Dr.Apurva Vaidya" },
  { id: 9, name: "Dr.MADHU PAWAR" },
];

const AreaManagerPage = () => {
  const [areaManagers, setAreaManagers] = useState(AREA_MANAGERS_DATA);
  const [searchName, setSearchName] = useState("");
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  // Filter Logic
  const filteredManagers = areaManagers.filter((manager) =>
    manager.name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredManagers.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setIsEditing(false);
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (manager) => {
    setIsEditing(true);
    setCurrentId(manager.id);
    setFormData({ name: manager.name });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setAreaManagers((prev) =>
        prev.map((m) =>
          m.id === currentId ? { ...m, ...formData } : m
        )
      );
    } else {
      const newManager = {
        id: areaManagers.length + 1,
        ...formData,
      };
      setAreaManagers((prev) => [...prev, newManager]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this area manager?")) {
      setAreaManagers((prev) => prev.filter((m) => m.id !== id));
    }
  };

    const handleExport = () => {
    exportToExcel(filteredManagers, "Area_Managers");
  };

  return (
    <div className="w-full p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-medivardaan-teal dark:text-medivardaan-purple" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal dark:text-medivardaan-purple">
          AREA MANAGER SUB ADMIN
        </h1>
      </div>

      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-6 space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 w-full max-w-2xl">
              <div className="relative flex-1">
                <Input 
                  placeholder="Area Manager Name" 
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#443C68]/50 active:border-primary focus:border-primary pl-3"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors dark:bg-primary dark:hover:bg-primary/90"
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button 
                onClick={openAddDialog}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors dark:bg-primary dark:hover:bg-primary/90"
            >
                Add New
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-white/60 font-medium">
              Total : {filteredManagers.length}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border border-gray-200 dark:border-[#443C68]/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-primary/20">
                <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50 hover:bg-transparent">
                  <TableHead className="w-16 text-gray-700 dark:text-white/90 font-bold">Sr No.</TableHead>
                  <TableHead className="text-gray-700 dark:text-white/90 font-bold">Area Manager</TableHead>
                  <TableHead className="w-24 text-center text-gray-700 dark:text-white/90 font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((manager, index) => (
                    <TableRow 
                        key={manager.id} 
                        className="border-b last:border-b-0 border-gray-100 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 transition-colors"
                    >
                        <TableCell className="font-medium text-gray-900 dark:text-white">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="text-blue-600 hover:text-blue-800 dark:text-[#635985] cursor-pointer">
                        {manager.name}
                        </TableCell>
                        <TableCell className="text-center">
                         <div className="flex justify-center gap-2">
                             <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog(manager)}
                                className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                                >
                                <Pencil size={16} />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost" 
                                onClick={() => handleDelete(manager.id)}
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
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-white/50">
                            No area managers found
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Export Icon & Pagination */}
          <div className="flex justify-between items-center">
             <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={handleExport}>
              <div className="w-8 h-8 flex items-center justify-center bg-green-700 rounded text-white hover:bg-green-800 transition-colors">
                <FileSpreadsheet size={20} />
              </div>
            </Button>
            
            <CustomPagination 
                totalItems={filteredManagers.length} 
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
            <DialogTitle>{isEditing ? "Edit Area Manager" : "Add New Area Manager"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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

export default AreaManagerPage;
