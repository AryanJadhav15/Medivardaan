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

export default function MedicalProblem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    medicalProblem: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Mock data for Medical Problem
  const [problems, setProblems] = useState([
    { id: 1, medicalProblem: "Asthma" },
    { id: 2, medicalProblem: "Arthritis,Rheumatism" },
    { id: 3, medicalProblem: "Blood Disease" },
    { id: 4, medicalProblem: "Blood Pressure" },
    { id: 5, medicalProblem: "Jaundice" },
    { id: 6, medicalProblem: "Liver Disease" },
    { id: 7, medicalProblem: "Kidney Disease" },
    { id: 8, medicalProblem: "Psychiatric Tratement" },
    { id: 9, medicalProblem: "Radiation Tratement" },
    { id: 10, medicalProblem: "Respiratory Disease" }
  ]);

  const filteredData = problems.filter(item => 
      item.medicalProblem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this medical problem?")) {
          setProblems(problems.filter(p => p.id !== id));
      }
  };

  const handleEdit = (problem) => {
      setFormData({
          medicalProblem: problem.medicalProblem
      });
      setEditingId(problem.id);
      setViewMode("create");
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setViewMode("create");
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (editingId) {
          setProblems(problems.map(p => p.id === editingId ? {
              ...p,
              medicalProblem: formData.medicalProblem
          } : p));
          alert("Medical Problem Updated Successfully!");
      } else {
          const newId = Math.max(...problems.map(p => p.id), 0) + 1;
          const newProblem = {
              id: newId,
              medicalProblem: formData.medicalProblem
          };
          setProblems([...problems, newProblem]);
          alert("Medical Problem Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
                <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
                <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">MEDICAL PROBLEM</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                     <label className="text-sm text-gray-600 dark:text-white/60">Medical Problem <span className="text-red-500">*</span></label>
                     <Input required value={formData.medicalProblem} onChange={e => setFormData({...formData, medicalProblem: e.target.value})} className="max-w-md" />
                </div>

                <div className="flex gap-4">
                     <Button type="submit" className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6">Submit</Button>
                     <Button type="button" className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6" onClick={() => setViewMode("list")}>Cancel</Button>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          MEDICAL PROBLEM
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
            <Input
                placeholder="Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-white/20 flex-1"
            />
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
            <Button 
                onClick={handleAddNew}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New
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
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Medical Problem</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.medicalProblem}</TableCell>
                <TableCell className="dark:text-white/75">
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400"
                            onClick={() => handleEdit(row)}
                        >
                            <Pencil className="h-4 w-4" />
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
             {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No medical problems found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          <div className="flex gap-2 text-sm text-blue-600 dark:text-[#635985]">
             <span className="cursor-pointer hover:underline p-1">12345</span>
          </div>
        </div>
    </div>
  );
}
