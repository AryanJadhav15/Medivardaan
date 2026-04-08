import fetch from "node-fetch";

const payload = {
  mode: 1,
  doctorID: 0,
  clinicID: 1,
  doctorTypeID: 1,
  firstName: "Test",
  lastName: "Doctor",
  gender: "male",
  dob: "1990-01-01T00:00:00.000Z",
  bloodGroup: "O+",
  title: "Dr.",
  mobile1: "9999999999",
  email: "test@doctor.com",
  residential_Address: "Test",
  line1: "Test",
  line2: "",
  areaPin: "",
  countryID: 1,
  stateID: 1,
  cityID: 1,
  specialityID: 1,
  basicDegree: "BDS",
  userName: "test@doctor.com",
  password: "Password@123",
  roleID: 2,
  isActive: true,
  isDeleted: false,
  isExistUser: true,
  isTermAccept: true,
  regDate: new Date().toISOString(),
  createdDate: new Date().toISOString()
};

fetch("http://localhost:3000/api/Doctor/AddDoctor", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
}).then(async r => { console.log("Status:", r.status); console.log("Body:", await r.text()); });
