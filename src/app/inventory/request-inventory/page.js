"use client";

import React, { useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function RequestInventory() {
  const [clinicName, setClinicName] = useState("");
  const [rows, setRows] = useState([
    {
      id: 1,
      inventoryType: "",
      itemName: "",
      packaging: "",
      quantity: 0,
      remarks: "",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        inventoryType: "",
        itemName: "",
        packaging: "",
        quantity: 0,
        remarks: "",
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length > 1) {
        setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = () => {
      // Validation: Check if clinic name is selected and rows have data
      if (!clinicName) {
          alert("Please select a clinic.");
          return;
      }
      // Simulate API call
      console.log("Submitting Request:", { clinicName, rows });
      alert("Inventory Request Submitted Successfully!");
      
      // Reset form
      setClinicName("");
      setRows([{
        id: 1,
        inventoryType: "",
        itemName: "",
        packaging: "",
        quantity: 0,
        remarks: "",
      }]);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase">
          CLINIC REQUEST STOCK
        </h1>
      </div>

      {/* Clinic Name Selection */}
      <div className="max-w-md space-y-2">
        <label className="text-sm font-semibold text-gray-500 dark:text-white/50 uppercase">
          Clinic Name
        </label>
        <Select value={clinicName} onValueChange={setClinicName}>
          <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
            <SelectValue placeholder="-- Select Clinic --" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clinic1">Borivali</SelectItem>
            <SelectItem value="clinic2">Kalyan Nagar</SelectItem>
            <SelectItem value="clinic3">Shahibaug</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Table */}
      <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto bg-primary/5 dark:bg-[#393053]/20 p-2">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow className="border-b-0 hover:bg-primary/10">
              <TableHead className="font-bold text-gray-800 dark:text-white/90 min-w-[200px]">Inventory Type</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 min-w-[200px]">Item Name</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 min-w-[150px]">Packaging</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[100px]">Quantity</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 min-w-[150px]">Remarks</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-white/90 w-[50px]">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-b-0 hover:bg-transparent">
                <TableCell className="align-top py-2">
                  <Select
                    value={row.inventoryType}
                    onValueChange={(val) =>
                      handleRowChange(row.id, "inventoryType", val)
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 h-9">
                      <SelectValue placeholder="--- Select Inventory Type---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">MATERIAL</SelectItem>
                      <SelectItem value="medicine">MEDICINE</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="align-top py-2">
                  <Select
                    value={row.itemName}
                    onValueChange={(val) =>
                      handleRowChange(row.id, "itemName", val)
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 h-9">
                      <SelectValue placeholder="---Item Name---" />
                    </SelectTrigger>
                    <SelectContent>
                       {/* Mock Items based on Inventory Type could go here */}
                      <SelectItem value="item1">Cold cure Powder</SelectItem>
                      <SelectItem value="item2">Composite</SelectItem>
                      <SelectItem value="item3">Mouthwash</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                 <TableCell className="align-top py-2">
                  <Select
                    value={row.packaging}
                    onValueChange={(val) =>
                      handleRowChange(row.id, "packaging", val)
                    }
                  >
                     <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 h-9">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottle">Bottle</SelectItem>
                      <SelectItem value="tube">Tube</SelectItem>
                      <SelectItem value="syringe">Syringe</SelectItem>
                    </SelectContent>
                   </Select>
                </TableCell>
                <TableCell className="align-top py-2">
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(row.id, "quantity", e.target.value)
                    }
                    className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 h-9"
                  />
                </TableCell>
                <TableCell className="align-top py-2">
                    <Input
                        value={row.remarks}
                        onChange={(e) =>
                        handleRowChange(row.id, "remarks", e.target.value)
                        }
                         className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 h-9"
                    />
                </TableCell>

                <TableCell className="align-top py-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end p-2">
            <Button
                onClick={handleAddRow}
                className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors font-medium shadow-sm transition-all"
            >
                Add New
            </Button>
        </div>
      </div>

       {/* Submit Button */}
       <div className="flex justify-center pt-6">
        <Button onClick={handleSubmit} className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 font-medium shadow-sm transition-all h-10">
          Submit
        </Button>
      </div>
    </div>
  );
}
