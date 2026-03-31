"use client";

import React, { useState } from "react";
import { Settings, FilePenLine, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function LoginDetailsPage() {
  const [loginType, setLoginType] = useState("clinic");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Edit Mode States
  const [isView, setIsView] = useState("list"); // 'list' or 'form'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
      name: "",
      username: "",
      password: "",
      type: "clinic" // Default type
  });


  // Mock data matching the image
  const [loginData, setLoginData] = useState([
    { id: 1, name: "Borivali", username: "admin_br", password: "admin", type: "clinic" },
    { id: 2, name: "DADAR West", username: "Admin_ddr", password: "Admin", type: "clinic" },
    { id: 3, name: "bandra west", username: "Admin_bd", password: "Admin", type: "clinic" },
    { id: 4, name: "Andheri West (Juhu)", username: "Admin_Andheri", password: "Admin", type: "clinic" },
    { id: 5, name: "GOREGAON East", username: "Admin_gg", password: "Admin", type: "clinic" },
    { id: 6, name: "MALAD West", username: "Admin_ml", password: "Admin", type: "clinic" },
    { id: 7, name: "BYCULLA West", username: "Admin_by", password: "Admin", type: "clinic" },
    { id: 8, name: "GHATKOPAR East", username: "Ghatkopar@orthosquare", password: "Admin-2#", type: "clinic" },
    { id: 9, name: "MULUND", username: "Admin_mu", password: "Admin", type: "clinic" },
    { id: 10, name: "CHEMBUR East", username: "Admin_Chembur", password: "chem-1#", type: "clinic" },
    { id: 11, name: "Dr. Smith", username: "doc_smith", password: "password123", type: "doctor" },
  ]);

  const handleExport = () => {
    exportToExcel(loginData, "Login_Details");
  };

    // Edit Handlers
    const handleEdit = (item) => {
        setIsView("form");
        setEditingId(item.id);
        setFormData({
            name: item.name,
            username: item.username,
            password: item.password,
            type: item.type
        });
    };

    const handleCancel = () => {
        setIsView("list");
        setEditingId(null);
        setFormData({ name: "", username: "", password: "", type: "clinic" });
    };

    const handleSubmit = () => {
        if (editingId) {
            setLoginData(loginData.map(item => 
                item.id === editingId ? { ...item, ...formData } : item
            ));
        }
        setIsView("list");
        setEditingId(null);
        setFormData({ name: "", username: "", password: "", type: "clinic" });
    };


  // Filter Data
  const filteredData = loginData.filter((item) => {
      const matchesType = item.type === loginType;
      const matchesName = item.name.toLowerCase().includes(name.toLowerCase());
      // Mock data doesn't have mobile, assuming name/username filter for now or skipping if mobile logic not essential for mock
      const matchesMobile = true; 
      return matchesType && matchesName && matchesMobile;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <FileSpreadsheet className="w-5 h-5 font-bold text-medivardaan-teal uppercase tracking-wid" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          LOGIN
        </h1>
      </div>

    {isView === "list" ? (
        <>
            {/* Filters */}
            <div className="space-y-4">
                <RadioGroup value={loginType} onValueChange={setLoginType} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="clinic" id="clinic" className="text-white-600 border-blue-600" />
                    <Label htmlFor="clinic" className="text-gray-700 dark:text-white/75 font-medium">Clinic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" className="text-white-600 border-blue-600" />
                    <Label htmlFor="doctor" className="text-gray-700 dark:text-white/75 font-medium">Doctor</Label>
                    </div>
                </RadioGroup>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="text-xs font-medium text-gray-700 dark:text-white/75">Name</label>
                    <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                    />
                </div>
                <div className="w-full md:w-1/3">
                    <label className="text-xs font-medium text-gray-700 dark:text-white/75">Mobile No</label>
                    <Input
                    placeholder="Mobile No"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50"
                    />
                </div>

                <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all w-full md:w-auto">
                    Search
                </Button>
                </div>
            </div>

            {/* Total Count */}
            <div className="flex justify-end text-sm text-gray-600 dark:text-white/60 font-medium">
                Total : {filteredData.length}
            </div>

            {/* Table */}
            <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden">
                <Table>
                <TableHeader >
                    <TableRow >
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75">Name</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75">User Name</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75">Password</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((item, index) => (
                    <TableRow key={item.id} >
                        <TableCell className="dark:text-white/75">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="dark:text-white/75">{item.name}</TableCell>
                        <TableCell className="dark:text-white/75">{item.username}</TableCell>
                        <TableCell className="dark:text-white/75">{item.password}</TableCell>
                        <TableCell className="text-right">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-black dark:text-white border border-black dark:border-white rounded-md p-1"
                                onClick={() => handleEdit(item)}
                            >
                                <FilePenLine className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                    {currentItems.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500 dark:text-white/50">No matching records found</TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex justify-between items-center pt-2">
                {/* Excel Export Icon */}
                <Button variant="ghost" size="icon" onClick={handleExport} className="text-green-600 hover:text-green-700">
                    <FileSpreadsheet className="w-6 h-6" />
                </Button>

                {/* Pagination component */}
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
                 <h3 className="font-bold text-lg text-primary border-b pb-2">EDIT LOGIN DETAILS</h3>
                 
                 <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <Label>Username</Label>
                    <Input 
                         value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <Label>Password</Label>
                    <Input 
                         value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
             </div>

             <div className="flex justify-end gap-4 pt-4">
                <Button onClick={handleCancel} variant="outline" className="min-w-[100px]">Cancel</Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors min-w-[100px]">
                    Update
                </Button>
             </div>
        </div>
    )}
    </div>
  );
}
