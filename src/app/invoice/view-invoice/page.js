"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileSpreadsheet, Loader2, Receipt, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomPagination from "@/components/ui/custom-pagination";
import { useInvoices } from "@/hooks/useInvoices";
import { useDoctors } from "@/hooks/useDoctors";
import { useClinics } from "@/hooks/useClinics";

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDisplayDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
};

const normalizePatient = (patient = {}) => {
  const patientId = patient.patientID || patient.PatientID || patient.patientId || patient.id || null;
  const firstName = patient.firstName || patient.fristName || patient.FirstName || "";
  const lastName = patient.lastName || patient.LastName || "";
  return {
    patientId,
    patientName: `${firstName} ${lastName}`.trim() || patient.patientName || patient.PatientName || `Patient #${patientId ?? "N/A"}`,
    mobileNo: patient.mobile || patient.MobileNo || patient.mobileNo || "N/A",
    patientCode: patient.patientCode || patient.PatientCode || (patientId ? `P-${patientId}` : "N/A"),
  };
};

export default function ViewInvoicePage() {
  const [filters, setFilters] = useState({
    clinicName: "all",
    doctorName: "all",
    patientName: "",
    invoiceNo: "",
    fromDate: "",
    toDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    clinicName: "all",
    doctorName: "all",
    patientName: "",
    invoiceNo: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: rawInvoices = [], isLoading, error, refetch } = useInvoices(
    {},
    { queryKey: ["invoices-view"] }
  );
  const { data: doctors = [] } = useDoctors();
  const { data: clinics = [] } = useClinics();
  const patientIds = Array.from(
    new Set(rawInvoices.map((invoice) => invoice.patientId).filter(Boolean))
  );

  const {
    data: patientLookup = {},
    isLoading: loadingPatients,
  } = useQuery({
    queryKey: ["invoice-patient-master", patientIds],
    enabled: patientIds.length > 0,
    queryFn: async () => {
      try {
        const response = await fetch(
          `/api/Patient/GetAllPatients?PageSize=200`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          return {};
        }

        const payload = await response.json();
        const patients = Array.isArray(payload)
          ? payload
          : (payload?.data || payload?.result || []);

        if (!Array.isArray(patients)) {
          return {};
        }

        const patientMap = Object.fromEntries(
          patients.map((patient) => {
            const normalizedPatient = normalizePatient(patient);
            return [String(normalizedPatient.patientId), normalizedPatient];
          })
        );

        const missingIds = patientIds.filter(
          (patientId) => !patientMap[String(patientId)]
        );

        if (missingIds.length === 0) {
          return patientMap;
        }

        const fallbackResults = await Promise.all(
          missingIds.map(async (patientId) => {
            try {
              const patientResponse = await fetch(
                `/api/Patient/GetPatientById?patientId=${patientId}`,
                { cache: "no-store" }
              );

              if (!patientResponse.ok) return null;

              const patient = await patientResponse.json();
              return [String(patientId), normalizePatient(patient)];
            } catch {
              return null;
            }
          })
        );

        fallbackResults.forEach((entry) => {
          if (entry) {
            patientMap[entry[0]] = entry[1];
          }
        });

        return patientMap;
      } catch {
        return {};
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const doctorLookup = new Map(
    doctors.map((doctor) => [
      String(doctor.doctorID || doctor.DoctorID || ""),
      doctor.name || doctor.doctorName || doctor.DoctorName || "",
    ])
  );

  const clinicLookup = new Map(
    clinics.map((clinic) => [
      String(clinic.clinicID || clinic.ClinicID || ""),
      clinic.clinicName || clinic.ClinicName || "",
    ])
  );

  const enrichedInvoices = rawInvoices.map((invoice) => {
    const patientDetails = patientLookup[String(invoice.patientId)] || null;
    return {
      ...invoice,
      clinicName:
        invoice.clinicName ||
        clinicLookup.get(String(invoice.clinicId || "")) ||
        "N/A",
      doctorName:
        doctorLookup.get(String(invoice.doctorId || "")) ||
        (invoice.doctorId ? `Dr. ID ${invoice.doctorId}` : "N/A"),
      patientName:
        invoice.patientName ||
        patientDetails?.patientName ||
        "N/A",
      patientCode:
        invoice.patientCode ||
        patientDetails?.patientCode ||
        (invoice.patientId ? `P-${invoice.patientId}` : "N/A"),
      mobileNo: invoice.mobileNo || patientDetails?.mobileNo || "N/A",
      payDateLabel: formatDisplayDate(invoice.payDate),
    };
  });

  const filteredInvoices = enrichedInvoices.filter((invoice) => {
    const matchClinic =
      appliedFilters.clinicName === "all" ||
      (invoice.clinicName || "")
        .toLowerCase()
        .includes(appliedFilters.clinicName.toLowerCase());

    const matchDoctor =
      appliedFilters.doctorName === "all" ||
      (invoice.doctorName || "")
        .toLowerCase()
        .includes(appliedFilters.doctorName.toLowerCase());

    const matchPatient =
      !appliedFilters.patientName ||
      (invoice.patientName || "")
        .toLowerCase()
        .includes(appliedFilters.patientName.toLowerCase());

    const matchInvoiceNo =
      !appliedFilters.invoiceNo ||
      (invoice.invoiceNo || "")
        .toLowerCase()
        .includes(appliedFilters.invoiceNo.toLowerCase());

    const invoiceDate = invoice.payDate ? new Date(invoice.payDate) : null;
    const normalizedInvoiceDate =
      invoiceDate && !Number.isNaN(invoiceDate.getTime())
        ? new Date(
            invoiceDate.getFullYear(),
            invoiceDate.getMonth(),
            invoiceDate.getDate()
          )
        : null;

    if (appliedFilters.fromDate) {
      if (!normalizedInvoiceDate) return false;
      const fromDate = new Date(appliedFilters.fromDate);
      const normalizedFromDate = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate()
      );
      if (normalizedInvoiceDate < normalizedFromDate) return false;
    }

    if (appliedFilters.toDate) {
      if (!normalizedInvoiceDate) return false;
      const toDate = new Date(appliedFilters.toDate);
      const normalizedToDate = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate()
      );
      if (normalizedInvoiceDate > normalizedToDate) return false;
    }

    return matchClinic && matchDoctor && matchPatient && matchInvoiceNo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    await refetch();
  };

  const handleClear = async () => {
    const resetFilters = {
      clinicName: "all",
      doctorName: "all",
      patientName: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
    await refetch();
  };

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-[#18122B] transition-colors duration-300">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-[#443C68]/50">
        <Receipt className="w-5 h-5 text-medivardaan-teal" />
        <h1 className="text-xl font-bold text-medivardaan-teal uppercase tracking-wide">
          View Invoices
        </h1>
      </div>

      <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                Clinic Name
              </Label>
              <Select
                value={filters.clinicName}
                onValueChange={(value) => handleFilterChange("clinicName", value)}
              >
                <SelectTrigger className="h-10 bg-background border-input">
                  <SelectValue placeholder="All Clinics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clinics</SelectItem>
                  {Array.from(
                    new Map(clinics.map((clinic) => [clinic.clinicName, clinic])).values()
                  ).map((clinic, index) => (
                    <SelectItem
                      key={`clinic-${clinic.clinicID || index}-${clinic.clinicName}`}
                      value={(clinic.clinicName || "").toLowerCase()}
                    >
                      {clinic.clinicName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                Doctor Name
              </Label>
              <Select
                value={filters.doctorName}
                onValueChange={(value) => handleFilterChange("doctorName", value)}
              >
                <SelectTrigger className="h-10 bg-background border-input">
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {Array.from(
                    new Map(doctors.map((doctor) => [doctor.name, doctor])).values()
                  ).map((doctor, index) => (
                    <SelectItem
                      key={`doctor-${doctor.doctorID || index}-${doctor.name}`}
                      value={(doctor.name || "").toLowerCase()}
                    >
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                Patient Name
              </Label>
              <Input
                className="h-10 bg-background border-input"
                placeholder="Search by name..."
                value={filters.patientName}
                onChange={(e) => handleFilterChange("patientName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                Invoice No
              </Label>
              <Input
                className="h-10 bg-background border-input"
                placeholder="Invoice No"
                value={filters.invoiceNo}
                onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="space-y-2 w-full md:w-48">
                <Label className="text-sm font-medium text-foreground/80">
                  From Date
                </Label>
                <Input
                  type="date"
                  className="h-10 bg-background border-input"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                />
              </div>
              <div className="space-y-2 w-full md:w-48">
                <Label className="text-sm font-medium text-foreground/80">
                  To Date
                </Label>
                <Input
                  type="date"
                  className="h-10 bg-background border-input"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button
                onClick={handleSearch}
                className="flex-1 md:flex-none bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white h-10 px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1 md:flex-none border-input h-10 px-6"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <span className="text-sm text-gray-600 dark:text-white/60 font-medium">
              Total Records: {filteredInvoices.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isLoading || loadingPatients ? (
              <div className="flex justify-center items-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <span>Loading invoices...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-20 text-red-500">
                Failed to load invoices.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 dark:border-[#443C68]/50 hover:bg-primary/10 dark:hover:bg-[#393053]">
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Sr. No.</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Invoice No.</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Date</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Clinic</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Doctor</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Pt. Code</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Patient Name</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10">Mobile</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Total</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Paid</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-right">Pending</TableHead>
                    <TableHead className="font-bold text-gray-700 dark:text-white/75 h-10 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((invoice, index) => (
                      <TableRow
                        key={invoice.invoiceID || index}
                        className="border-b border-gray-50 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053]/50 text-xs"
                      >
                        <TableCell className="py-2 text-gray-600 dark:text-white/75">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell className="py-2 font-medium text-gray-700 dark:text-white/90 uppercase">
                          {invoice.invoiceNo}
                        </TableCell>
                        <TableCell className="py-2 text-gray-600 dark:text-white/75">
                          {invoice.payDateLabel}
                        </TableCell>
                        <TableCell className="py-2 text-gray-600 dark:text-white/75">
                          {invoice.clinicName}
                        </TableCell>
                        <TableCell className="py-2 text-gray-600 dark:text-white/75">
                          {invoice.doctorName}
                        </TableCell>
                        <TableCell className="py-2 text-xs font-mono text-gray-500 dark:text-white/50">
                          {invoice.patientCode}
                        </TableCell>
                        <TableCell className="py-2 font-medium text-gray-700 dark:text-white/90">
                          {invoice.patientName}
                        </TableCell>
                        <TableCell className="py-2 text-gray-600 dark:text-white/75">
                          {invoice.mobileNo}
                        </TableCell>
                        <TableCell className="py-2 text-right font-medium text-gray-700 dark:text-white/75">
                          {formatCurrency(invoice.grandTotal)}
                        </TableCell>
                        <TableCell className="py-2 text-right text-green-600 dark:text-green-400 font-semibold">
                          {formatCurrency(invoice.paidAmount)}
                        </TableCell>
                        <TableCell className="py-2 text-right text-orange-600 dark:text-orange-400 font-semibold">
                          {formatCurrency(invoice.pendingAmount)}
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs hover:bg-primary hover:text-white border-primary/20 text-primary"
                          >
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        className="text-center py-16 text-muted-foreground bg-muted/5"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="w-10 h-10 text-muted-foreground/50" />
                          <p>No invoices found matching your filters.</p>
                          <Button
                            variant="link"
                            onClick={handleClear}
                            className="text-primary"
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-[#443C68]/50 bg-gray-50 dark:bg-[#18122B]/50">
            <div className="hidden sm:flex w-[120px]">
              <span className="text-xs text-gray-500 dark:text-white/50">
                Page {currentPage} of {Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage))}
              </span>
            </div>
            <CustomPagination
              totalItems={filteredInvoices.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="flex w-[120px] justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 text-green-700 border-green-700 hover:bg-green-50 p-0"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
