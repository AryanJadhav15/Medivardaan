const item = {
  "clinicName": "ADAJAN",
  "doctorName": "Dr.Khushbu Ranva",
  "treatmentPaidAmount": 188600,
  "medicinesPaidAmount": 0
};
const array = [item];
const mappedData = array.map((item, index) => ({
  id: index + 1,
  clinic: item.ClinicName || item.clinicName || "N/A",
  doctor: item.DoctorName || item.doctorName || "N/A",
  treatmentAmount: (item.TreatmentPaidAmount || item.treatmentPaidAmount || item.TreatmentAmount || item.treatmentAmount || 0).toString(),
  medicineAmount: (item.MedicinesPaidAmount || item.medicinesPaidAmount || item.MedicineAmount || item.medicineAmount || 0).toString(),
  ...item
}));
console.log(mappedData[0]);
