/**
 * Appointments API
 * Handles appointment operations via Next.js API Routes
 */

export const getAppointments = async (params = {}) => {
    if (typeof window === 'undefined') return []; // Safety check for server-side

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/Appointments/getAppointments${queryString ? `?${queryString}` : ''}`;
    
    // Auth header from local storage
    let headers = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers, cache: 'no-store' });
    
    if (!response.ok) {
        let errorMsg = `Failed to fetch appointments: ${response.status}`;
        try {
            const errorData = await response.json();
            const detailsStr = typeof errorData.details === 'object' ? JSON.stringify(errorData.details) : errorData.details;
            const errorStr = typeof errorData.error === 'object' ? JSON.stringify(errorData.error) : errorData.error;
            errorMsg += ` - ${detailsStr || errorStr || JSON.stringify(errorData)}`;
        } catch (e) {
            // response might be text
            const errorText = await response.text();
            if (errorText) errorMsg += ` - ${errorText}`;
        }
        throw new Error(errorMsg);
    }
    
    return response.json();
};

export const upsertAppointment = async (data) => {
    // Auth header from local storage
    let headers = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/Appointments/upsertAppointment', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to upsert appointment: ${response.status}`);
    }

    return response.json();
};

export const getAppointmentsReport = async (params = {}) => {
    // Simulated API Request (Replace with axiosClient later)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 1, name: "test", mobile: "1234567890", clinic: "ADAJAN", doctor: "", date: "31-Oct-2026", time: "11:00 AM", bookedBy: "", status: "Approved", visitStatus: "Pending" },
      { id: 2, name: "test", mobile: "1234567890", clinic: "ADAJAN", doctor: "", date: "31-Oct-2028", time: "11:00 AM", bookedBy: "PatientApp", status: "Approved", visitStatus: "Pending" },
      { id: 3, name: "B. Nikhilesh", mobile: "8179294155", clinic: "LB NAGAR", doctor: "", date: "12-Jan-2026", time: "13:00 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 4, name: "", mobile: "9755530937", clinic: "Bhopal", doctor: "", date: "10-Jan-2026", time: "11:00 AM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 5, name: "Khushi Chavan", mobile: "8799991807", clinic: "Porvorim", doctor: "", date: "07-Jan-2026", time: "15:00 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 6, name: "Nazma", mobile: "9036701315", clinic: "Hoodi", doctor: "", date: "07-Jan-2026", time: "14:30 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 7, name: "Subhankar Mothay", mobile: "8371044099", clinic: "Porvorim", doctor: "", date: "07-Jan-2026", time: "14:00 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 8, name: "Naveen", mobile: "9319522726", clinic: "LAJPAT NAGAR", doctor: "", date: "04-Jan-2026", time: "11:00 AM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 9, name: "Aishwary Dubey", mobile: "9891056124", clinic: "Indore", doctor: "", date: "03-Jan-2026", time: "15:00 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 10, name: "Rajina", mobile: "9188303808", clinic: "Trivandrum", doctor: "", date: "03-Jan-2026", time: "13:00 PM", bookedBy: "", status: "Pending", visitStatus: "Pending" },
      { id: 11, name: "John Doe", mobile: "1231231234", clinic: "Mumbai", doctor: "Dr. Smith", date: "02-Jan-2026", time: "10:00 AM", bookedBy: "Web", status: "Approved", visitStatus: "Completed" },
    ];
};

export const getTodaysConfirmedAppointments = async (params = {}) => {
    // Simulated API Request (Replace with axiosClient later)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { patientNo: "P001", patientName: "Aarav Sharma", mobileNo: "9876543210", doctor: "Dr. Kinnari Lade" },
      { patientNo: "P002", patientName: "Vivaan Patil", mobileNo: "8765432109", doctor: "Dr. Rajesh Kumar" },
      { patientNo: "P003", patientName: "Aditya Verma", mobileNo: "7654321098", doctor: "Dr. Priya Singh" },
      { patientNo: "P004", patientName: "Vihaan Singh", mobileNo: "6543210987", doctor: "Dr. Kinnari Lade" },
      { patientNo: "P005", patientName: "Arjun Mehta", mobileNo: "9988776655", doctor: "Dr. Rajesh Kumar" },
      { patientNo: "P006", patientName: "Sai Iyer", mobileNo: "8877665544", doctor: "Dr. Priya Singh" },
      { patientNo: "P007", patientName: "Reyansh Reddy", mobileNo: "7766554433", doctor: "Dr. Kinnari Lade" },
      { patientNo: "P008", patientName: "Ayaan Nair", mobileNo: "6655443322", doctor: "Dr. Rajesh Kumar" },
      { patientNo: "P009", patientName: "Krishna Das", mobileNo: "5544332211", doctor: "Dr. Priya Singh" },
      { patientNo: "P010", patientName: "Ishaan Kapoor", mobileNo: "9998887776", doctor: "Dr. Kinnari Lade" },
    ];
};
