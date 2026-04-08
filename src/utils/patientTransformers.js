/**
 * Transform form data to the confirmed API contract for Patient/UpsertPatient
 *
 * Confirmed via direct curl testing (HTTP 204 = success):
 * - Flat body (no wrapper object)
 * - Age must be a STRING (e.g. "25"), not an integer
 * - CreatedBy must be an INTEGER (user ID), not a string
 * - Returns 204 No Content on success
 */
export const transformPatientFormDataToAPI = (formData) => {
  // Build address string from parts, filtering out empty segments
  const addressParts = [formData.flatHouseNo, formData.areaStreet, formData.landmark]
    .filter(Boolean)
    .join(", ");

  return {
    PatientID: formData.patientID || formData.patientNo || 0,
    ClinicID: formData.clinicID || 0,
    ClinicName: formData.clinicName || "",
    FirstName: formData.firstName || "",
    LastName: formData.lastName || "",
    Email: formData.email || "",
    MobileNo: formData.mobileNo || "",
    TelephoneNo: formData.telephoneNo || "",
    Gender: formData.gender || "",
    DOB: formData.dateOfBirth || null,
    Age: formData.age ? String(formData.age) : "",  // API requires Age as a STRING
    Address: addressParts,
    City: formData.city || "",
    State: formData.state || "",
    Country: formData.country || "",
    BloodGroup: formData.bloodGroup || "",
    EnquirySource: formData.enquirySource || "",
    CasePaperNo: formData.casePaperNo || "",
    IsActive: true,
    CreatedBy: 1,  // API requires CreatedBy as INTEGER (user ID)
  };
};
