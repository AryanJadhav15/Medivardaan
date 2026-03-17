"use client";

import React, { useState } from "react";
import { Settings, Trash2, CheckCircle } from "lucide-react";
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

export default function OfferList() {
  const [searchName, setSearchName] = useState("");
  const [searchOfferType, setSearchOfferType] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Mock data for Offer List
  const [offers, setOffers] = useState([
    { id: 1, offerTitle: "aa", offerTypeName: "Treatment Offer", startDate: "05-09-2023", endDate: "06-09-2023", clinicName: "Amanora", treatmentName: "Cleaning", offerMode: "Flat Amount (In Rupees)" },
    { id: 2, offerTitle: "aa", offerTypeName: "Treatment Offer", startDate: "05-09-2023", endDate: "07-09-2023", clinicName: "ADAJAN", treatmentName: "Whitening", offerMode: "Flat Amount (In Rupees)" },
    { id: 3, offerTitle: "dfr", offerTypeName: "Default Offer", startDate: "01-08-2022", endDate: "06-09-2023", clinicName: "AMEERPET", treatmentName: "", offerMode: "Flat Amount (In Rupees)" },
    { id: 4, offerTitle: "aa", offerTypeName: "kkkk", startDate: "08-09-2023", endDate: "06-09-2023", clinicName: "Bhopal", treatmentName: "", offerMode: "Discount (in %)" },
    { id: 5, offerTitle: "sasasa", offerTypeName: "Treatment Offer", startDate: "08-09-2023", endDate: "06-09-2023", clinicName: "BADLAPUR", treatmentName: "", offerMode: "Discount (in %)" },
  ]);

  // Form State
  const initialFormState = {
    offerType: "",
    clinic: "",
    offerTitle: "",
    startDate: "",
    endDate: "", 
    treatment: "",
    discountType: "", // percent, flat, points
    discountValue: "",
    photo: null,
    photoName: ""
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Filter Logic
  const filteredOffers = offers.filter(item => {
      const matchName = item.offerTitle.toLowerCase().includes(searchName.toLowerCase());
      const matchType = !searchOfferType || searchOfferType === "all" || item.offerTypeName === searchOfferType;
      return matchName && matchType;
  });

  // Handlers
  const handleDelete = (id) => {
      if(confirm('Are you sure you want to delete this offer?')) {
          setOffers(offers.filter(o => o.id !== id));
      }
  };

  const handleEdit = (offer) => {
    // Map existing offer data to form structure
    // Note: In a real app, you'd map individual fields more carefully if structure differs
    const discountType = offer.offerMode.includes("Discount") ? 'percent' : 
                         offer.offerMode.includes("Flat") ? 'flat' : 'points';
                         
    setFormData({
        offerType: offer.offerTypeName,
        clinic: offer.clinicName,
        offerTitle: offer.offerTitle,
        startDate: offer.startDate ? offer.startDate.split('-').reverse().join('-') : "", // Convert DD-MM-YYYY to YYYY-MM-DD for input
        endDate: offer.endDate ? offer.endDate.split('-').reverse().join('-') : "",
        treatment: offer.treatmentName,
        discountType: discountType,
        discountValue: "", // Mock data doesn't store value separately, so verify empty
        photo: null,
        photoName: ""
    });
    setEditingId(offer.id);
    setViewMode("create");
  };

  const handleAddNew = () => {
      setFormData(initialFormState);
      setEditingId(null);
      setViewMode("create");
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setFormData({ ...formData, photo: e.target.files[0], photoName: e.target.files[0].name });
      }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      
      const offerModeFormatted = formData.discountType === 'percent' ? 'Discount (in %)' : 
                     formData.discountType === 'flat' ? 'Flat Amount (In Rupees)' : 'Credit Points';
                     
      // Simple date formatting mock YYYY-MM-DD -> DD-MM-YYYY
      const formatDate = (d) => d ? d.split('-').reverse().join('-') : "";

      if (editingId) {
          // Update existing
          setOffers(offers.map(o => o.id === editingId ? {
              ...o,
              offerTitle: formData.offerTitle,
              offerTypeName: formData.offerType,
              startDate: formatDate(formData.startDate),
              endDate: formatDate(formData.endDate),
              clinicName: formData.clinic,
              treatmentName: formData.treatment,
              offerMode: offerModeFormatted
          } : o));
          alert("Offer Updated Successfully!");
      } else {
          // Create new
          const newId = Math.max(...offers.map(o => o.id), 0) + 1;
          const newOffer = {
              id: newId,
              offerTitle: formData.offerTitle,
              offerTypeName: formData.offerType,
              startDate: formatDate(formData.startDate),
              endDate: formatDate(formData.endDate),
              clinicName: formData.clinic,
              treatmentName: formData.treatment,
              offerMode: offerModeFormatted
          };
          setOffers([...offers, newOffer]);
          alert("Offer Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
                    {editingId ? "EDIT OFFER" : "OFFER"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600 dark:text-white/60">Offer Type</label>
                        <Select value={formData.offerType} onValueChange={(val) => setFormData({...formData, offerType: val})}>
                            <SelectTrigger><SelectValue placeholder="--- Select Offer Type ---" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Treatment Offer">Treatment Offer</SelectItem>
                                <SelectItem value="Default Offer">Default Offer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Offer Title <span className="text-red-500">*</span></label>
                         <Input required value={formData.offerTitle} onChange={e => setFormData({...formData, offerTitle: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">Date</label>
                         <Input type="date" className="w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm text-gray-600 dark:text-white/60">Applicable To(Clinic) <span className="text-red-500">*</span></label>
                        <Select value={formData.clinic} onValueChange={(val) => setFormData({...formData, clinic: val})}>
                            <SelectTrigger><SelectValue placeholder="--- Select Clinic ---" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Amanora">Amanora</SelectItem>
                                <SelectItem value="ADAJAN">ADAJAN</SelectItem>
                                <SelectItem value="Bhopal">Bhopal</SelectItem>
                                <SelectItem value="BADLAPUR">BADLAPUR</SelectItem>
                                <SelectItem value="AMEERPET">AMEERPET</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm text-gray-600 dark:text-white/60">Treatments Included</label>
                       <Select value={formData.treatment} onValueChange={(val) => setFormData({...formData, treatment: val})}>
                            <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cleaning">Cleaning</SelectItem>
                                <SelectItem value="Whitening">Whitening</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">From Date</label>
                         <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-white/60">To Date</label>
                         <Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                    </div>
                </div>

                 <div className="space-y-2">
                     <label className="text-sm text-gray-600 dark:text-white/60">Discount Options (Any one can be selected)</label>
                     <div className="flex gap-8 items-center pt-2">
                        <label className="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="discount" 
                                value="percent" 
                                checked={formData.discountType === 'percent'}
                                onChange={() => setFormData({...formData, discountType: 'percent'})} 
                            />
                            <span className="text-sm text-gray-600 dark:text-white/60">Discount (in %)</span>
                        </label>
                         <label className="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="discount" 
                                value="flat" 
                                checked={formData.discountType === 'flat'}
                                onChange={() => setFormData({...formData, discountType: 'flat'})} 
                            />
                             <span className="text-sm text-gray-600 dark:text-white/60">Flat Amount (In Rupees)</span>
                        </label>
                         <label className="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="discount" 
                                value="points" 
                                checked={formData.discountType === 'points'}
                                onChange={() => setFormData({...formData, discountType: 'points'})} 
                            />
                             <span className="text-sm text-gray-600 dark:text-white/60">Credit Points</span>
                        </label>
                     </div>
                     <Input 
                        className="mt-2 max-w-md" 
                        placeholder="Enter value" 
                        value={formData.discountValue}
                        onChange={e => setFormData({...formData, discountValue: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex items-center gap-4">
                        <label className="text-sm text-gray-600 dark:text-white/60">Photo</label>
                        <div className="flex flex-col gap-1">
                            <Input 
                                id="file-upload"
                                type="file" 
                                className="max-w-xs" 
                                onChange={handleFileChange}
                            />
                            {formData.photoName && <span className="text-sm text-green-600">Selected: {formData.photoName}</span>}
                        </div>
                        <span className="text-xs text-red-500">
                             {!formData.photoName && "No file chosen"}
                        </span>
                    </div>
                    <div>
                         <Button 
                            type="button" 
                            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                            onClick={() => document.getElementById('file-upload').click()}
                         >
                            Upload Image
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center pt-8 gap-4">
                    <Button type="submit" className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-12 py-2 text-lg">SUBMIT</Button>
                    <Button 
                        type="button" 
                        variant="secondary"
                        className="bg-gray-50 dark:bg-[#18122B]0 hover:bg-gray-600 text-white px-12 py-2 text-lg"
                        onClick={() => setViewMode("list")}
                    >
                        CANCEL
                    </Button>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-medivardaan-teal uppercase tracking-wide">
          OFFER LIST
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full flex gap-2 items-center">
             <Input
                placeholder="Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs"
            />
            <Select value={searchOfferType} onValueChange={setSearchOfferType}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 max-w-xs">
                <SelectValue placeholder="--- Select Offer Type ---" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Treatment Offer">Treatment Offer</SelectItem>
                <SelectItem value="Default Offer">Default Offer</SelectItem>
                </SelectContent>
            </Select>
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
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-[#393053]">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Offer Title</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Offer Type Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Start Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">End Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Clinic Name</TableHead>
               <TableHead className="font-bold text-gray-700 dark:text-white/75">Treatment Name</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-white/75">Offer Mode</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{index + 1}</TableCell>
                <TableCell className="dark:text-white/75">{row.offerTitle}</TableCell>
                <TableCell className="dark:text-white/75">{row.offerTypeName}</TableCell>
                <TableCell className="dark:text-white/75">{row.startDate}</TableCell>
                <TableCell className="dark:text-white/75">{row.endDate}</TableCell>
                <TableCell className="dark:text-white/75">{row.clinicName}</TableCell>
                <TableCell className="dark:text-white/75">{row.treatmentName}</TableCell>
                 <TableCell className="dark:text-white/75">{row.offerMode}</TableCell>
                <TableCell className="dark:text-white/75">
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 text-gray-600 dark:text-white/60 hover:text-blue-600"
                            onClick={() => handleEdit(row)}
                        >
                            {/* Replaced CheckCircle with Pencil or Settings as requested, defaulting to a standard Edit icon (Settings) if CheckCircle was unwanted */}
                            <Settings className="h-4 w-4" /> 
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
             {filteredOffers.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No offers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          {/* Pagination controls */}
        </div>
    </div>
  );
}
