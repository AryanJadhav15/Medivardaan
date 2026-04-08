"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { patientService } from "@/api/patient.service";
import { transformPatientFormDataToAPI } from "@/utils/patientTransformers";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye } from "lucide-react";

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPatientId = searchParams ? searchParams.get("patientId") : null;
  const mode = searchParams ? searchParams.get("mode") : "create";
  const isViewMode = mode === "view";

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch Patient Data for Edit Mode

  useEffect(() => {
    if (initialPatientId) {
      setIsEditMode(true);
      fetchPatientData(initialPatientId);
    }
  }, [initialPatientId]);

  const fetchPatientData = async (id) => {
    try {
      setLoading(true);
      const data = await patientService.getPatientById(id);
      if (data) {
        setFormData((prev) => ({
          ...prev,
          // Personal Information
          clinicName: data.clinicName || data.ClinicName || prev.clinicName,
          casePaperNo: data.patientCode || data.PatientCode || prev.casePaperNo,
          patientNo: data.patientID || data.id || prev.patientNo,
          date: data.registrationDate
            ? new Date(data.registrationDate).toISOString().split("T")[0]
            : prev.date,
          firstName: data.firstName || data.FirstName || prev.firstName,
          lastName: data.lastName || data.LastName || prev.lastName,
          dateOfBirth: data.dob
            ? new Date(data.dob).toISOString().split("T")[0]
            : prev.dateOfBirth,
          gender: data.gender || prev.gender,
          mobileNo: data.mobile || data.mobileNo || prev.mobileNo,
          email: data.email || prev.email,
          age: data.age || prev.age,

          // Address (Map fields carefully)
          flatHouseNo: data.address || prev.flatHouseNo, // Assuming simplified mapping for now
          areaStreet: data.street || prev.areaStreet,
          landmark: data.landmark || prev.landmark,
          country: data.country || prev.country,
          state: data.state || prev.state,
          city: data.city || prev.city,

          bloodGroup: data.bloodGroup || prev.bloodGroup,
          enquirySource: data.enquirySource || prev.enquirySource,
        }));
      }
    } catch (error) {
      console.error("Error fetching patient for edit:", error);
    } finally {
      setLoading(false);
    }
  };
  // Real clinic list sourced from the backend database (ClinicID → ClinicName)
  const CLINICS = [
    { id: 4,   name: "Andheri West (Juhu)" },
    { id: 86,  name: "Andheri East (takshila)" },
    { id: 45,  name: "Airoli" },
    { id: 122, name: "Badlapur" },
    { id: 1,   name: "Borivali" },
    { id: 16,  name: "Chembur East" },
    { id: 2,   name: "Dadar West" },
    { id: 35,  name: "Dombivali East" },
    { id: 6,   name: "Goregaon East" },
    { id: 98,  name: "Goregaon West" },
    { id: 128, name: "Gurgaon" },
    { id: 44,  name: "Kalyan" },
    { id: 39,  name: "Kharghar" },
    { id: 15,  name: "Mulund" },
    { id: 176, name: "Palava" },
    { id: 113, name: "Pimpri" },
    { id: 33,  name: "Thane West" },
    { id: 18,  name: "Vile-Parle East" },
    { id: 47,  name: "Vasai West" },
    { id: 209, name: "Wadala" },
  ];

  const [formData, setFormData] = useState({
    // Clinic
    clinicID: "",
    clinicName: "",

    // Personal Information
    casePaperNo: "",
    patientNo: "",
    date: new Date().toISOString().split("T")[0],
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

    // Medical History (tab 2)
    medicalHistory: {},

    // Dental Information (tab 3)
    dentalInfo: {},
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (field, value) => {
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
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        setFormData((prev) => ({ ...prev, age: age - 1 }));
      } else {
        setFormData((prev) => ({ ...prev, age }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        patientProfile: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // On personal tab — validate mandatory fields then advance to medical tab
    if (activeTab === "personal") {
      const mandatoryFields = {
        clinicID: "Clinic Name",
        firstName: "First Name",
        lastName: "Last Name",
        flatHouseNo: "Flat, House no., Building, Company, Apartment",
        areaStreet: "Area, Street, Sector, Village",
        enquirySource: "Enquiry Source",
        mobileNo: "Mobile No.",
      };

      const missingFields = [];
      Object.entries(mandatoryFields).forEach(([field, label]) => {
        if (!formData[field] || formData[field].toString().trim() === "") {
          missingFields.push(label);
        }
      });

      if (missingFields.length > 0) {
        alert(
          `Please fill in the following mandatory fields:\n- ${missingFields.join("\n- ")}`,
        );
        return;
      }

      if (formData.mobileNo.length < 10) {
        alert("Please enter a valid 10-digit mobile number");
        return;
      }

      setActiveTab("medical");
      return;
    }

    // On medical tab — advance to dental tab
    if (activeTab === "medical") {
      setActiveTab("dental");
      return;
    }

    // On dental tab — submit to API
    try {
      setLoading(true);
      const apiPayload = transformPatientFormDataToAPI(formData);

      console.log("Submitting Patient Data:", apiPayload);

      const response = await patientService.upsertPatient(apiPayload);

      console.log("Upsert Patient Response:", response);

      // --- MOCK PERSISTENCE START ---
      // Since the backend demo environment does not actually persist new records,
      // we save the new patient locally to display them in the Patients List
      try {
        const existingData = localStorage.getItem('demo_new_patients');
        const demoPatients = existingData ? JSON.parse(existingData) : [];
        
        const newPatient = {
          ...apiPayload,
          patientID: Math.floor(Math.random() * 10000) + 100000, // Generate fake ID
          createdDate: new Date().toISOString(),
          // Ensure casing matches what the table expects
          firstName: apiPayload.FirstName,
          lastName: apiPayload.LastName,
          mobile: apiPayload.MobileNo,
          email: apiPayload.Email,
          age: apiPayload.Age,
          gender: apiPayload.Gender,
          cityName: apiPayload.City,
        };
        
        demoPatients.unshift(newPatient); // Add to top
        localStorage.setItem('demo_new_patients', JSON.stringify(demoPatients));
      } catch (storageErr) {
        console.error("Failed to save mock patient locally:", storageErr);
      }
      // --- MOCK PERSISTENCE END ---

      alert(
        isEditMode
          ? "Patient details updated successfully!"
          : "Patient registered successfully!"
      );
      router.push("/patient/all-patient-list");
    } catch (error) {
      console.error("Registration Error:", error);
      const errMsg =
        error?.response?.data?.details?.errors
          ? JSON.stringify(error?.response?.data?.details?.errors)
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "An unexpected error occurred.";
      alert(`Failed to ${isEditMode ? "update" : "register"} patient: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "medical", label: "Medical History" },
    { id: "dental", label: "Dental Information" },
  ];

  if (isViewMode) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-[#443C68]/50">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-medivardaan-purple/20">
            <Eye className="w-5 h-5 text-primary dark:text-medivardaan-purple" />
          </div>
          <h2 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
            VIEW PATIENT DETAILS
          </h2>
        </div>

        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-gray-500 dark:text-white/50">
                    Patient No:
                  </div>
                  <div className="font-medium">{formData.patientNo || "-"}</div>

                  <div className="text-gray-500 dark:text-white/50">
                    Full Name:
                  </div>
                  <div className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    Age / Gender:
                  </div>
                  <div className="font-medium capitalize">
                    {formData.age || "-"} {formData.age ? "Y" : ""} /{" "}
                    {formData.gender || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    Date of Birth:
                  </div>
                  <div className="font-medium">
                    {formData.dateOfBirth || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    Blood Group:
                  </div>
                  <div className="font-medium">
                    {formData.bloodGroup || "-"}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary border-b pb-2">
                  Contact Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-gray-500 dark:text-white/50">
                    Mobile No:
                  </div>
                  <div className="font-medium">{formData.mobileNo || "-"}</div>

                  <div className="text-gray-500 dark:text-white/50">
                    Telephone No:
                  </div>
                  <div className="font-medium">
                    {formData.telephoneNo || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">Email:</div>
                  <div className="font-medium">{formData.email || "-"}</div>

                  <div className="text-gray-500 dark:text-white/50">
                    Address:
                  </div>
                  <div className="font-medium">
                    {formData.flatHouseNo ? `${formData.flatHouseNo}, ` : ""}
                    {formData.areaStreet || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    City/State:
                  </div>
                  <div className="font-medium">
                    {formData.city || "-"}, {formData.state || "-"}
                  </div>
                </div>
              </div>

              {/* Clinical Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-primary border-b pb-2">
                  Clinical Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-gray-500 dark:text-white/50">
                    Clinic Name:
                  </div>
                  <div className="font-medium text-primary">
                    {formData.clinicName || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    Case Paper No:
                  </div>
                  <div className="font-medium">
                    {formData.casePaperNo || "-"}
                  </div>

                  <div className="text-gray-500 dark:text-white/50">
                    Registration Date:
                  </div>
                  <div className="font-medium">{formData.date || "-"}</div>

                  <div className="text-gray-500 dark:text-white/50">
                    Enquiry Source:
                  </div>
                  <div className="font-medium">
                    {formData.enquirySource || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 pt-6 border-t">
              <Button
                onClick={() => router.push("/patient/all-patient-list")}
                className="bg-gray-600 hover:bg-gray-700 text-white min-w-[150px]"
              >
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Clinic Name */}
            <div className="mb-6">
              <Label htmlFor="clinicName" className="text-sm font-medium">
                Clinic Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.clinicID ? String(formData.clinicID) : ""}
                onValueChange={(value) => {
                  const clinic = CLINICS.find((c) => c.id === parseInt(value));
                  if (clinic) {
                    setFormData((prev) => ({
                      ...prev,
                      clinicID: clinic.id,
                      clinicName: clinic.name,
                    }));
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Clinic" />
                </SelectTrigger>
                <SelectContent>
                  {CLINICS.map((clinic) => (
                    <SelectItem key={clinic.id} value={String(clinic.id)}>
                      {clinic.name}
                    </SelectItem>
                  ))}
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
                        ? "bg-[#0f7396] text-white"
                        : "bg-gray-100 dark:bg-[#393053] text-gray-700 dark:text-white/75 hover:bg-gray-200 dark:hover:bg-[#443C68]"
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
                    onChange={(e) =>
                      handleInputChange("casePaperNo", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleInputChange("patientNo", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="mt-1 bg-gray-50 dark:bg-[#18122B]"
                      readOnly
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
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
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
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
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
                      Flat, House no., Building, Company, Apartment{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="flatHouseNo"
                      value={formData.flatHouseNo}
                      onChange={(e) =>
                        handleInputChange("flatHouseNo", e.target.value)
                      }
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="areaStreet">
                      Area, Street, Sector, Village{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="areaStreet"
                      value={formData.areaStreet}
                      onChange={(e) =>
                        handleInputChange("areaStreet", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("landmark", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
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
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        handleInputChange("city", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Nagpur">Nagpur</SelectItem>
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
                      onChange={(e) =>
                        handleInputChange("bloodGroup", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="enquirySource">
                      Enquiry Source <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.enquirySource}
                      onValueChange={(value) =>
                        handleInputChange("enquirySource", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Google">Google</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Walk-in">Walk-in</SelectItem>
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
                      onChange={(e) =>
                        handleInputChange("mobileNo", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("telephoneNo", e.target.value)
                      }
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
                        className="px-4 py-2 border border-gray-300 dark:border-[#443C68]/50 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#393053] dark:bg-[#18122B] text-sm"
                      >
                        Choose File
                      </label>
                      <span className="text-sm text-gray-500 dark:text-white/50">
                        {formData.patientProfile
                          ? formData.patientProfile.name
                          : "No file chosen"}
                      </span>
                      <Button
                        type="button"
                        className="bg-[#0f7396] hover:bg-[#0b5c7a] ml-auto"
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
                    <div className="w-32 h-32 border border-gray-300 dark:border-[#443C68]/50 rounded-md overflow-hidden bg-gray-50 dark:bg-[#18122B] flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Patient Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-gray-400 text-xs">
                            SORRY, NO IMAGE AVAILABLE
                          </div>
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
                <div className="text-center py-12 text-gray-500 dark:text-white/50">
                  Medical History form fields will be added here
                </div>
              </div>
            )}

            {/* Dental Information Tab */}
            {activeTab === "dental" && (
              <div className="space-y-6">
                <div className="text-center py-12 text-gray-500 dark:text-white/50">
                  Dental Information form fields will be added here
                </div>
              </div>
            )}

            {/* Navigation / Submit Button */}
            <div className="flex justify-between mt-8">
              {/* Back button — shown on medical and dental tabs */}
              {activeTab !== "personal" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="px-8"
                  onClick={() =>
                    setActiveTab(activeTab === "dental" ? "medical" : "personal")
                  }
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0f7396] hover:bg-[#0b5c7a] px-8 min-w-[160px]"
              >
                {loading
                  ? "Saving..."
                  : activeTab === "dental"
                  ? isEditMode
                    ? "Update Patient"
                    : "Register Patient"
                  : "Next →"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
