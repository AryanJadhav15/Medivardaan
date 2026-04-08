/**
 * Transforms frontend form data to the specific structure required by the External API.
 * Matches USER provided CURL payload schema.
 */
export const transformAppointmentFormData = (formData) => {
    return {
      appointmentId: formData.appointmentId || 0,
      patientId: formData.patientId || 0,
      enquiryID: formData.enquiryID || 0,
      clinicID: formData.clinicID ? Number(formData.clinicID) : 0,
      appointmenNo: "",
      doctorID: formData.doctorID ? Number(formData.doctorID) : 0,
      firstName: formData.patientName || "",
      lastName: "", // Split from patientName if needed
      dateBirth: formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString(),
      age: formData.age || "0",
      gender: formData.gender || "Male",
      email: formData.email || "",
      mobile: formData.mobile || "",
      mobileNo2: "",
      startDate: formData.appointmentDate ? new Date(`${formData.appointmentDate}T${formData.appointmentTime || '00:00'}:00`).toISOString() : new Date().toISOString(),
      endDate: formData.appointmentDate ? new Date(`${formData.appointmentDate}T${formData.appointmentTime || '00:00'}:00`).toISOString() : new Date().toISOString(),
      startTime: formData.appointmentTime || "",
      endTime: formData.appointmentTime || "", // Or calculate +30 mins
      offLineData: true,
      createdBy: 1, // Usually required to be non-zero
      modifiedBy: 1,
      isActive: true,
      mode: 1 // 1 for Insert
    };
  };
