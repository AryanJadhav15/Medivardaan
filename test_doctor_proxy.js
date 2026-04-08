import fetch from "node-fetch";

const payload = {
  mode: 1,
  doctorID: 0,
  clinicID: "1",
  doctorTypeID: "1",
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
  country: "India",
  state: "Maharashtra",
  city: "Mumbai",
  specialityID: "1",
  basicDegree: "BDS",
  userName: "test@doctor.com",
  password: "Password@123",
  roleID: 2,
  isActive: true,
  isDeleted: false,
  isExistUser: true,
  isTermAccept: true,
  createdDate: new Date().toISOString()
};

const req = await fetch("http://localhost:3000/api/Doctor/AddDoctor", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});

console.log("Status:", req.status);
console.log("Body:", await req.text());
