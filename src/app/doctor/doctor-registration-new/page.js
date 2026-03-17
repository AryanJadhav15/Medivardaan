"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, Edit, Calendar, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// React Query hooks
import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [filters, setFilters] = useState({
    doctorName: "",
    mobileNo: "",
    panel: "all",
  });

  const [formData, setFormData] = useState({
    // Clinic & Doctor Type
    clinicName: "",
    doctorType: "full-time",
    date: new Date().toISOString().split('T')[0],

    // Personal Information
    title: "Dr.",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    addressLine1: "",
    addressLine2: "",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    areaPin: "",
    mobileNo1: "",
    mobileNo2: "",
    email: "",
    bloodGroup: "",
    inTime: "",
    outTime: "",

    // Education
    educationList: [],
    currentEducation: {
      degree: "",
      board: "",
      upload: null,
    },

    // Speciality
    specialities: {
      asthesticDentist: false,
      generalDentist: false,
      orthodontics: false,
      periodontics: false,
      conservativeDentist: false,
      oralMaxillofacial: false,
      pedodontics: false,
      prosthodontics: false,
      endodontics: false,
      oralPathology: false,
    },

    // Documents
    profilePhoto: null,
    adharCardNo: "",
    adharCardImage: null,
    panCardNo: "",
    panCardImage: null,
    registrationNo: "",
    certificateImage: null,
    indemnityPolicyNo: "",
    indemnityPolicyImage: null,
  });

  // React Query hooks
  const { data: doctors = [], isLoading, error, refetch } = useDoctors();
  const upsertMutation = useUpsertDoctor();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEducationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentEducation: {
        ...prev.currentEducation,
        [field]: value,
      },
    }));
  };

  const handleSpecialityChange = (field, checked) => {
    setFormData((prev) => ({
      ...prev,
      specialities: {
        ...prev.specialities,
        [field]: checked,
      },
    }));
  };

  const handleAddEducation = () => {
    if (formData.currentEducation.degree && formData.currentEducation.board) {
      setFormData((prev) => ({
        ...prev,
        educationList: [...prev.educationList, prev.currentEducation],
        currentEducation: {
          degree: "",
          board: "",
          upload: null,
        },
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleEducationChange("upload", file);
    }
  };

  const handleDocumentUpload = (field, file) => {
    if (file) {
      handleInputChange(field, file);
    }
  };

  const handleNext = () => {
    if (activeTab === "personal") {
      setActiveTab("education");
    } else if (activeTab === "education") {
      setActiveTab("documents");
    }
  };

  const handleFormSubmit = async () => {
    // Validate mandatory fields
    const mandatoryFields = {
      clinicName: "Clinic Name",
      firstName: "First Name",
      lastName: "Last Name",
      mobileNo1: "Mobile No 1",
      email: "Email",
      inTime: "In Time (HH:MM)",
      outTime: "Out Time (HH:MM)",
      panCardNo: "Pan Card No.",
      registrationNo: "Registration No.",
      indemnityPolicyNo: "Indemnity Policy No."
    };

    const missingFields = [];
    Object.entries(mandatoryFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate mobile number format
    if (formData.mobileNo1.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Submit using React Query mutation
    upsertMutation.mutate(formData, {
      onSuccess: (data) => {
        alert(`Doctor added successfully! Doctor ID: ${data.doctorID}`);

        // Reset form data
        setFormData({
          clinicName: "",
          doctorType: "full-time",
          date: new Date().toISOString().split('T')[0],
          title: "Dr.",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "male",
          addressLine1: "",
          addressLine2: "",
          country: "India",
          state: "Maharashtra",
          city: "Mumbai",
          areaPin: "",
          mobileNo1: "",
          mobileNo2: "",
          email: "",
          bloodGroup: "",
          inTime: "",
          outTime: "",
          educationList: [],
          currentEducation: {
            degree: "",
            board: "",
            upload: null,
          },
          specialities: {
            asthesticDentist: false,
            generalDentist: false,
            orthodontics: false,
            periodontics: false,
            conservativeDentist: false,
            oralMaxillofacial: false,
            pedodontics: false,
            prosthodontics: false,
            endodontics: false,
            oralPathology: false,
          },
          profilePhoto: null,
          adharCardNo: "",
          adharCardImage: null,
          panCardNo: "",
          panCardImage: null,
          registrationNo: "",
          certificateImage: null,
          indemnityPolicyNo: "",
          indemnityPolicyImage: null,
        });

        // Close form and reset tab
        setShowAddForm(false);
        setActiveTab("personal");
      },
      onError: (error) => {
        alert(`Failed to add doctor: ${error.message}`);
      },
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Search filters:", filters);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setActiveTab("personal");
  };

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = !filters.doctorName ||
      doctor.name.toLowerCase().includes(filters.doctorName.toLowerCase());

    const matchesMobile = !filters.mobileNo ||
      doctor.mobileNo.includes(filters.mobileNo);

    const matchesPanel = !filters.panel || filters.panel === "all";

    return matchesName && matchesMobile && matchesPanel;
  });

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-[#18122B] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-primary dark:text-primary">
          DOCTOR REGISTRATION (Axios + React Query)
        </h1>
      </div>

      {/* Success Message */}
      {upsertMutation.isSuccess && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 dark:text-green-400 font-medium">
              Doctor saved successfully!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Doctor Form Section */}
      {showAddForm && (
        <Card className="border-2 border-blue-500 dark:border-[#443C68]/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary dark:text-primary">
                Add New Doctor
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="hover:bg-gray-100 dark:bg-[#393053] dark:hover:bg-[#393053]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Clinic Name Selection */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="clinicName" className="text-sm font-medium">
                Clinic Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.clinicName}
                onValueChange={(value) => handleInputChange("clinicName", value)}
              >
                <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                  <SelectValue placeholder="--- Select Clinic ---" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panvel">Panvel</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="nashik">Nashik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 bg-gray-100 dark:bg-[#393053]">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                {/* Form fields - same as before */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="doctorType" className="text-sm font-medium">
                      Doctor Type
                    </Label>
                    <Select
                      value={formData.doctorType}
                      onValueChange={(value) => handleInputChange("doctorType", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-Time Consultant</SelectItem>
                        <SelectItem value="part-time">Part-Time Consultant</SelectItem>
                        <SelectItem value="visiting">Visiting Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                    />
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Select
                      value={formData.title}
                      onValueChange={(value) => handleInputChange("title", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                    />
                  </div>
                </div>

                {/* Contact fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo1" className="text-sm font-medium">
                      Mobile No 1. <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNo1"
                      value={formData.mobileNo1}
                      onChange={(e) => handleInputChange("mobileNo1", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Time fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="inTime" className="text-sm font-medium">
                      In Time (HH:MM) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="time"
                      id="inTime"
                      value={formData.inTime}
                      onChange={(e) => handleInputChange("inTime", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outTime" className="text-sm font-medium">
                      Out Time (HH:MM) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="time"
                      id="outTime"
                      value={formData.outTime}
                      onChange={(e) => handleInputChange("outTime", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Education & Documents tabs - simplified for brevity */}
              <TabsContent value="education" className="space-y-6 mt-6">
                <p className="text-gray-600 dark:text-white/60">Education section...</p>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-6">
                {/* PAN Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="panCardNo" className="text-sm font-medium">
                      Pan Card No. <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="panCardNo"
                      value={formData.panCardNo}
                      onChange={(e) => handleInputChange("panCardNo", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                      placeholder="Enter PAN card number"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Registration No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="registrationNo" className="text-sm font-medium">
                      Registration No. <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="registrationNo"
                      value={formData.registrationNo}
                      onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                {/* Indemnity Policy No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="indemnityPolicyNo" className="text-sm font-medium">
                      Indemnity Policy No. <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="indemnityPolicyNo"
                      value={formData.indemnityPolicyNo}
                      onChange={(e) => handleInputChange("indemnityPolicyNo", e.target.value)}
                      className="border-gray-300 dark:border-[#443C68]/50"
                      placeholder="Enter indemnity policy number"
                    />
                  </div>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-center gap-4 pt-6">
                  <Button
                    onClick={handleFormSubmit}
                    disabled={upsertMutation.isPending}
                    className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {upsertMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    disabled={upsertMutation.isPending}
                    variant="outline"
                    className="bg-primary hover:bg-primary text-white border-primary px-8 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Search Filters */}
      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Input
              placeholder="Doctor Name"
              value={filters.doctorName}
              onChange={(e) => handleFilterChange("doctorName", e.target.value)}
              className="border-gray-300 dark:border-[#443C68]/50"
            />
            <Input
              placeholder="Mobile No."
              value={filters.mobileNo}
              onChange={(e) => handleFilterChange("mobileNo", e.target.value)}
              className="border-gray-300 dark:border-[#443C68]/50"
            />
            <Select
              value={filters.panel}
              onValueChange={(value) => handleFilterChange("panel", value)}
            >
              <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                <SelectValue placeholder="Panvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Panels</SelectItem>
                <SelectItem value="panvel">Panvel</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
        >
          Add New
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-primary mb-1">
                Error Loading Doctors
              </h3>
              <p className="text-red-700 dark:text-red-300">{error.message}</p>
              <Button
                onClick={() => refetch()}
                className="mt-3 bg-primary hover:bg-primary text-white"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Doctors Table */}
      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-white/60">Loading doctors...</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10 hover:bg-primary/20">
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Sr. No.
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Photo
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Mobile No.
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Email ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white">
                      Reg Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 dark:text-white text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50"
                      >
                        <TableCell className="text-gray-900 dark:text-white">
                          {doctor.srNo}
                        </TableCell>
                        <TableCell>
                          <div className="w-16 h-16 bg-gray-200 dark:bg-[#443C68] rounded flex items-center justify-center overflow-hidden">
                            <span className="text-xs text-gray-500 dark:text-white/60">
                              No Image
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {doctor.name}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {doctor.mobileNo}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {doctor.emailId}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">
                          {doctor.regDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <button className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-white/60 dark:hover:text-blue-400">
                              <Edit className="w-4 h-4 text-gray-600 dark:text-white/60" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:bg-[#393053] dark:hover:bg-[#443C68] rounded">
                              <Eye className="w-4 h-4 text-gray-600 dark:text-white/60" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:bg-[#393053] dark:hover:bg-[#443C68] rounded">
                              <Calendar className="w-4 h-4 text-gray-600 dark:text-white/60" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-white/50">
                        No doctors found matching your Search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
