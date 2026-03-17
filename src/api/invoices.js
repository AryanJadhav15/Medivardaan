/**
 * Invoice API
 */
import axiosClient from "./client";

export const getAllInvoices = async (params = {}) => {
  // Mock data since API is not ready
  return [
    {
      invoiceID: 1,
      invoiceNo: "INV-001",
      clinicName: "Panvel",
      patientCode: "P001",
      patientName: "Rahul Sharma",
      mobileNo: "9876543210",
      grandTotal: 5000,
      paidAmount: 2000,
      pendingAmount: 3000,
    },
    {
      invoiceID: 2,
      invoiceNo: "INV-002",
      clinicName: "Pune",
      patientCode: "P002",
      patientName: "Aditi Singh",
      mobileNo: "9876543211",
      grandTotal: 10000,
      paidAmount: 10000,
      pendingAmount: 0,
    },
    // ... rest of mock data
    {
      invoiceID: 3,
      invoiceNo: "INV-003",
      clinicName: "Mumbai",
      patientCode: "P003",
      patientName: "Vikram Malhotra",
      mobileNo: "9876543212",
      grandTotal: 7500,
      paidAmount: 5000,
      pendingAmount: 2500,
    },
     {
      invoiceID: 4,
      invoiceNo: "INV-004",
      clinicName: "Nashik",
      patientCode: "P004",
      patientName: "Sonia Patil",
      mobileNo: "9876543213",
      grandTotal: 3000,
      paidAmount: 3000,
      pendingAmount: 0,
    },
    {
      invoiceID: 5,
      invoiceNo: "INV-005",
      clinicName: "Dwarka",
      patientCode: "P005",
      patientName: "Amit Verma",
      mobileNo: "9876543214",
      grandTotal: 12000,
      paidAmount: 6000,
      pendingAmount: 6000,
      pendingAmount: 6000,
    }
  ];
};

export const deleteInvoice = async (invoiceId) => {
  await axiosClient.delete(`/Invoice/DeleteInvoice/${invoiceId}`);
  return true;
};

export const getChequeDetails = async (params = {}) => {
  const response = await axiosClient.get("/Invoice/GetChequeDetails", {
    params,
  });
  return response; // axiosClient returns data
};
