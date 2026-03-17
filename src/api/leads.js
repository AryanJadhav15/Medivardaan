/**
 * Leads API
 * Handles interactions with Leads/Enquiries via Next.js API Routes
 */

export const getLeads = async (params = {}) => {
    if (typeof window === 'undefined') return []; // Safety check for server-side

    const mergedParams = { PageSize: 20, ...params };
    
    // Clean params
    const cleanParams = Object.entries(mergedParams)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '');
    
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `/api/Leads/getLeads${queryString ? `?${queryString}` : ''}`;

    // Get token from localStorage for auth header
    let authHeader = '';
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) {
            authHeader = `Bearer ${token}`;
        }
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader })
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const upsertLead = async (data) => {
    // Get token from localStorage for auth header
    let authHeader = '';
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) {
            authHeader = `Bearer ${token}`;
        }
    }

    const response = await fetch('/api/Leads/upsertLeads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader })
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Upsert Failure Details:", errorData); // Log details for debugging
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const getLeadById = async (id) => {
    // Reuse getLeads to fetch by ID, then filter/find the specific one
    const data = await getLeads({ EnquiryID: id, LeadID: id });
    
    if (Array.isArray(data)) {
        const found = data.find(item =>
            String(item.leadID || item.LeadID) === String(id) ||
            String(item.enquiryID || item.EnquiryID) === String(id)
        );
        if (found) return found;
        if (data.length === 1) return data[0];
    }
    return null;
};
