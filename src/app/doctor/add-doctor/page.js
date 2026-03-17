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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { addDoctor } from "@/api/doctor";
import { transformFormDataToAPI } from "@/utils/doctorTransformers";

export default function AddDoctorPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("personal");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Clinic & Doctor Type
        clinicName: "",
        doctorType: "full-time",
        date: new Date().toISOString().split("T")[0],

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
        if (
            formData.currentEducation.degree &&
            formData.currentEducation.board
        ) {
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

    const uploadFile = async (file) => {
        if (!file) return null;
        const uploadData = new FormData();
        uploadData.append("file", file);
        try {
            const res = await axios.post("/api/upload", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.url;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const handleSubmit = async () => {
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
            indemnityPolicyNo: "Indemnity Policy No.",
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validate mobile number format
        if (formData.mobileNo1.length < 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        setLoading(true);
        try {
            // 1. Upload Files
            const profileUrl = await uploadFile(formData.profilePhoto);
            const adharUrl = await uploadFile(formData.adharCardImage);
            const panUrl = await uploadFile(formData.panCardImage);
            const regUrl = await uploadFile(formData.certificateImage);
            const indemnityUrl = await uploadFile(
                formData.indemnityPolicyImage,
            );

            // Education Uploads processing
            let deg1Url = null;
            let deg2Url = null;
            let basicDegree = formData.currentEducation.degree;

            // Prioritize education list
            if (formData.educationList.length > 0) {
                const edu1 = formData.educationList[0];
                deg1Url = await uploadFile(edu1.upload);
                basicDegree = edu1.degree;

                if (formData.educationList.length > 1) {
                    const edu2 = formData.educationList[1];
                    deg2Url = await uploadFile(edu2.upload);
                }
            } else if (formData.currentEducation.degree) {
                // Fallback if not added to list but typed in
                deg1Url = await uploadFile(formData.currentEducation.upload);
            }

            // 2. Prepare Payload Data
            const dataForTransformer = {
                ...formData,
                profileImageUrl: profileUrl,
                adharCardImageUrl: adharUrl,
                panCardImageUrl: panUrl,
                registrationImageUrl: regUrl,
                identityPolicyImageUrl: indemnityUrl,
                degreeUpload1: deg1Url,
                degreeUpload2: deg2Url,
                currentEducation: {
                    ...formData.currentEducation,
                    degree: basicDegree,
                },
            };

            const apiPayload = transformFormDataToAPI(dataForTransformer);
            console.log("Source FormData:", formData);
            console.log("Transformed API Payload:", apiPayload);

            // 3. Call API
            await addDoctor(apiPayload);

            alert("Doctor added successfully!");
            router.push("/doctor/doctor-registration");
        } catch (error) {
            console.error("Error adding doctor:", error);
            alert(
                "Failed to add doctor. Please check the network tab for details.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-6 space-y-6 bg-white dark:bg-[#18122B] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-primary">DOCTOR</h1>
            </div>

            {/* Clinic Name Selection */}
            <Card className="border-gray-200 dark:border-[#443C68]/50">
                <CardContent className="p-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="clinicName"
                            className="text-sm font-medium"
                        >
                            Clinic Name <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.clinicName}
                            onValueChange={(value) =>
                                handleInputChange("clinicName", value)
                            }
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
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card className="border-gray-200 dark:border-[#443C68]/50">
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
                    <TabsContent value="personal">
                        <CardContent className="p-6 space-y-6">
                            {/* Doctor Type and Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="doctorType"
                                        className="text-sm font-medium"
                                    >
                                        Doctor Type
                                    </Label>
                                    <Select
                                        value={formData.doctorType}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "doctorType",
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">
                                                Full-Time Consultant
                                            </SelectItem>
                                            <SelectItem value="part-time">
                                                Part-Time Consultant
                                            </SelectItem>
                                            <SelectItem value="visiting">
                                                Visiting Consultant
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date"
                                        className="text-sm font-medium"
                                    >
                                        Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "date",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                    />
                                </div>
                            </div>

                            {/* Title, First Name, Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-medium"
                                    >
                                        Title
                                    </Label>
                                    <Select
                                        value={formData.title}
                                        onValueChange={(value) =>
                                            handleInputChange("title", value)
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dr.">
                                                Dr.
                                            </SelectItem>
                                            <SelectItem value="Prof.">
                                                Prof.
                                            </SelectItem>
                                            <SelectItem value="Mr.">
                                                Mr.
                                            </SelectItem>
                                            <SelectItem value="Ms.">
                                                Ms.
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="firstName"
                                        className="text-sm font-medium"
                                    >
                                        First Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "firstName",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="lastName"
                                        className="text-sm font-medium"
                                    >
                                        Last Name{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "lastName",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth and Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="dateOfBirth"
                                        className="text-sm font-medium"
                                    >
                                        Date Of Birth
                                    </Label>
                                    <Input
                                        type="date"
                                        id="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "dateOfBirth",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Gender
                                    </Label>
                                    <RadioGroup
                                        value={formData.gender}
                                        onValueChange={(value) =>
                                            handleInputChange("gender", value)
                                        }
                                        className="flex gap-6 mt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="male"
                                                id="male"
                                            />
                                            <Label
                                                htmlFor="male"
                                                className="font-normal cursor-pointer"
                                            >
                                                Male
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="female"
                                                id="female"
                                            />
                                            <Label
                                                htmlFor="female"
                                                className="font-normal cursor-pointer"
                                            >
                                                Female
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            {/* Address Line 1 and 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="addressLine1"
                                        className="text-sm font-medium"
                                    >
                                        Address Line 1
                                    </Label>
                                    <Textarea
                                        id="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressLine1",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50 min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="addressLine2"
                                        className="text-sm font-medium"
                                    >
                                        Address Line 2
                                    </Label>
                                    <Textarea
                                        id="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressLine2",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50 min-h-[80px]"
                                    />
                                </div>
                            </div>

                            {/* Country and State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="country"
                                        className="text-sm font-medium"
                                    >
                                        Country
                                    </Label>
                                    <Select
                                        value={formData.country}
                                        onValueChange={(value) =>
                                            handleInputChange("country", value)
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="India">
                                                India
                                            </SelectItem>
                                            <SelectItem value="USA">
                                                USA
                                            </SelectItem>
                                            <SelectItem value="UK">
                                                UK
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="state"
                                        className="text-sm font-medium"
                                    >
                                        State
                                    </Label>
                                    <Select
                                        value={formData.state}
                                        onValueChange={(value) =>
                                            handleInputChange("state", value)
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Maharashtra">
                                                Maharashtra
                                            </SelectItem>
                                            <SelectItem value="Gujarat">
                                                Gujarat
                                            </SelectItem>
                                            <SelectItem value="Karnataka">
                                                Karnataka
                                            </SelectItem>
                                            <SelectItem value="Delhi">
                                                Delhi
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* City and Area Pin */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="city"
                                        className="text-sm font-medium"
                                    >
                                        City
                                    </Label>
                                    <Select
                                        value={formData.city}
                                        onValueChange={(value) =>
                                            handleInputChange("city", value)
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Mumbai">
                                                Mumbai
                                            </SelectItem>
                                            <SelectItem value="Pune">
                                                Pune
                                            </SelectItem>
                                            <SelectItem value="Nashik">
                                                Nashik
                                            </SelectItem>
                                            <SelectItem value="Panvel">
                                                Panvel
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="areaPin"
                                        className="text-sm font-medium"
                                    >
                                        Area Pin
                                    </Label>
                                    <Input
                                        id="areaPin"
                                        value={formData.areaPin}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "areaPin",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter PIN code"
                                    />
                                </div>
                            </div>

                            {/* Mobile Numbers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="mobileNo1"
                                        className="text-sm font-medium"
                                    >
                                        Mobile No 1.{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="mobileNo1"
                                        value={formData.mobileNo1}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "mobileNo1",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter mobile number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="mobileNo2"
                                        className="text-sm font-medium"
                                    >
                                        Mobile No 2.
                                    </Label>
                                    <Input
                                        id="mobileNo2"
                                        value={formData.mobileNo2}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "mobileNo2",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                            </div>

                            {/* Email and Blood Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="bloodGroup"
                                        className="text-sm font-medium"
                                    >
                                        Blood Group
                                    </Label>
                                    <Input
                                        id="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "bloodGroup",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter blood group"
                                    />
                                </div>
                            </div>

                            {/* In Time and Out Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="inTime"
                                        className="text-sm font-medium"
                                    >
                                        In Time (HH:MM){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="time"
                                        id="inTime"
                                        value={formData.inTime}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "inTime",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="outTime"
                                        className="text-sm font-medium"
                                    >
                                        Out Time (HH:MM){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="time"
                                        id="outTime"
                                        value={formData.outTime}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "outTime",
                                                e.target.value,
                                            )
                                        }
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
                        </CardContent>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education">
                        <CardContent className="p-6 space-y-6">
                            {/* Degree, Board, and Upload */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="degree"
                                        className="text-sm font-medium"
                                    >
                                        Degree
                                    </Label>
                                    <Select
                                        value={formData.currentEducation.degree}
                                        onValueChange={(value) =>
                                            handleEducationChange(
                                                "degree",
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50">
                                            <SelectValue placeholder="BDS" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BDS">
                                                BDS
                                            </SelectItem>
                                            <SelectItem value="MDS">
                                                MDS
                                            </SelectItem>
                                            <SelectItem value="MBBS">
                                                MBBS
                                            </SelectItem>
                                            <SelectItem value="MD">
                                                MD
                                            </SelectItem>
                                            <SelectItem value="DNB">
                                                DNB
                                            </SelectItem>
                                            <SelectItem value="BPT">
                                                BPT
                                            </SelectItem>
                                            <SelectItem value="MPT">
                                                MPT
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="board"
                                        className="text-sm font-medium"
                                    >
                                        Board
                                    </Label>
                                    <Input
                                        id="board"
                                        value={formData.currentEducation.board}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                "board",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Maharashtra"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="upload"
                                        className="text-sm font-medium"
                                    >
                                        Upload
                                    </Label>
                                    <Input
                                        type="file"
                                        id="upload"
                                        onChange={handleFileUpload}
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </div>

                                <div className="space-y-2">
                                    {formData.currentEducation.upload && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.currentEducation
                                                        .upload,
                                                )}
                                                alt="Upload preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add Button
              <div>
                <Button
                  onClick={handleAddEducation}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
              </div> */}

                            {/* Speciality Section */}
                            <div className="space-y-4 pt-6">
                                <h3 className="text-lg font-semibold">
                                    Speciality
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="asthesticDentist"
                                            checked={
                                                formData.specialities
                                                    .asthesticDentist
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "asthesticDentist",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="asthesticDentist"
                                            className="font-normal cursor-pointer"
                                        >
                                            Asthestic dentist
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="generalDentist"
                                            checked={
                                                formData.specialities
                                                    .generalDentist
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "generalDentist",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="generalDentist"
                                            className="font-normal cursor-pointer"
                                        >
                                            General dentist
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="orthodontics"
                                            checked={
                                                formData.specialities
                                                    .orthodontics
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "orthodontics",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="orthodontics"
                                            className="font-normal cursor-pointer"
                                        >
                                            Orthodontics and Dentofacial
                                            Orthopedic
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="periodontics"
                                            checked={
                                                formData.specialities
                                                    .periodontics
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "periodontics",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="periodontics"
                                            className="font-normal cursor-pointer"
                                        >
                                            Periodontics
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="conservativeDentist"
                                            checked={
                                                formData.specialities
                                                    .conservativeDentist
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "conservativeDentist",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="conservativeDentist"
                                            className="font-normal cursor-pointer"
                                        >
                                            Conservative dentist
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="oralMaxillofacial"
                                            checked={
                                                formData.specialities
                                                    .oralMaxillofacial
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "oralMaxillofacial",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="oralMaxillofacial"
                                            className="font-normal cursor-pointer"
                                        >
                                            Oral and Maxillofacial surgeon
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pedodontics"
                                            checked={
                                                formData.specialities
                                                    .pedodontics
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "pedodontics",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="pedodontics"
                                            className="font-normal cursor-pointer"
                                        >
                                            pedodontics
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="prosthodontics"
                                            checked={
                                                formData.specialities
                                                    .prosthodontics
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "prosthodontics",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="prosthodontics"
                                            className="font-normal cursor-pointer"
                                        >
                                            prosthodontics
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="endodontics"
                                            checked={
                                                formData.specialities
                                                    .endodontics
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "endodontics",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="endodontics"
                                            className="font-normal cursor-pointer"
                                        >
                                            Endodontics
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="oralPathology"
                                            checked={
                                                formData.specialities
                                                    .oralPathology
                                            }
                                            onChange={(e) =>
                                                handleSpecialityChange(
                                                    "oralPathology",
                                                    e.target.checked,
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-[#443C68]/50"
                                        />
                                        <Label
                                            htmlFor="oralPathology"
                                            className="font-normal cursor-pointer"
                                        >
                                            Oral Pathology
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-end pt-6">
                                <Button
                                    onClick={handleNext}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents">
                        <CardContent className="p-6 space-y-6">
                            {/* Profile Photo */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Profile Photo
                                    </Label>
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDocumentUpload(
                                                "profilePhoto",
                                                e.target.files[0],
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept="image/*"
                                    />
                                </div>
                                <div>
                                    {formData.profilePhoto && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.profilePhoto,
                                                )}
                                                alt="Profile"
                                                className="max-w-full max-h-full object-contain rounded"
                                            />
                                        </div>
                                    )}
                                    {!formData.profilePhoto && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-100 dark:bg-[#393053]">
                                            <span className="text-xs text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Adhar Card No */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label
                                        htmlFor="adharCardNo"
                                        className="text-sm font-medium"
                                    >
                                        Adhar Card No. (0000 0000 0000)
                                    </Label>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        id="adharCardNo"
                                        value={formData.adharCardNo}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "adharCardNo",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="0000 0000 0000"
                                        maxLength={14}
                                    />
                                </div>
                            </div>

                            {/* Adhar Card Image */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Adhar Card Image
                                    </Label>
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDocumentUpload(
                                                "adharCardImage",
                                                e.target.files[0],
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                <div>
                                    {formData.adharCardImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.adharCardImage,
                                                )}
                                                alt="Adhar Card"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    {!formData.adharCardImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-100 dark:bg-[#393053]">
                                            <span className="text-xs text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pan Card No */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label
                                        htmlFor="panCardNo"
                                        className="text-sm font-medium"
                                    >
                                        Pan Card No.{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        id="panCardNo"
                                        value={formData.panCardNo}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "panCardNo",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter PAN card number"
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* Pan Card Image */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Pan Card Image
                                    </Label>
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDocumentUpload(
                                                "panCardImage",
                                                e.target.files[0],
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                <div>
                                    {formData.panCardImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.panCardImage,
                                                )}
                                                alt="PAN Card"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    {!formData.panCardImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-100 dark:bg-[#393053]">
                                            <span className="text-xs text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Registration No */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label
                                        htmlFor="registrationNo"
                                        className="text-sm font-medium"
                                    >
                                        Registration No.{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        id="registrationNo"
                                        value={formData.registrationNo}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "registrationNo",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter registration number"
                                    />
                                </div>
                            </div>

                            {/* Certificate Image */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Certificate Image
                                    </Label>
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDocumentUpload(
                                                "certificateImage",
                                                e.target.files[0],
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                <div>
                                    {formData.certificateImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.certificateImage,
                                                )}
                                                alt="Certificate"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    {!formData.certificateImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-100 dark:bg-[#393053]">
                                            <span className="text-xs text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Indemnity Policy No */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label
                                        htmlFor="indemnityPolicyNo"
                                        className="text-sm font-medium"
                                    >
                                        Indemnity Policy No.{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        id="indemnityPolicyNo"
                                        value={formData.indemnityPolicyNo}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "indemnityPolicyNo",
                                                e.target.value,
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        placeholder="Enter indemnity policy number"
                                    />
                                </div>
                            </div>

                            {/* Indemnity Policy No Image */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Indemnity Policy No Image
                                    </Label>
                                </div>
                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            handleDocumentUpload(
                                                "indemnityPolicyImage",
                                                e.target.files[0],
                                            )
                                        }
                                        className="border-gray-300 dark:border-[#443C68]/50"
                                        accept="image/*,.pdf"
                                    />
                                </div>
                                <div>
                                    {formData.indemnityPolicyImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-50 dark:bg-[#393053]">
                                            <img
                                                src={URL.createObjectURL(
                                                    formData.indemnityPolicyImage,
                                                )}
                                                alt="Indemnity Policy"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    {!formData.indemnityPolicyImage && (
                                        <div className="w-24 h-24 border border-gray-300 dark:border-[#635985]/40 rounded flex items-center justify-center bg-gray-100 dark:bg-[#393053]">
                                            <span className="text-xs text-gray-400">
                                                No Image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-center gap-4 pt-6">
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={() =>
                                        router.push(
                                            "/doctor/doctor-registration",
                                        )
                                    }
                                    variant="outline"
                                    className="bg-primary hover:bg-primary text-white border-primary px-8"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
