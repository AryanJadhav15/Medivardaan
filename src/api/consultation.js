/**
 * Consultation API
 */

export const upsertConsultation = async (data) => {
    // Auth header from local storage
    let headers = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/Consultation/UpsertConsultation', {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Failed to upsert consultation: ${response.status}`);
    }

    return response.json();
};
