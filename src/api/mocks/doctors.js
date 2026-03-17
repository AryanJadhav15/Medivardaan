// Shared mock storage for doctors
// This simulates a database in memory for development when external API is down

let mockDoctors = [
  {
    doctorID: 1,
    clinicID: 1,
    clinicName: "Panvel Clinic",
    title: "Dr.",
    firstName: "Rajesh",
    lastName: "Kumar",
    gender: "Male",
    dob: "1985-05-15",
    mobileNo: "9876543210",
    MobileNo: "9876543210",
    emailID: "rajesh.kumar@example.com",
    EmailID: "rajesh.kumar@example.com",
    bloodGroup: "O+",
    addressLine1: "123 Medical Street",
    addressLine2: "Near City Hospital",
    cityID: 1,
    stateID: 1,
    countryID: 1,
    areaPin: "410206",
    specialityID: "1, 2",
    basicDegree: "BDS",
    registrationNo: "REG001",
    profilePhoto: "/placeholder-doctor.png",
    intime: "09:00",
    outtime: "18:00",
    registrationDate: "2020-01-15",
    RegistrationDate: "2020-01-15",
    isActive: true,
    isDeleted: false,
  },
  {
    doctorID: 2,
    clinicID: 2,
    clinicName: "Pune Clinic",
    title: "Dr.",
    firstName: "Priya",
    lastName: "Sharma",
    gender: "Female",
    dob: "1990-08-22",
    mobileNo: "9123456789",
    MobileNo: "9123456789",
    emailID: "priya.sharma@example.com",
    EmailID: "priya.sharma@example.com",
    bloodGroup: "A+",
    addressLine1: "456 Health Avenue",
    addressLine2: "Opposite Park",
    cityID: 2,
    stateID: 1,
    countryID: 1,
    areaPin: "411001",
    specialityID: "3, 4",
    basicDegree: "MDS",
    registrationNo: "REG002",
    profilePhoto: "/placeholder-doctor.png",
    intime: "10:00",
    outtime: "19:00",
    registrationDate: "2019-06-10",
    RegistrationDate: "2019-06-10",
    isActive: true,
    isDeleted: false,
  },
  {
    doctorID: 3,
    clinicID: 1,
    clinicName: "Panvel Clinic",
    title: "Dr.",
    firstName: "Amit",
    lastName: "Patel",
    gender: "Male",
    dob: "1988-03-10",
    mobileNo: "9998887776",
    MobileNo: "9998887776",
    emailID: "amit.patel@example.com",
    EmailID: "amit.patel@example.com",
    bloodGroup: "B+",
    addressLine1: "789 Dental Plaza",
    addressLine2: "Sector 5",
    cityID: 1,
    stateID: 1,
    countryID: 1,
    areaPin: "410210",
    specialityID: "1, 5",
    basicDegree: "BDS",
    registrationNo: "REG003",
    profilePhoto: "/placeholder-doctor.png",
    intime: "08:00",
    outtime: "17:00",
    registrationDate: "2021-03-20",
    RegistrationDate: "2021-03-20",
    isActive: true,
    isDeleted: false,
  },
];

let nextDoctorId = 100;

// Get all mock doctors
export function getMockDoctors(filters = {}) {
  let result = [...mockDoctors];

  if (filters.DoctorID) {
    result = result.filter(d => d.doctorID === parseInt(filters.DoctorID));
  }
  if (filters.ClinicID) {
    result = result.filter(d => d.clinicID === parseInt(filters.ClinicID));
  }
  if (filters.ClinicName) {
    result = result.filter(d =>
      d.clinicName.toLowerCase().includes(filters.ClinicName.toLowerCase())
    );
  }
  if (filters.MobileNo) {
    result = result.filter(d => d.mobileNo.includes(filters.MobileNo));
  }

  return result;
}

// Add a new mock doctor
export function addMockDoctor(doctorData) {
  const newDoctor = {
    ...doctorData,
    doctorID: nextDoctorId++,
    mobileNo: doctorData.phoneNo1 || doctorData.mobileNo,
    MobileNo: doctorData.phoneNo1 || doctorData.MobileNo || doctorData.mobileNo,
    emailID: doctorData.emailid || doctorData.emailID,
    EmailID: doctorData.emailid || doctorData.EmailID || doctorData.email,
    registrationDate: new Date().toISOString().split('T')[0],
    RegistrationDate: new Date().toISOString().split('T')[0],
    isActive: true,
    isDeleted: false,
  };

  mockDoctors.push(newDoctor);
  return newDoctor;
}

// Update an existing mock doctor
export function updateMockDoctor(doctorId, doctorData) {
  const index = mockDoctors.findIndex(d => d.doctorID === doctorId);
  if (index !== -1) {
    mockDoctors[index] = {
      ...mockDoctors[index],
      ...doctorData,
      doctorID: doctorId, // Preserve the ID
    };
    return mockDoctors[index];
  }
  return null;
}

// Delete a mock doctor
export function deleteMockDoctor(doctorId) {
  const index = mockDoctors.findIndex(d => d.doctorID === doctorId);
  if (index !== -1) {
    mockDoctors[index].isDeleted = true;
    return true;
  }
  return false;
}
