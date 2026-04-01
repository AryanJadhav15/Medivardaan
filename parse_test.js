const item = {"clinicName":"ADAJAN","doctorName":"Dr.Khushbu Ranva","treatmentPaidAmount":188600,"medicinesPaidAmount":0};

const treatmentAmount = (item.TreatmentPaidAmount || item.treatmentPaidAmount || item.TreatmentAmount || item.treatmentAmount || 0).toString();
const medicineAmount = (item.MedicinesPaidAmount || item.medicinesPaidAmount || item.MedicineAmount || item.medicineAmount || 0).toString();

console.log("Treatment:", treatmentAmount);
console.log("Medicine:", medicineAmount);
