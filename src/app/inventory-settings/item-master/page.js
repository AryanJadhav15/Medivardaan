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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ItemMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isView, setIsView] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    inventoryType: "",
    itemName: "",
    brandName: "",
    packagingType: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Mock data for Item Master
  const [data, setData] = useState([
    {
      id: 1,
      inventoryType: "MATERIAL",
      itemName: "Cold cure Powder",
      brandName: "DPI",
      packagingType: "Bottle",
      price: "169.50"
    },
    {
      id: 2,
      inventoryType: "MATERIAL",
      itemName: "cold cure liquid",
      brandName: "DPI",
      packagingType: "Bottle",
      price: "169.50"
    },
    {
      id: 3,
      inventoryType: "MATERIAL",
      itemName: "Composite",
      brandName: "SafeEndo",
      packagingType: "Syringe",
      price: "562.50"
    },
    {
      id: 4,
      inventoryType: "MATERIAL",
      itemName: "Epoxyseal",
      brandName: "SafeEndo",
      packagingType: "Syringe",
      price: "1120.00"
    },
    {
      id: 5,
      inventoryType: "MATERIAL",
      itemName: "Calahyd - Rc",
      brandName: "MAARC",
      packagingType: "Syringe",
      price: "885.00"
    },
    {
      id: 6,
      inventoryType: "MEDICINE",
      itemName: "Aqua Mouthwash",
      brandName: "Dente 91",
      packagingType: "Bottle",
      price: "37.12"
    },
    {
      id: 7,
      inventoryType: "MEDICINE",
      itemName: "sensitive toothpaste",
      brandName: "Dente 91",
      packagingType: "Tube",
      price: "134.92"
    },
    {
      id: 8,
      inventoryType: "MEDICINE",
      itemName: "DB Toothpaste",
      brandName: "Dente 91",
      packagingType: "Tube",
      price: "168.81"
    },
    {
      id: 9,
      inventoryType: "MEDICINE",
      itemName: "She Toothpaste",
      brandName: "Dente 91",
      packagingType: "Tube",
      price: "148.47"
    },
    {
      id: 10,
      inventoryType: "MEDICINE",
      itemName: "mouthwash",
      brandName: "Dente 91",
      packagingType: "Bottle",
      price: "134.91"
    }
  ]);

  // Unique options
  const inventoryTypes = Array.from(new Set(data.map(i => i.inventoryType))).filter(Boolean);
  const brandNames = Array.from(new Set(data.map(i => i.brandName))).filter(Boolean);
  const packagingTypes = Array.from(new Set(data.map(i => i.packagingType))).filter(Boolean);

  const filteredData = data.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleAdd = () => {
    setIsView("form");
    setFormData({ inventoryType: "", itemName: "", brandName: "", packagingType: "", price: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsView("form");
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData(data.filter((item) => item.id !== id));
      // Reset page if current page becomes empty
      if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.itemName) return;

    if (editingId) {
      setData(data.map(item => item.id === editingId ? { ...item, ...formData, price: parseFloat(formData.price || 0).toFixed(2) } : item));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
      setData([...data, { id: newId, ...formData, price: parseFloat(formData.price || 0).toFixed(2) }]);
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
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          ITEM MASTER
        </h1>
      </div>

      {isView === "list" ? (
        <>
           <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div className="flex-1 w-full md:max-w-xl space-y-2">
                     <div className="flex gap-2">
                        <Input
                            placeholder="Search by Name or Brand..."
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
                </div>
                 <div className="text-sm text-gray-500 dark:text-white/50">Total : {filteredData.length}</div>
              </div>
          </div>

           <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto mt-4">
            <Table>
              <TableHeader className="bg-primary/10 dark:bg-[#393053]">
                <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Inventory Type</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Item Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Brand Name</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Packaging Type</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">Price</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((row, index) => (
                    <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                        <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="dark:text-white/75">{row.inventoryType}</TableCell>
                        <TableCell className="dark:text-white/75 font-medium">{row.itemName}</TableCell>
                        <TableCell className="dark:text-white/75">{row.brandName}</TableCell>
                        <TableCell className="dark:text-white/75">{row.packagingType}</TableCell>
                        <TableCell className="dark:text-white/75">{row.price}</TableCell>
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
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 dark:text-white/50 h-24">
                            No records found
                        </TableCell>
                    </TableRow>
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
         <div className="bg-white dark:bg-[#393053] p-6 rounded-lg shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="space-y-4">
               <h3 className="font-bold text-primary border-b pb-2 uppercase">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Inventory Type <span className="text-red-500">*</span></label>
                        <Select value={formData.inventoryType} onValueChange={(val) => setFormData({...formData, inventoryType: val})}>
                            <SelectTrigger className="bg-white dark:bg-[#393053]"><SelectValue placeholder="-- Select Inventory Type --" /></SelectTrigger>
                            <SelectContent>
                                {inventoryTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                {!inventoryTypes.includes("MATERIAL") && <SelectItem value="MATERIAL">MATERIAL</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Item Name <span className="text-red-500">*</span></label>
                        <Input 
                            placeholder="Enter Item Name" 
                            value={formData.itemName} 
                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} 
                            className="bg-white dark:bg-[#393053]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Brand Name</label>
                        <Select value={formData.brandName} onValueChange={(val) => setFormData({...formData, brandName: val})}>
                            <SelectTrigger className="bg-white dark:bg-[#393053]"><SelectValue placeholder="-- Select Brand --" /></SelectTrigger>
                            <SelectContent>
                                {brandNames.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Packaging Type</label>
                        <Select value={formData.packagingType} onValueChange={(val) => setFormData({...formData, packagingType: val})}>
                            <SelectTrigger className="bg-white dark:bg-[#393053]"><SelectValue placeholder="-- Select Packaging Type --" /></SelectTrigger>
                            <SelectContent>
                                {packagingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price</label>
                        <Input 
                            placeholder="0.00" 
                            value={formData.price} 
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                            className="bg-white dark:bg-[#393053]"
                        />
                    </div>
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
