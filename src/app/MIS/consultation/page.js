"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MinusSquare,
  Trash2,
  Save,
  Loader2,
  Settings,
  User,
} from "lucide-react";
import { upsertConsultation } from "@/api/consultation";
import { patientService } from "@/api/client/patients";
import { toast } from "sonner";
import { TableWrapper } from "@/components/shared/TableWrapper";

export default function ConsultationPage() {
  const printRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    height: "",
    weight: "",
    bloodPressure: "",
    pulseRate: "",
    diagnosis: "",
    labTests: [],
    notes: "",
    nextConsultationDate: "",
    nextConsultationTime: "",
  });

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    id: "",
    patientId: null,
    age: "",
    gender: "",
    contact: "",
    registrationDate: "",
    dob: "",
    visits: 0,
    lastDiagnosis: "N/A",
  });

  const clinicInfo = {
    name: "MEDIVARDAAN",
    id: 1, // Mock ID
    regNo: "REG-456789",
    address: "12, Harmony Street, Pune, Maharashtra",
    phone: "+91 20 1234 5678",
  };

  const doctorInfo = {
    name: "Dr. Kavita Rao",
    id: 32, // Mock ID
    qualification: "BDS, MDS (Prosthodontics)",
    regDate: "2020-03-15",
    signature: "Dr. Kavita Rao",
  };

  // Fetch Patient Data
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const initialPatientId = searchParams ? searchParams.get("patientId") : null;

  React.useEffect(() => {
    if (initialPatientId) {
      fetchPatientData(initialPatientId);
    }
  }, [initialPatientId]);

  const fetchPatientData = async (id) => {
    try {
      const data = await patientService.getPatientById(id);
      if (data) {
        setPatientInfo({
          name: `${data.firstName || ""} ${data.lastName || ""}`,
          id: data.patientCode || "N/A",
          patientId: data.patientID || data.id,
          age: data.age || "N/A",
          gender: data.gender || "N/A",
          contact: data.mobile || data.mobileNo || "N/A",
          registrationDate: data.registrationDate
            ? new Date(data.registrationDate).toLocaleDateString()
            : "N/A",
          dob: data.dob ? new Date(data.dob).toLocaleDateString() : "N/A",
          visits: data.visitCount || 0,
          lastDiagnosis: data.lastDiagnosis || "N/A",
        });
        // Pre-fill form if needed or just display info
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast.error("Failed to load patient details.");
    }
  };

  const [ongoingTreatments, setOngoingTreatments] = useState([
    { name: "Scaling", id: 1 },
    { name: "Cavity Filling", id: 2 },
  ]);

  const [ongoingMedicines, setOngoingMedicines] = useState([
    {
      type: "Tablet",
      inHouse: false,
      name: "Paracetamol 500mg",
      dose: "500mg",
      noOfDays: "5",
      morning: false,
      afternoon: true,
      evening: false,
      strip: "1",
      remarks: "After food",
    },
    {
      type: "Syrup",
      inHouse: true,
      name: "Calcium 500mg",
      dose: "10ml",
      noOfDays: "7",
      morning: true,
      afternoon: false,
      evening: true,
      strip: "1",
      remarks: "",
    },
  ]);

  const [newTreatment, setNewTreatment] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    type: "",
    inHouse: false,
    name: "",
    dose: "",
    noOfDays: "",
    morning: false,
    afternoon: false,
    evening: false,
    strip: "1",
    remarks: "",
  });
  const [newLabTest, setNewLabTest] = useState("");

  const addLabTest = () => {
    const value = newLabTest.trim();
    if (!value) return;
    setForm((s) => ({ ...s, labTests: [...(s.labTests || []), value] }));
    setNewLabTest("");
  };

  const removeLabTest = (index) => {
    setForm((s) => ({
      ...s,
      labTests: (s.labTests || []).filter((_, i) => i !== index),
    }));
  };

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  const addTreatment = () => {
    if (newTreatment.trim()) {
      setOngoingTreatments([
        ...ongoingTreatments,
        { name: newTreatment, id: 0 },
      ]); // ID 0 for new
      setNewTreatment("");
    }
  };

  const addMedicine = () => {
    console.log("Add Medicine clicked", newMedicine);

    if (!newMedicine.name || !newMedicine.name.trim()) {
      alert("Please enter a medicine name");
      return;
    }

    const medicineToAdd = {
      type: newMedicine.type || "",
      inHouse: newMedicine.inHouse || false,
      name: newMedicine.name.trim(),
      dose: newMedicine.dose || "",
      noOfDays: newMedicine.noOfDays || "",
      morning: newMedicine.morning || false,
      afternoon: newMedicine.afternoon || false,
      evening: newMedicine.evening || false,
      strip: newMedicine.strip || "1",
      remarks: newMedicine.remarks || "",
    };

    console.log("Adding medicine:", medicineToAdd);
    setOngoingMedicines([...ongoingMedicines, medicineToAdd]);

    // Reset form
    setNewMedicine({
      type: "",
      inHouse: false,
      name: "",
      dose: "",
      noOfDays: "",
      morning: false,
      afternoon: false,
      evening: false,
      strip: "1",
      remarks: "",
    });
  };

  const removeTreatment = (index) => {
    setOngoingTreatments((s) => s.filter((_, i) => i !== index));
  };

  const removeMedicine = (index) => {
    setOngoingMedicines((s) => s.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    // clone printable DOM so we can mutate safely
    const clone = printRef.current.cloneNode(true);

    // remove elements that should not be printed
    clone.querySelectorAll("[data-no-print]").forEach((el) => el.remove());

    // optional: also remove any dialog modals or elements you don't want
    clone
      .querySelectorAll(".react-modal, .dialog")
      .forEach((el) => el.remove());

    const win = window.open("", "_blank", "width=900,height=800");
    if (!win) return;

    win.document.write(`
    <html>
        <head>
          <title>Consultation Report</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <style>
            * { box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; margin: 40px; color: #111; }
            h1,h2,h3,h4,h5,h6 { margin: 0; }
            .card { border: 1px solid #000; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .label { font-weight: 500; }

            /* --- Print-specific Styling --- */
            @media print {
              body { margin: 10mm 15mm; font-size: 13px; line-height: 1.5; color: #000; background: #fff; }
              table, th, td { border-color: #333; }
              .no-print, [data-no-print] { display: none !important; }
              .card { box-shadow: none !important; border: 1px solid #000; }
              button, input, textarea { display: none !important; }
              .text-sm { font-size: 12px; }
              .text-lg { font-size: 15px; font-weight: 600; }
              .text-xl { font-size: 18px; font-weight: 700; }
            }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
  `);

    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!clinicInfo.id || !doctorInfo.id || !patientInfo.patientId) {
        toast.error("Missing clinic, doctor, or patient information.");
        setIsSubmitting(false);
        return;
      }

      // Prepare Payload based on schema provided
      const payload = {
        consultationID: 0, // 0 for new
        clinicId: clinicInfo.id,
        patientId: patientInfo.patientId,
        doctorId: doctorInfo.id,
        consultationDate: new Date().toISOString(),
        height: form.height || "", // Ensure string
        weight: form.weight || "", // Ensure string
        bloodPressure: form.bloodPressure || "", // Ensure string
        pulseRate: form.pulseRate || "", // Ensure string
        diagnosisDetails: form.diagnosis || "", // Ensure string
        notes: form.notes || "",
        createBy: 1, // Start with assumed user ID 1

        // Treatments
        ongoingTreatments: ongoingTreatments.map((t) => ({
          consultationTreatmentID: 0,
          treatmentID: t.id || 0, // Map to ID if existing, else 0
          consultationId: 0,
        })),

        // Medicines
        medicines: ongoingMedicines.map((m) => ({
          consultationID: 0,
          medicinesTypeId: 0, // Needs mapping from string type to ID if backend requires it. Sending 0 for now.
          medicinesName: m.name || "",
          dose: parseFloat(m.dose) || 0, // Ensure number
          noOfDays: parseInt(m.noOfDays) || 0, // Ensure number
          morning: m.morning ? 1 : 0,
          afternoon: m.afternoon ? 1 : 0,
          evening: m.evening ? 1 : 0,
          strip: parseFloat(m.strip) || 0,
          remarks: m.remarks || "",
        })),

        // Lab Tests
        labTests: form.labTests.map((testName) => ({
          consultationLabTestID: 0,
          labID: 0, // If we had a lab ID we'd use it, else 0
          consultationId: 0,
          reportName: testName || "",
          remarks: "",
          reportStatus: "Pending",
        })),
      };

      console.log("Submitting Consultation Payload:", payload);

      const result = await upsertConsultation(payload);

      if (result && result.success !== false) {
        toast.success("Consultation saved successfully!");
        // Optional: Reset form or redirect
      } else {
        toast.error("Failed to save consultation.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#18122B] pb-8 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6" ref={printRef}>
        {/* Header */}
        <div className="flex items-center gap-2 text-primary mb-8 border-b border-border pb-4">
          <User className="w-5 h-5 text-medivardaan-teal" />
          <h1 className="text-xl font-bold tracking-tight text-medivardaan-teal uppercase">
            Consultation
          </h1>
        </div>

        {/* Consultation Section */}
        <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-sm bg-white dark:bg-[#18122B]">
          <CardHeader className="p-5 bg-primary/10 dark:bg-white/15 border-b border-primary/20 dark:border-primary/30">
            <h2 className="text-lg font-semibold text-primary dark:text-medivardaan-purple">
              Consultation Details
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Date of Consultation
                </Label>
                <Input
                  type="date"
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Height (cm)
                </Label>
                <Input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Weight (kg)
                </Label>
                <Input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Blood Pressure
                </Label>
                <Input
                  name="bloodPressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Pulse Rate
                </Label>
                <Input
                  name="pulseRate"
                  value={form.pulseRate}
                  onChange={handleChange}
                  className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                Diagnosis Details
              </Label>
              <Textarea
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light min-h-[100px]"
              />
            </div>

            {/* Ongoing Treatments */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/90">
                  Ongoing Treatments
                </Label>
                <div className="flex gap-2 print:hidden w-1/2 justify-end">
                  <div className="w-64">
                    <Select
                      value={newTreatment}
                      onValueChange={(value) => setNewTreatment(value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40">
                        <SelectValue placeholder="Select Treatment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Scaling</SelectItem>
                        <SelectItem value="2">Cavity Filling</SelectItem>
                        <SelectItem value="3">Root Canal</SelectItem>
                        <SelectItem value="4">Tooth Extraction</SelectItem>
                        <SelectItem value="5">Braces Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addTreatment}
                    data-no-print
                    className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ul className="mt-2 space-y-2">
                {ongoingTreatments.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#18122B] rounded-md border border-gray-200 dark:border-[#443C68]/50 hover:bg-white dark:hover:bg-[#393053] transition-colors"
                  >
                    <span className="text-gray-800 dark:text-white/90">
                      {t.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTreatment(i)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 print:hidden"
                      data-no-print
                    >
                      <MinusSquare className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medicines */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-primary dark:text-primary">
                Medicines
              </Label>

              <TableWrapper className="rounded-lg border border-gray-200 dark:border-[#443C68]/50 shadow-none border-0 overflow-hidden" contentClassName="p-0 overflow-x-auto">
                <table className="w-full text-sm border-0">
                  <thead>
                    <tr >
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[140px]">
                        Type
                      </th>
                      <th className="p-2 text-center font-medium text-gray-700 dark:text-white/90 min-w-[80px]">
                        In House
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[200px]">
                        Medicines
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[100px]">
                        Dose
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[100px]">
                        No.of Days
                      </th>
                      <th className="p-2 text-center font-medium text-gray-700 dark:text-white/90 min-w-[80px]">
                        Morning
                      </th>
                      <th className="p-2 text-center font-medium text-gray-700 dark:text-white/90 min-w-[90px]">
                        Afternoon
                      </th>
                      <th className="p-2 text-center font-medium text-gray-700 dark:text-white/90 min-w-[80px]">
                        Evening
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[80px]">
                        Strip
                      </th>
                      <th className="p-2 text-left font-medium text-gray-700 dark:text-white/90 min-w-[150px]">
                        Remarks
                      </th>
                      <th className="p-2 text-center font-medium text-gray-700 dark:text-white/90 min-w-[50px] print:hidden">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Input Row */}
                    <tr className="border-b border-gray-300 dark:border-[#443C68]/50 print:hidden bg-gray-50/50 dark:bg-[#18122B]/50">
                      <td className="p-2">
                        <Select
                          value={newMedicine.type}
                          onValueChange={(value) =>
                            setNewMedicine({ ...newMedicine, type: value })
                          }
                        >
                          <SelectTrigger className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white">
                            <SelectValue placeholder="---Type---" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Tablet</SelectItem>
                            <SelectItem value="2">Capsule</SelectItem>
                            <SelectItem value="3">Syrup</SelectItem>
                            <SelectItem value="4">Injection</SelectItem>
                            <SelectItem value="5">Cream</SelectItem>
                            <SelectItem value="6">Drops</SelectItem>
                            <SelectItem value="7">Gel</SelectItem>
                            <SelectItem value="8">Mouthwash</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={newMedicine.inHouse}
                            onChange={(e) =>
                              setNewMedicine({
                                ...newMedicine,
                                inHouse: e.target.checked,
                              })
                            }
                            className="w-4 h-4 cursor-pointer accent-primary"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="Medicine Name"
                          value={newMedicine.name}
                          onChange={(e) =>
                            setNewMedicine({
                              ...newMedicine,
                              name: e.target.value,
                            })
                          }
                          className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="0"
                          value={newMedicine.dose}
                          onChange={(e) =>
                            setNewMedicine({
                              ...newMedicine,
                              dose: e.target.value,
                            })
                          }
                          className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="0"
                          type="number"
                          value={newMedicine.noOfDays}
                          onChange={(e) =>
                            setNewMedicine({
                              ...newMedicine,
                              noOfDays: e.target.value,
                            })
                          }
                          className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={newMedicine.morning}
                            onChange={(e) =>
                              setNewMedicine({
                                ...newMedicine,
                                morning: e.target.checked,
                              })
                            }
                            className="w-4 h-4 cursor-pointer accent-primary"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={newMedicine.afternoon}
                            onChange={(e) =>
                              setNewMedicine({
                                ...newMedicine,
                                afternoon: e.target.checked,
                              })
                            }
                            className="w-4 h-4 cursor-pointer accent-primary"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={newMedicine.evening}
                            onChange={(e) =>
                              setNewMedicine({
                                ...newMedicine,
                                evening: e.target.checked,
                              })
                            }
                            className="w-4 h-4 cursor-pointer accent-primary"
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="1"
                          type="number"
                          value={newMedicine.strip}
                          onChange={(e) =>
                            setNewMedicine({
                              ...newMedicine,
                              strip: e.target.value,
                            })
                          }
                          className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          placeholder="Remarks"
                          value={newMedicine.remarks}
                          onChange={(e) =>
                            setNewMedicine({
                              ...newMedicine,
                              remarks: e.target.value,
                            })
                          }
                          className="w-full h-9 text-xs bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="p-2"></td>
                    </tr>

                    {/* Display Rows */}
                    {ongoingMedicines.map((m, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 dark:border-[#443C68]/50 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053] transition-colors"
                      >
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.type}
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={m.inHouse}
                            disabled
                            className="w-4 h-4 accent-primary"
                          />
                        </td>
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.name}
                        </td>
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.dose}
                        </td>
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.noOfDays}
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={m.morning}
                            disabled
                            className="w-4 h-4 accent-primary"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={m.afternoon}
                            disabled
                            className="w-4 h-4 accent-primary"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={m.evening}
                            disabled
                            className="w-4 h-4 accent-primary"
                          />
                        </td>
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.strip}
                        </td>
                        <td className="p-2 text-gray-800 dark:text-white/90 text-xs">
                          {m.remarks}
                        </td>
                        <td
                          className="p-2 text-center print:hidden"
                          data-no-print
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeMedicine(i)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                            data-no-print
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrapper>

              {/* Add New Button */}
              <div className="flex justify-end print:hidden">
                <Button
                  type="button"
                  onClick={addMedicine}
                  className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                  data-no-print
                >
                  Add New
                </Button>
              </div>
            </div>

            {/* Lab Tests */}
            <div className="space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Lab Tests
                </Label>
                <div
                  className="flex items-center gap-3 print:hidden"
                  data-no-print
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        data-no-print
                        className="border-primary text-primary hover:bg-primary hover:text-white dark:border-medivardaan-purple dark:text-medivardaan-purple dark:hover:bg-medivardaan-purple dark:hover:text-white transition-colors"
                      >
                        View Previous Tests
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Previous Lab Tests</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <p>Blood Sugar - Normal</p>
                        <p>X-Ray - Clean</p>
                        <p>Calcium Levels - Slightly Low</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter lab test"
                      value={newLabTest}
                      onChange={(e) => setNewLabTest(e.target.value)}
                      className="w-64 bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                      data-no-print
                    />
                    <Button
                      onClick={addLabTest}
                      data-no-print
                      className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {(form.labTests || []).map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#18122B] hover:bg-white dark:hover:bg-[#393053] transition-colors rounded-md border border-gray-200 dark:border-[#443C68]/50"
                  >
                    <span className="text-gray-800 dark:text-white/90">
                      {t}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeLabTest(i)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 print:hidden"
                      data-no-print
                    >
                      <MinusSquare className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes + Next Consultation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notes */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-700 dark:text-white/75">
                    Notes
                  </Label>
                  <Dialog data-no-print>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="print:hidden border-primary text-primary hover:bg-primary hover:text-white dark:border-medivardaan-purple dark:text-medivardaan-purple dark:hover:bg-medivardaan-purple dark:hover:text-white transition-colors"
                        data-no-print
                      >
                        History
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Previous Notes</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <p>Patient advised soft diet.</p>
                        <p>Follow up after 7 days.</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter consultation notes..."
                  className="min-h-[180px] bg-white dark:bg-[#18122B] text-gray-900 dark:text-white border-gray-300 dark:border-[#635985]/40 focus:ring-2 focus:ring-[#4DB8AC] focus:border-medivardaan-purple-light"
                />
              </div>
            </div>
            {/* Next Consultation removed as not in API */}

            {/* Bottom Buttons */}
            <div className="mt-8 flex justify-end gap-3 print:hidden border-t border-gray-200 dark:border-[#443C68]/50 pt-6">
              <Button
                variant="outline"
                data-no-print
                onClick={handlePrint}
                className="px-6 border-gray-300 hover:bg-gray-100 dark:bg-[#393053] dark:text-white dark:border-[#635985]/40 dark:hover:bg-[#443C68] transition-colors"
              >
                Print
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                data-no-print
                className="px-8 bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
