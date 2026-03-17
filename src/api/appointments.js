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
            errorMsg += ` - ${errorData.details || errorData.error || JSON.stringify(errorData)}`;
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
