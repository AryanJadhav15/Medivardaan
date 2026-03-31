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
        throw new Error(`Failed to fetch appointments report: ${response.status}`);
    }
    
    const data = await response.json();
    // Return empty array if data isn't in expected array format
    return Array.isArray(data) ? data : (data?.data || data?.appointments || []);
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
