"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { patientService } from "@/api/patient";

function PatientEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const mode = searchParams.get("mode");

  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Clinic
    clinicName: "",

    // Personal Information
    casePaperNo: "",
    patientNo: mode === 'add' ? "NEW" : "", // Show NEW for new patients
    date: new Date().toISOString().split('T')[0], // Default to today
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    flatHouseNo: "",
    areaStreet: "",
    landmark: "",
    country: "India",
    state: "",
    city: "",
    age: "",
    bloodGroup: "",
    email: "",
    enquirySource: "",
    mobileNo: "",
    telephoneNo: "",
    patientProfile: null,

    // Medical History
    familyDoctorName: "",
    familyDoctorAddress: "",

    // Medical conditions
    asthma: false,
    radiationTreatment: false,
    tb: false,
    g6pd: false,
    miagraine: false,
    ulcer: false,
    arthritisRheumatism: false,
    respiratoryDisease: false,
    thyroidProblem: false,
    ibs: false,
    undergoneBP: false,
    thyroiditis: false,
    bloodDisease: false,
    cancer: false,
    venerealDisease: false,
    skinAllergy: false,
    skinAllergy2: false,
    varicoseVein: false,
    bloodPressure: false,
    diabetes: false,
    acidity: false,
    pneumonia: false,
    corticosteroidTreatment: false,
    diabetic: false,
    jaundice: false,
    epilepsy: false,
    paralysis: false,
    cardiacDiseases: false,
    autism: false,
    thyroidProblem2: false,
    liverDisease: false,
    hepatitis: false,
    slipDisc: false,
    hiv: false,
    takesEcosprin: false,
    tb2: false,
    kidneyDisease: false,
    herpes: false,
    vertigo: false,
    trigeminalNeuralgia: false,
    tabMercazol5mg: false,
    typhoid: false,
    psychiatricTratement: false,
    rheumaticFever: false,
    psoriasis: false,
    bellsPalsy: false,
    miBeforeTaking: false,

    // Woman section
    isPregnant: false,
    dueDate: "",

    // Habits
    panMasalaChewing: false,
    panChewingTobacco: false,
    smoking: false,
    cigarettesPerDay: "",
    medicineList: "",

    // Allergies
    penicillin: false,
    aspirin: false,
    iodeine: false,
    local: false,
    anaesthtic: false,
    ibuprofen: false,
    sulfa: false,
    combiflam: false,
    highCloseProblem: false,
    ecospirin: false,
    paracetemol: false,
    eggAllergy: false,
    none: false,
    dustSmoke: false,
    ceftriazone: false,
    ciprofloxacin: false,
    amox: false,
    doxycycline: false,
    diclofenac: false,
    injAmpicillin: false,
    injTrimadole: false,
    no: false,
    sulfa2: false,
    nil: false,
    sulfide: false,
    kidneyStoneThyroid: false,
    catract: false,
    thyronorm120mg: false,
    mox: false,
    etoxiconilCox2: false,

    // Dental Information
    complaint: "",
    dentalTreatmentList: "",
    toothNo: "",
    consentStatement: false,
    consentImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [consentImagePreview, setConsentImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load patient data or pre-fill from query params
  useEffect(() => {
    if (mode === 'add') {
      // Pre-fill from query params
      setFormData(prev => ({
        ...prev,
        firstName: searchParams.get("firstName") || "",
        lastName: searchParams.get("lastName") || "",
        mobileNo: searchParams.get("mobileNo") || "",
        enquirySource: searchParams.get("enquirySource") || "",
      }));
      setIsLoading(false);
    } else if (patientId) {
      loadPatientData(patientId);
    } else {
      console.warn("No patient ID found in URL");
      setIsLoading(false);
    }
  }, [patientId, mode, searchParams]);

  const loadPatientData = async (id) => {
    console.log("Loading patient data for ID:", id);
    try {
      const patientData = await patientService.getPatientById(id);
      
      if (patientData) {
        console.log("Patient data loaded successfully:", patientData);
        setFormData(prev => ({
            ...prev,
            ...patientData,
            firstName: patientData.firstName || patientData.FirstName || patientData.fristName || prev.firstName,
            lastName: patientData.lastName || patientData.LastName || prev.lastName,
            mobileNo: patientData.mobile || patientData.Mobile || patientData.mobileNo || prev.mobileNo,
            patientNo: patientData.patientCode || patientData.PatientCode || prev.patientNo,
            clinicName: patientData.clinicName || patientData.ClinicName || prev.clinicName,
        }));
      } else {
        console.error("Patient not found with ID:", id);
        alert("Patient not found");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading patient data:", error);
      alert("Error loading patient details");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "mobileNo" || field === "telephoneNo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate age from date of birth
    if (field === "dateOfBirth" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData((prev) => ({ ...prev, age: age - 1 }));
      } else {
        setFormData((prev) => ({ ...prev, age }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, patientProfile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConsentImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, consentImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setConsentImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePersonalInfo = () => {
    const errors = [];

    if (!formData.clinicName) errors.push("Clinic Name");
    if (!formData.firstName) errors.push("First Name");
    if (!formData.lastName) errors.push("Last Name");
    if (!formData.mobileNo) errors.push("Mobile No");
    if (formData.mobileNo && formData.mobileNo.length < 10) {
      alert("Mobile number must be at least 10 digits");
      return false;
    }
    if (!formData.flatHouseNo) errors.push("Flat/House No.");
    if (!formData.areaStreet) errors.push("Area/Street");
    if (!formData.enquirySource) errors.push("Enquiry Source");

    if (errors.length > 0) {
      alert(`Please fill in the following required fields:\n${errors.join("\n")}`);
      return false;
    }

    return true;
  };

  const handleNextFromPersonal = () => {
    if (validatePersonalInfo()) {
      setActiveTab("medical");
    }
  };

  const handleNextFromMedical = () => {
    setActiveTab("dental");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.clinicName || !formData.firstName || !formData.lastName) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.mobileNo || formData.mobileNo.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }

    try {
      // TODO: Implement API call to update patient data
      console.log("Updating patient:", formData);

      // Show success message
      alert("Patient details updated successfully!");

      // Navigate back to search page
      router.push("/MIS/patient-search");
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient details. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/MIS/patient-search");
  };

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "medical", label: "Medical History" },
    { id: "dental", label: "Dental Information" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#18122B] flex items-center justify-center">
        <div className="text-gray-600 dark:text-white/60">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18122B] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-700 dark:text-white/75 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Add Patient' : 'Edit Patient Details'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
              {mode === 'add' ? 'New Registration' : `Patient ID: ${patientId}`}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-md bg-white dark:bg-[#393053]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Clinic Name */}
              <div className="mb-6">
                <Label htmlFor="clinicName" className="text-sm font-medium">
                  Clinic Name <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.clinicName}
                  onValueChange={(value) => handleInputChange("clinicName", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Borivali">Borivali</SelectItem>
                    <SelectItem value="MALAD West">MALAD West</SelectItem>
                    <SelectItem value="Ghodbunder road">Ghodbunder road</SelectItem>
                    <SelectItem value="JayaNagar">JayaNagar</SelectItem>
                    <SelectItem value="MADHAPUR">MADHAPUR</SelectItem>
                    <SelectItem value="Aundh">Aundh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#443C68] dark:text-white/75 dark:hover:bg-[#443C68]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  {/* Case Paper No. */}
                  <div>
                    <Label htmlFor="casePaperNo">Case Paper No.</Label>
                    <Input
                      id="casePaperNo"
                      placeholder="Enter Case File No."
                      value={formData.casePaperNo}
                      onChange={(e) => handleInputChange("casePaperNo", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Patient No. and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="patientNo">Patient No.</Label>
                      <Input
                        id="patientNo"
                        value={formData.patientNo}
                        onChange={(e) => handleInputChange("patientNo", e.target.value)}
                        className="mt-1 bg-gray-50 dark:bg-[#18122B]"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <div className="flex gap-6 mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="flatHouseNo">
                        Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="flatHouseNo"
                        value={formData.flatHouseNo}
                        onChange={(e) => handleInputChange("flatHouseNo", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="areaStreet">
                        Area, Street, Sector, Village <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="areaStreet"
                        value={formData.areaStreet}
                        onChange={(e) => handleInputChange("areaStreet", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Landmark and Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        placeholder="Enter Landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange("landmark", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* State and City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleInputChange("state", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => handleInputChange("city", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Nagpur">Nagpur</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Age and Blood Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="mt-1"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        placeholder="Enter Blood Group"
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Email and Enquiry Source */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="enquirySource">
                        Enquiry Source <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.enquirySource}
                        onValueChange={(value) => handleInputChange("enquirySource", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GOOGLE">Google</SelectItem>
                          <SelectItem value="FACEBOOK">Facebook</SelectItem>
                          <SelectItem value="REFERRAL">Referral</SelectItem>
                          <SelectItem value="WALK-IN">Walk-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mobile No. and Telephone No. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="mobileNo">
                        Mobile No. <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mobileNo"
                        type="tel"
                        value={formData.mobileNo}
                        onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephoneNo">Telephone No.</Label>
                      <Input
                        id="telephoneNo"
                        type="tel"
                        placeholder="Enter Telephone"
                        value={formData.telephoneNo}
                        onChange={(e) => handleInputChange("telephoneNo", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Patient Profile Image Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <Label htmlFor="patientProfile">Patient Profile</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="file"
                          id="patientProfile"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="patientProfile"
                          className="px-4 py-2 border border-gray-300 dark:border-[#635985]/40 rounded-md cursor-pointer hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#443C68] text-sm"
                        >
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500 dark:text-white/60">
                          {formData.patientProfile ? formData.patientProfile.name : "No file chosen"}
                        </span>
                        <Button
                          type="button"
                          className="bg-teal-600 hover:bg-teal-700 ml-auto"
                          onClick={() => {
                            if (formData.patientProfile) {
                              // TODO: Implement actual image upload to server
                            }
                          }}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-32 h-32 border border-gray-300 dark:border-[#635985]/40 rounded-md overflow-hidden bg-gray-50 dark:bg-[#18122B] flex items-center justify-center">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Patient Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-2">
                            <div className="text-gray-400 text-xs">SORRY, NO IMAGE AVAILABLE</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History Tab */}
              {activeTab === "medical" && (
                <div className="space-y-6">
                  {/* Family Doctor Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="familyDoctorName">Family Doctor's Name</Label>
                      <Input
                        id="familyDoctorName"
                        placeholder="Enter Family Doctor's Name"
                        value={formData.familyDoctorName}
                        onChange={(e) => handleInputChange("familyDoctorName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="familyDoctorAddress">Address & Telephone no.</Label>
                      <Input
                        id="familyDoctorAddress"
                        placeholder="Enter Address & Telephone no."
                        value={formData.familyDoctorAddress}
                        onChange={(e) => handleInputChange("familyDoctorAddress", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">Have you Suffered from any of the following</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.asthma}
                          onChange={(e) => handleInputChange("asthma", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Asthma</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.radiationTreatment}
                          onChange={(e) => handleInputChange("radiationTreatment", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Radiation Tratement</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tb}
                          onChange={(e) => handleInputChange("tb", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">TB</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.g6pd}
                          onChange={(e) => handleInputChange("g6pd", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">G-6-PD</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.miagraine}
                          onChange={(e) => handleInputChange("miagraine", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Miagraine</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ulcer}
                          onChange={(e) => handleInputChange("ulcer", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Ulcer</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.arthritisRheumatism}
                          onChange={(e) => handleInputChange("arthritisRheumatism", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Arthritis,Rheumatism</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.respiratoryDisease}
                          onChange={(e) => handleInputChange("respiratoryDisease", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Respiratory Disease</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.thyroidProblem}
                          onChange={(e) => handleInputChange("thyroidProblem", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Thyroid Problem</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ibs}
                          onChange={(e) => handleInputChange("ibs", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">IBS</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.undergoneBP}
                          onChange={(e) => handleInputChange("undergoneBP", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Undergone bypass surgery</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.thyroiditis}
                          onChange={(e) => handleInputChange("thyroiditis", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">thyroiditis</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.bloodDisease}
                          onChange={(e) => handleInputChange("bloodDisease", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Blood Disease</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cancer}
                          onChange={(e) => handleInputChange("cancer", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Cancer</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.venerealDisease}
                          onChange={(e) => handleInputChange("venerealDisease", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Venereal Disease</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.skinAllergy}
                          onChange={(e) => handleInputChange("skinAllergy", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Skin allergy</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.skinAllergy2}
                          onChange={(e) => handleInputChange("skinAllergy2", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">skin allergy</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.varicoseVein}
                          onChange={(e) => handleInputChange("varicoseVein", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">varicose vein</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.bloodPressure}
                          onChange={(e) => handleInputChange("bloodPressure", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Blood Pressure</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.diabetes}
                          onChange={(e) => handleInputChange("diabetes", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Diabetes</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.acidity}
                          onChange={(e) => handleInputChange("acidity", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">ACIDITY</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pneumonia}
                          onChange={(e) => handleInputChange("pneumonia", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">PNEUMONIA</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.corticosteroidTreatment}
                          onChange={(e) => handleInputChange("corticosteroidTreatment", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Corticosteroid treatment</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.diabetic}
                          onChange={(e) => handleInputChange("diabetic", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Diabetic</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.jaundice}
                          onChange={(e) => handleInputChange("jaundice", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Jaundice</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.epilepsy}
                          onChange={(e) => handleInputChange("epilepsy", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Epilepsy</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.paralysis}
                          onChange={(e) => handleInputChange("paralysis", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">PARALYSIS</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cardiacDiseases}
                          onChange={(e) => handleInputChange("cardiacDiseases", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Cardiac Diseases</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.autism}
                          onChange={(e) => handleInputChange("autism", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Autism</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.thyroidProblem2}
                          onChange={(e) => handleInputChange("thyroidProblem2", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">THYROID PROBLEM</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.liverDisease}
                          onChange={(e) => handleInputChange("liverDisease", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Liver Disease</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hepatitis}
                          onChange={(e) => handleInputChange("hepatitis", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Hepatitis</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.slipDisc}
                          onChange={(e) => handleInputChange("slipDisc", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">SLIP DISC</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hiv}
                          onChange={(e) => handleInputChange("hiv", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">HIV</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.takesEcosprin}
                          onChange={(e) => handleInputChange("takesEcosprin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">takes ecosprin</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tb2}
                          onChange={(e) => handleInputChange("tb2", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">TB</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.kidneyDisease}
                          onChange={(e) => handleInputChange("kidneyDisease", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Kidney Disease</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.herpes}
                          onChange={(e) => handleInputChange("herpes", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Herpes</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.vertigo}
                          onChange={(e) => handleInputChange("vertigo", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">VERTIGO</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.trigeminalNeuralgia}
                          onChange={(e) => handleInputChange("trigeminalNeuralgia", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">TRIGEMINAL NEURALGIA</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tabMercazol5mg}
                          onChange={(e) => handleInputChange("tabMercazol5mg", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">tab mercazol 5mg</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.typhoid}
                          onChange={(e) => handleInputChange("typhoid", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Typhoid</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.psychiatricTratement}
                          onChange={(e) => handleInputChange("psychiatricTratement", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Psychiatric Tratement</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rheumaticFever}
                          onChange={(e) => handleInputChange("rheumaticFever", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Rhematic Fever</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.psoriasis}
                          onChange={(e) => handleInputChange("psoriasis", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">PSORIASIS</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.bellsPalsy}
                          onChange={(e) => handleInputChange("bellsPalsy", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">BELLS PALSY</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.miBeforeTaking}
                          onChange={(e) => handleInputChange("miBeforeTaking", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">h/o MI before 3 yr taking aspirin and follow up is coumtinue with cardiac surgen</span>
                      </label>
                    </div>
                  </div>

                  {/* Woman Section - Only show if gender is Female */}
                  {formData.gender === "Female" && (
                    <div className="border-t pt-6">
                      <Label className="text-base font-semibold mb-4 block">Woman</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Are you Pregnant</Label>
                          <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="isPregnant"
                                value="yes"
                                checked={formData.isPregnant === true}
                                onChange={() => handleInputChange("isPregnant", true)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="isPregnant"
                                value="no"
                                checked={formData.isPregnant === false}
                                onChange={() => handleInputChange("isPregnant", false)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                        {formData.isPregnant && (
                          <div>
                            <Label htmlFor="dueDate">(If Yes, your due date?)</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={formData.dueDate}
                              onChange={(e) => handleInputChange("dueDate", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Habits Section */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-4 block">Habits</Label>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Pan Masala Chewing</Label>
                          <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="panMasalaChewing"
                                value="yes"
                                checked={formData.panMasalaChewing === true}
                                onChange={() => handleInputChange("panMasalaChewing", true)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="panMasalaChewing"
                                value="no"
                                checked={formData.panMasalaChewing === false}
                                onChange={() => handleInputChange("panMasalaChewing", false)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Pan Chewing(Tobacco)</Label>
                          <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="panChewingTobacco"
                                value="yes"
                                checked={formData.panChewingTobacco === true}
                                onChange={() => handleInputChange("panChewingTobacco", true)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="panChewingTobacco"
                                value="no"
                                checked={formData.panChewingTobacco === false}
                                onChange={() => handleInputChange("panChewingTobacco", false)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Smoking</Label>
                          <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="smoking"
                                value="yes"
                                checked={formData.smoking === true}
                                onChange={() => handleInputChange("smoking", true)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="smoking"
                                value="no"
                                checked={formData.smoking === false}
                                onChange={() => handleInputChange("smoking", false)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                        {formData.smoking && (
                          <div>
                            <Label htmlFor="cigarettesPerDay">if yes, How many cigrattes in day</Label>
                            <Input
                              id="cigarettesPerDay"
                              type="number"
                              placeholder="Enter number"
                              value={formData.cigarettesPerDay}
                              onChange={(e) => handleInputChange("cigarettesPerDay", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="medicineList">List of Medicine you are taking currently, if any</Label>
                        <Input
                          id="medicineList"
                          placeholder="Enter List of Medicine."
                          value={formData.medicineList}
                          onChange={(e) => handleInputChange("medicineList", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Allergies Section */}
                  <div className="border-t pt-6">
                    <Label className="text-base font-semibold mb-4 block">Are you allergic to any of the following</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.penicillin}
                          onChange={(e) => handleInputChange("penicillin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Penicillin</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.aspirin}
                          onChange={(e) => handleInputChange("aspirin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Aspirin</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.iodeine}
                          onChange={(e) => handleInputChange("iodeine", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Iodeine</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.local}
                          onChange={(e) => handleInputChange("local", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Local</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.anaesthtic}
                          onChange={(e) => handleInputChange("anaesthtic", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Anaesthtic</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ibuprofen}
                          onChange={(e) => handleInputChange("ibuprofen", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Ibuprofen</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sulfa}
                          onChange={(e) => handleInputChange("sulfa", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Sulfa</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.combiflam}
                          onChange={(e) => handleInputChange("combiflam", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Combiflam</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.highCloseProblem}
                          onChange={(e) => handleInputChange("highCloseProblem", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">High close problem</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ecospirin}
                          onChange={(e) => handleInputChange("ecospirin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">ECOSPIRIN</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.paracetemol}
                          onChange={(e) => handleInputChange("paracetemol", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">PARACETEMOL</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.eggAllergy}
                          onChange={(e) => handleInputChange("eggAllergy", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">EGG ALLERGY</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.none}
                          onChange={(e) => handleInputChange("none", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">none</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dustSmoke}
                          onChange={(e) => handleInputChange("dustSmoke", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Dust & Smoke</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ceftriazone}
                          onChange={(e) => handleInputChange("ceftriazone", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Ceftriazone</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ciprofloxacin}
                          onChange={(e) => handleInputChange("ciprofloxacin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Ciprofloxacin</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amox}
                          onChange={(e) => handleInputChange("amox", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">amox</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.doxycycline}
                          onChange={(e) => handleInputChange("doxycycline", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">doxycycline</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.diclofenac}
                          onChange={(e) => handleInputChange("diclofenac", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">diclofenac</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.injAmpicillin}
                          onChange={(e) => handleInputChange("injAmpicillin", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">inj. ampicillin</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.injTrimadole}
                          onChange={(e) => handleInputChange("injTrimadole", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">inj. trimadole</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.no}
                          onChange={(e) => handleInputChange("no", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">no</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sulfa2}
                          onChange={(e) => handleInputChange("sulfa2", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">sulfa</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.nil}
                          onChange={(e) => handleInputChange("nil", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">nil</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sulfide}
                          onChange={(e) => handleInputChange("sulfide", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">sulfide</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.kidneyStoneThyroid}
                          onChange={(e) => handleInputChange("kidneyStoneThyroid", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">KIDNEY STONE, THYROID PROBLEM</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.catract}
                          onChange={(e) => handleInputChange("catract", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">CATRACT</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.thyronorm120mg}
                          onChange={(e) => handleInputChange("thyronorm120mg", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">thyronorm 120 mg</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.mox}
                          onChange={(e) => handleInputChange("mox", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">MOX</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.etoxiconilCox2}
                          onChange={(e) => handleInputChange("etoxiconilCox2", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">ETOXICONIL AND COX2 INHIBITOR</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Dental Information Tab */}
              {activeTab === "dental" && (
                <div className="space-y-6">
                  {/* Complaint */}
                  <div>
                    <Label htmlFor="complaint">
                      What is your complaint? <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="complaint"
                      placeholder="Enter your complaint"
                      value={formData.complaint}
                      onChange={(e) => handleInputChange("complaint", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Dental Treatment List */}
                  <div>
                    <Label htmlFor="dentalTreatmentList">List any dental treatment done in the one year.</Label>
                    <Input
                      id="dentalTreatmentList"
                      placeholder="Enter List any dental treatment."
                      value={formData.dentalTreatmentList}
                      onChange={(e) => handleInputChange("dentalTreatmentList", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Tooth Number */}
                  <div>
                    <Label htmlFor="toothNo">Tooth No:</Label>
                    <Input
                      id="toothNo"
                      placeholder="Enter tooth number"
                      value={formData.toothNo}
                      onChange={(e) => handleInputChange("toothNo", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Consent Statement */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="consentStatement"
                      checked={formData.consentStatement}
                      onChange={(e) => handleInputChange("consentStatement", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="consentStatement" className="cursor-pointer">
                      Consent Statement
                    </Label>
                  </div>

                  {/* Consent Image Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <Label htmlFor="consentImage">Consent Image</Label>
                      <div className="flex gap-2 items-center mt-1">
                        <input
                          type="file"
                          id="consentImage"
                          accept="image/*"
                          onChange={handleConsentImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="consentImage"
                          className="px-4 py-2 border border-gray-300 dark:border-[#635985]/40 rounded-md cursor-pointer hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#443C68] text-sm"
                        >
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500 dark:text-white/60">
                          {formData.consentImage ? formData.consentImage.name : "No file chosen"}
                        </span>
                        <Button
                          type="button"
                          className="bg-teal-600 hover:bg-teal-700 ml-auto"
                          onClick={() => {
                            if (formData.consentImage) {
                              // TODO: Implement actual image upload to server
                            }
                          }}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-32 h-32 border border-gray-300 dark:border-[#635985]/40 rounded-md overflow-hidden bg-gray-50 dark:bg-[#18122B] flex items-center justify-center">
                        {consentImagePreview ? (
                          <img src={consentImagePreview} alt="Consent Image" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-2">
                            <div className="text-gray-400 text-xs">SORRY, NO IMAGE AVAILABLE</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Conditional based on active tab */}
              <div className="flex justify-center gap-4 mt-8">
                {activeTab === "personal" && (
                  <Button
                    type="button"
                    onClick={handleNextFromPersonal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next
                  </Button>
                )}

                {activeTab === "medical" && (
                  <Button
                    type="button"
                    onClick={handleNextFromMedical}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next
                  </Button>
                )}

                {activeTab === "dental" && (
                  <>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8">
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="bg-primary hover:bg-primary text-white px-8"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PatientEditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#18122B] flex items-center justify-center">
        <div className="text-gray-600 dark:text-white/60">Loading patient data...</div>
      </div>
    }>
      <PatientEditContent />
    </Suspense>
  );
}
