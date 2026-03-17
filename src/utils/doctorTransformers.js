/**
 * Doctor Data Transformation Utilities
 * Handles transformation between UI forms and API data formats
 */

/**
 * Clinic ID mapping
 */
const CLINIC_ID_MAP = {
  panvel: 1,
  pune: 2,
  mumbai: 3,
  nashik: 4,
};

/**
 * Doctor type ID mapping
 */
const DOCTOR_TYPE_MAP = {
  'full-time': 1,
  'part-time': 2,
  'visiting': 3,
};

/**
 * Speciality ID Mapping
 */
const SPECIALITY_ID_MAP = {
  generalDentist: 1,
  orthodontics: 2,
  periodontics: 3,
  prosthodontics: 4,
  endodontics: 5,
  pedodontics: 6,
  oralMaxillofacial: 7,
  oralPathology: 8,
  conservativeDentist: 9,
  asthesticDentist: 10,
};

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} Transformed data for API
 */
/**
 * Transform form data to API format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} Transformed data for API
 */
export const transformFormDataToAPI = (formData) => {
  console.log("Transformer received keys:", Object.keys(formData));
  
  const isUpdate = formData.doctorID && formData.doctorID > 0;
  
  const payload = {
    // Mode and IDs
    mode: isUpdate ? 2 : 1, // 1 for Add, 2 for Update
    doctorID: formData.doctorID || 0, 
    clinicID: formData.clinicID ? String(formData.clinicID) : "1", 
    doctorTypeID: formData.doctorTypeID ? String(formData.doctorTypeID) : "1",

    // Personal Information
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    middleName: "", 
    gender: formData.gender || "male",
    dob: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date("1990-01-01").toISOString(),
    bloodGroup: formData.bloodGroup || "",
    title: formData.title || "Dr.",

    // Contact Information
    mobile1: formData.mobileNo1 || "",
    mobile2: formData.mobile2 || "",
    email: formData.email || "",

    // Address Information
    residential_Address: formData.addressLine1 || "",
    line1: formData.addressLine1 || "",
    line2: formData.addressLine2 || "",
    areaPin: formData.areaPin || "",
    cityID: null, 
    stateID: null,
    countryID: null,
    locationID: null, 
    country: formData.country,
    state: formData.state,
    city: formData.city,

    // Medical Information
    specialityID: formData.specialityID ? String(formData.specialityID) : "1",
    basicDegree: formData.currentEducation?.degree || formData.basicDegree || "BDS", 
    degreeUpload1: formData.degreeUpload1 || "",
    degreeUpload2: formData.degreeUpload2 || "",
    
    // Registration & Documents
    registrationNo: formData.registrationNo || "",
    registrationImageUrl: formData.registrationImageUrl || "", 
    panCardNo: formData.panCardNo || "",
    panCardImageUrl: formData.panCardImageUrl || "",
    adharCardNo: formData.adharCardNo || "",
    adharCardImageUrl: formData.adharCardImageUrl || "", 
    identityPolicyNo: formData.identityPolicyNo || formData.indemnityPolicyNo || "",
    identityPolicyImageUrl: formData.identityPolicyImageUrl || "",
    profileImageUrl: formData.profileImageUrl || "",

    // Work Information
    inTime: formData.inTime ? (formData.inTime.includes(':') && formData.inTime.length === 5 ? `${formData.inTime}:00` : formData.inTime) : "09:00:00", 
    outTime: formData.outTime ? (formData.outTime.includes(':') && formData.outTime.length === 5 ? `${formData.outTime}:00` : formData.outTime) : "18:00:00", 
    regDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(), 
    
    // User credentials (Todo: Should be dynamic)
    userName: formData.email || "", 
    password: "Password@123", 
    roleID: 2, 

    // Status & System 
    isActive: true,
    isDeleted: false, 
    isExistUser: true, 
    isTermAccept: true, 
    modifiedDate: new Date().toISOString(), 
    modifiedBy: null,
    createdDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(), 
    otp: null,
  };

  console.log("Transformed API Payload (Full Schema):", payload);
  return payload;
};

/**
 * Transform API response to display format
 * @param {Object} apiDoctor - Doctor data from API
 * @returns {Object} Transformed data for display
 */
export const transformAPIDoctorToDisplay = (apiDoctor) => {
  return {
    srNo: apiDoctor.srNo || apiDoctor.doctorID || apiDoctor.DoctorID,
    doctorID: apiDoctor.doctorID || apiDoctor.DoctorID,
    photo: apiDoctor.profilePhoto || apiDoctor.profileImageUrl || "/placeholder-doctor.png",
    name: `${apiDoctor.title || ''} ${apiDoctor.firstName || ''} ${apiDoctor.lastName || ''}`.trim(),
    mobileNo: apiDoctor.mobile1 || apiDoctor.mobileNo || apiDoctor.MobileNo || apiDoctor.phoneNo1 || '',
    emailId: apiDoctor.email || apiDoctor.emailID || apiDoctor.EmailID || '',
    regDate: formatDate(apiDoctor.regDate || apiDoctor.createdDate),
    clinicID: apiDoctor.clinicID || apiDoctor.ClinicID,
    clinicName: apiDoctor.clinicName || apiDoctor.ClinicName || "Unknown",
  };
};

// Helper to format date as DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  return date.toLocaleDateString('en-GB').replace(/\//g, '-');
};

/**
 * Normalize API response to handle different field name formats
 * @param {Object} doctor - Raw doctor data from API
 * @returns {Object} Normalized doctor data
 */
export const normalizeDoctorData = (doctor) => {
  return {
    doctorID: doctor.doctorID || doctor.DoctorID,
    clinicID: doctor.clinicID || doctor.ClinicID,
    clinicName: doctor.clinicName || doctor.ClinicName,
    firstName: doctor.firstName || doctor.FirstName,
    lastName: doctor.lastName || doctor.LastName,
    mobileNo: doctor.mobileNo || doctor.MobileNo || doctor.phoneNo1 || doctor.mobile1,
    emailID: doctor.emailID || doctor.EmailID || doctor.email,
    profilePhoto: doctor.profilePhoto || doctor.ProfilePhoto || doctor.profileImageUrl,
    registrationDate: doctor.registrationDate || doctor.RegistrationDate || doctor.regDate,
    ...doctor,
  };
};

/**
 * Transform API response to Form Data for Editing
 * @param {Object} apiDoctor - Doctor data from API
 * @returns {Object} Form data object
 */
export const transformAPItoForm = (apiDoctor) => {
  if (!apiDoctor) return null;

  // Safe date helper
  const toISODate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return "";
    }
  };

  // Safe time helper (HH:MM)
  const toTime = (timeStr) => {
    if (!timeStr) return "";
    // If it's full ISO string or contains T
    if (timeStr.includes('T')) {
       const date = new Date(timeStr);
       const hours = String(date.getHours()).padStart(2, '0');
       const minutes = String(date.getMinutes()).padStart(2, '0');
       return `${hours}:${minutes}`;
    }
    // If it's HH:MM:SS
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  return {
    doctorID: apiDoctor.doctorID || apiDoctor.DoctorID || 0,
    clinicID: apiDoctor.clinicID || apiDoctor.ClinicID || "",
    doctorTypeID: apiDoctor.doctorTypeID || apiDoctor.DoctorTypeID || "",
    date: toISODate(apiDoctor.createdDate),

    // Personal
    title: apiDoctor.title || "Dr.",
    firstName: apiDoctor.firstName || "",
    lastName: apiDoctor.lastName || "",
    dateOfBirth: toISODate(apiDoctor.dob),
    gender: apiDoctor.gender ? apiDoctor.gender.toLowerCase() : "male",
    addressLine1: apiDoctor.residential_Address || apiDoctor.line1 || "",
    addressLine2: apiDoctor.line2 || "",
    country: apiDoctor.country || "India", 
    state: apiDoctor.state || "Maharashtra", 
    city: apiDoctor.city || "Mumbai", 
    areaPin: apiDoctor.areaPin || "",
    mobileNo1: apiDoctor.mobile1 || apiDoctor.mobileNo || "",
    mobileNo2: apiDoctor.mobile2 || "",
    email: apiDoctor.email || "",
    bloodGroup: apiDoctor.bloodGroup || "",
    inTime: toTime(apiDoctor.inTime),
    outTime: toTime(apiDoctor.outTime),

    // Education
    educationList: [], 
    currentEducation: {
      degree: apiDoctor.basicDegree || "",
      board: "",
      upload: null,
    },

    // Speciality - mapped to single ID now
    specialityID: apiDoctor.specialityID || apiDoctor.SpecialityID || "",

    // Documents (URLs)
    profilePhoto: null, 
    profileImageUrl: apiDoctor.profileImageUrl, 
    
    adharCardNo: apiDoctor.adharCardNo || "",
    adharCardImage: null,
    adharCardImageUrl: apiDoctor.adharCardImageUrl,

    panCardNo: apiDoctor.panCardNo || "",
    panCardImage: null,
    panCardImageUrl: apiDoctor.panCardImageUrl,

    registrationNo: apiDoctor.registrationNo || "",
    certificateImage: null,
    registrationImageUrl: apiDoctor.registrationImageUrl,

    indemnityPolicyNo: apiDoctor.identityPolicyNo || "",
    indemnityPolicyImage: null,
    identityPolicyImageUrl: apiDoctor.identityPolicyImageUrl,
  };
};
