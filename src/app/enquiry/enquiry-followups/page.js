"use client";

import React, { useState, useEffect } from "react";
import { getLeads } from "@/api/leads";
import { Pagination } from "@/components/Pagination";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Phone,
    MessageSquare,
    Eye,
    Loader2,
    UserPlus,
    RotateCcw,
    Search,
    ClipboardList,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Virtuoso } from "react-virtuoso";
import { PageHeader } from "@/components/shared/PageHeader";

export default function EnquiryFollowupsPage() {
    const router = useRouter();
    const [dateFilterType, setDateFilterType] = useState("enquiryDate");
    const [filters, setFilters] = useState({
        visitorName: "",
        mobileNo: "",
        fromDate: "",
        toDate: "",
    });
    const [followups, setFollowups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Show 10 items per page
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch followups data on component mount
    useEffect(() => {
        fetchFollowups();
    }, []);

    const fetchFollowups = async (pageNumber = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getLeads({
                PageSize: 10,
                PageNumber: pageNumber,
                ...filters,
            });
            console.log("Fetched leads data:", data);

            // Transform API data to followup format
            const transformedData = Array.isArray(data)
                ? data.map((lead, index) => ({
                      srNo: (pageNumber - 1) * 10 + index + 1,
                      visitorName:
                          `${lead.firstName || lead.FirstName || ""} ${lead.lastName || lead.LastName || ""}`.trim(),
                      mobileNo: lead.mobile || lead.PhoneNo1 || "",
                      enquiryDate: formatDate(
                          lead.enquiryDate || lead.LeadDate,
                      ),
                      sourceType:
                          lead.sourceName || getSourceName(lead.LeadSourceID),
                      assignedToDoctor: lead.assignTo || lead.AssignTo || "",
                      assignedToCenter:
                          lead.clinicName || getClinicName(lead.ClinicID),
                      emailId: lead.email || lead.Emailid || "",
                      enquiryFor: lead.leadFor || lead.LeadFor || "",
                      telephoneNo: lead.phoneNo2 || lead.PhoneNo2 || "",
                      followupDate: formatDate(
                          lead.enquiryDate || lead.LeadDate,
                      ),
                      totalFollowups: "0",
                      enquiryType: lead.interestLevel
                          ? getEnquiryType(lead.interestLevel)
                          : "Cold", // Adjust if API returns text status
                      followupsStatus: "",
                      patientStatus:
                          lead.status || lead.PatientStatus || "Co-operative",
                  }))
                : [];

            setFollowups(transformedData);
        } catch (err) {
            console.error("Error fetching followups:", err);
            // Fallback to mock data on error
            const mockFollowups = [
                {
                    srNo: 1,
                    visitorName: "Rahul Gupta",
                    mobileNo: "9876543210",
                    enquiryDate: "01-01-2025",
                    sourceType: "GOOGLE",
                    assignedToDoctor: "Dr. MADHU PAWAR",
                    assignedToCenter: "Panvel",
                    emailId: "rahul@example.com",
                    enquiryFor: "General Checkup",
                    telephoneNo: "-",
                    followupDate: "05-01-2025",
                    totalFollowups: "2",
                    enquiryType: "Hot",
                    followupsStatus: "Pending",
                    patientStatus: "Co-operative",
                },
                {
                    srNo: 2,
                    visitorName: "Sneha Patil",
                    mobileNo: "8765432109",
                    enquiryDate: "02-01-2025",
                    sourceType: "WALK-IN",
                    assignedToDoctor: "Dr. pooja kumari",
                    assignedToCenter: "Mumbai",
                    emailId: "sneha@example.com",
                    enquiryFor: "Dental",
                    telephoneNo: "022-27456789",
                    followupDate: "06-01-2025",
                    totalFollowups: "1",
                    enquiryType: "Warm",
                    followupsStatus: "Call Back",
                    patientStatus: "Interested",
                },
            ];
            console.warn("Using mock data due to API error.");
            setFollowups(mockFollowups);
            // setError(err.message); // Suppress error to show UI
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearch = () => {
        console.log(
            "Search with filters:",
            filters,
            "Date type:",
            dateFilterType,
        );
        fetchFollowups();
    };

    const clearFilters = () => {
        setFilters({
            visitorName: "",
            mobileNo: "",
            fromDate: "",
            toDate: "",
        });
        setDateFilterType("enquiryDate");
        // Optionally fetch immediately or wait for user to click Search
        // The Lead page fetches immediately, let's do that for consistency
        fetchFollowups(1);
    };

    // Helper functions for data transformation
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getSourceName = (sourceID) => {
        const sources = {
            1: "GOOGLE",
            2: "FACEBOOK",
            3: "INSTAGRAM",
            4: "JUSTDIAL",
            5: "REFERENCE",
            6: "WALK-IN",
        };
        return sources[sourceID] || "Unknown";
    };

    const getClinicName = (clinicID) => {
        const clinics = {
            1: "Panvel",
            2: "Pune",
            3: "Mumbai",
            4: "Nashik",
        };
        return clinics[clinicID] || "Unknown";
    };

    const getEnquiryType = (interestLevel) => {
        if (interestLevel >= 8) return "Hot";
        if (interestLevel >= 5) return "Warm";
        return "Cold";
    };

    // Filter followups based on search criteria
    const filteredFollowups = followups.filter((followup) => {
        if (
            filters.visitorName &&
            !followup.visitorName
                .toLowerCase()
                .includes(filters.visitorName.toLowerCase())
        ) {
            return false;
        }
        if (filters.mobileNo && !followup.mobileNo.includes(filters.mobileNo)) {
            return false;
        }
        return true;
    });

    // Pagination Logic (Server-Side)
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredFollowups.slice(indexOfFirstItem, indexOfLastItem);
    const currentItems = filteredFollowups; // Already paged from server
    const totalPages = 10000; // Increased to allow access to all DB records (was limiting to 2000)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchFollowups(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Action handlers
    const handleCall = (followup) => {
        // Store followup data in localStorage for the details page
        localStorage.setItem(
            `followup_${followup.srNo}`,
            JSON.stringify(followup),
        );
        // Navigate to followup details page
        router.push(`/enquiry/followup-details?id=${followup.srNo}`);
    };

    const handleMessage = (followup) => {
        // Redirect to patient edit page in 'add' mode with pre-filled data
        const params = new URLSearchParams({
            mode: "add",
            mobileNo: followup.mobileNo || "",
            firstName: followup.visitorName
                ? followup.visitorName.split(" ")[0]
                : "",
            lastName: followup.visitorName
                ? followup.visitorName.split(" ").slice(1).join(" ")
                : "",
            enquirySource: followup.sourceType || "",
        });
        router.push(`/MIS/patient-edit?${params.toString()}`);
    };

    const handleView = (followup) => {
        console.log("View followup details:", followup);
        alert(
            `Viewing details for ${followup.visitorName}\nMobile: ${followup.mobileNo}\nEnquiry For: ${followup.enquiryFor}`,
        );
    };

    return (
        <div className="w-full p-6 space-y-6 bg-white dark:bg-[#18122B] min-h-screen">
            <PageHeader title="FOLLOWUP DETAILS" icon={ClipboardList} />

            {/* Filter Section - Standardized Layout */}
            <Card className="border-2 border-primary/10 dark:border-[#443C68]/50 shadow-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        {/* Visitor Name */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                                Visitor Name
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search Name"
                                    value={filters.visitorName}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "visitorName",
                                            e.target.value,
                                        )
                                    }
                                    className="pl-9 bg-white dark:bg-[#393053] h-10"
                                />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                                Mobile No
                            </Label>
                            <Input
                                placeholder="Search Mobile"
                                value={filters.mobileNo}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "mobileNo",
                                        e.target.value,
                                    )
                                }
                                className="bg-white dark:bg-[#393053] h-10"
                            />
                        </div>

                        {/* Date Filter Type - Row 2 */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                                Date Type
                            </Label>
                            <RadioGroup
                                value={dateFilterType}
                                onValueChange={setDateFilterType}
                                className="flex gap-4 h-10 items-center"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="enquiryDate"
                                        id="enquiryDate"
                                    />
                                    <Label
                                        htmlFor="enquiryDate"
                                        className="cursor-pointer font-normal"
                                    >
                                        Enquiry
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="followupDate"
                                        id="followupDate"
                                    />
                                    <Label
                                        htmlFor="followupDate"
                                        className="cursor-pointer font-normal"
                                    >
                                        Followup
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* From Date */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                                From Date
                            </Label>
                            <Input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "fromDate",
                                        e.target.value,
                                    )
                                }
                                className="bg-white dark:bg-[#393053] h-10"
                            />
                        </div>

                        {/* To Date */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
                                To Date
                            </Label>
                            <Input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) =>
                                    handleFilterChange("toDate", e.target.value)
                                }
                                className="bg-white dark:bg-[#393053] h-10"
                            />
                        </div>
                    </div>

                    <div className="flex justify-start items-center mt-6 pt-4 border-t border-gray-100 dark:border-[#443C68]/50 gap-3">
                        <Button
                            onClick={handleSearch}
                            className="bg-[#0f7396] dark:bg-medivardaan-purple hover:bg-[#0f7396]/90 dark:hover:bg-medivardaan-purple-dark text-white min-w-[100px] h-10"
                        >
                            <Search className="w-4 h-4 mr-2" /> Search
                        </Button>
                        <Button
                            onClick={clearFilters}
                            variant="outline"
                            className="text-gray-600 dark:text-white/60 h-10"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" /> Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
                <Card className="border-gray-200 dark:border-[#443C68]/50">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-gray-600 dark:text-white/60">
                                Loading followups...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                                Error loading followups
                            </p>
                            <p className="text-gray-600 dark:text-white/60">
                                {error}
                            </p>
                            <Button
                                onClick={fetchFollowups}
                                className="mt-4 bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No Data State */}
            {!isLoading && !error && filteredFollowups.length === 0 && (
                <Card className="border-gray-200 dark:border-[#443C68]/50">
                    <CardContent className="p-8">
                        <div className="text-center text-gray-500 dark:text-white/60">
                            No followups found.{" "}
                            {filters.visitorName ||
                            filters.mobileNo ||
                            filters.source ||
                            filters.receivedBy
                                ? "Try adjusting your filters."
                                : ""}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Followups List */}
            {!isLoading && !error && filteredFollowups.length > 0 && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        {currentItems.map((followup, index) => (
                            <div key={followup.srNo} className="pb-4">
                                <Card className="border-gray-200 dark:border-[#443C68]/50">
                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-1 lg:grid-cols-12">
                                            {/* Sr. No. Column */}
                                            <div className="lg:col-span-1 bg-[#0f7396]/10 dark:bg-[#635985]/20 p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-[#443C68]/50">
                                                <div className="text-center">
                                                    <div className="text-xs text-gray-500 dark:text-white/60 font-semibold mb-1">
                                                        Sr. No.
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {followup.srNo}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Enquiry Details Table */}
                                            <div className="lg:col-span-8 p-4">
                                                <h3 className="text-sm font-semibold text-[#0f7396] dark:text-[#635985] mb-3 bg-[#0f7396]/10 dark:bg-[#635985]/20 px-3 py-2 rounded">
                                                    Enquiry Details
                                                </h3>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053] w-1/4">
                                                                Visitor Name:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3 w-1/4">
                                                                {
                                                                    followup.visitorName
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053] w-1/4">
                                                                Enquiry For:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3 w-1/4">
                                                                {
                                                                    followup.enquiryFor
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Mobile No:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.mobileNo
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Telephone No:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {followup.telephoneNo ||
                                                                    "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Enquiry Date:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.enquiryDate
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Followup Date:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.followupDate
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Source Type:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.sourceType
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Total Followups:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.totalFollowups
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Assigned to
                                                                Doctor:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.assignedToDoctor
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Enquiry Type:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                                                                    {
                                                                        followup.enquiryType
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className="border-b border-gray-200 dark:border-[#443C68]/50">
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Assigned to
                                                                Center:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.assignedToCenter
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Followups Status
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {followup.followupsStatus ||
                                                                    "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Emailid:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {followup.emailId ||
                                                                    "-"}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-gray-700 dark:text-white/75 py-2 px-3 bg-gray-50 dark:bg-[#393053]">
                                                                Patient Status:
                                                            </TableCell>
                                                            <TableCell className="py-2 px-3">
                                                                {
                                                                    followup.patientStatus
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Action Column */}
                                            <div className="lg:col-span-3 bg-gray-50 dark:bg-[#393053] p-4 flex flex-col items-center justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#443C68]/50">
                                                <div className="text-sm font-semibold text-gray-700 dark:text-white/75 mb-2">
                                                    Action
                                                </div>
                                                <div className="flex flex-row lg:flex-col gap-3">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400/50 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:border-blue-400/80"
                                                        onClick={() =>
                                                            handleCall(followup)
                                                        }
                                                        title="Followup Changes"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-gray-500 text-gray-600 hover:bg-gray-100 dark:border-white/20 dark:text-white/70 dark:hover:bg-[#443C68]/60 dark:hover:border-white/40 dark:hover:text-white/90"
                                                        onClick={() =>
                                                            handleMessage(
                                                                followup,
                                                            )
                                                        }
                                                        title="Add Patient"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-[#0f7396] text-[#0f7396] hover:bg-[#0f7396]/10 dark:border-[#635985]/60 dark:text-[#8b7ba8] dark:hover:bg-[#635985]/30 dark:hover:border-[#635985] dark:hover:text-[#b5a8cc]"
                                                        onClick={() =>
                                                            handleView(followup)
                                                        }
                                                        title="View details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
