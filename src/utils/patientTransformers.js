export const transformPatientFormDataToAPI = (formData) => {
  return {
    PatientID: formData.patientID || 0,
    ClinicID: formData.clinicID || 0, // Should be passed or retrieved
    ClinicName: formData.clinicName || "",
    FirstName: formData.firstName || "",
    LastName: formData.lastName || "",
    Email: formData.email || "",
    MobileNo: formData.mobileNo || "",
    Gender: formData.gender || "",
    DOB: formData.dateOfBirth || null,
    Age: formData.age ? parseInt(formData.age) : 0,
    Address: formData.flatHouseNo ? `${formData.flatHouseNo}, ${formData.areaStreet}, ${formData.landmark}`.trim() : "",
    City: formData.city || "",
    State: formData.state || "",
    Country: formData.country || "",
    BloodGroup: formData.bloodGroup || "",
    EnquirySource: formData.enquirySource || "",
    CasePaperNo: formData.casePaperNo || "",
    MedicalHistory: formData.medicalHistory ? JSON.stringify(formData.medicalHistory) : "",
    DentalInfo: formData.dentalInfo ? JSON.stringify(formData.dentalInfo) : "",
    // Add default fields if required by API
    IsActive: true,
    CreatedBy: "System",
  };
};
