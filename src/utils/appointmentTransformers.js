/**
 * Transforms frontend form data to the specific structure required by the External API.
 * Matches USER provided CURL payload schema.
 */
export const transformAppointmentFormData = (formData) => {
    return {
      appointmentId: 0, // Default for new, update if ID exists
      patientId: 0,
      enquiryID: 0,
      clinicID: 0, // Should be mapped if possible
      appointmenNo: "",
      doctorID: 0, // Should be mapped
      firstName: formData.patientName || "",
      lastName: "", // Split from patientName if needed
      dateBirth: formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString(),
      age: formData.age || "0",
      gender: "Male", // Default or add field
      email: "",
      mobile: "", // Add field if form has it
      mobileNo2: "",
      startDate: formData.appointmentDate ? new Date(`${formData.appointmentDate}T${formData.appointmentTime || '00:00'}:00`).toISOString() : new Date().toISOString(),
      endDate: formData.appointmentDate ? new Date(`${formData.appointmentDate}T${formData.appointmentTime || '00:00'}:00`).toISOString() : new Date().toISOString(),
      startTime: formData.appointmentTime || "",
      endTime: formData.appointmentTime || "", // Or calculate +30 mins
      offLineData: true,
      createdBy: 0,
      modifiedBy: 0,
      isActive: true,
      mode: 1 // 1 for Insert (Assuming standard pattern, as 0 failed to save)
    };
  };
