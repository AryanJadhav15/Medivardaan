
const axios = require('axios');

const getAllUrl = 'https://bmetrics.in/APIDemo/api/Patient/GetAllPatients';
const getByIdBase = 'https://bmetrics.in/APIDemo/api/Patient/GetPatientById';
const token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY5MTgxMjUzLCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.Jn_hhkaEDtrryoRR8FX5lyo7TwGmvgbU4mGsHfajjyo';

async function testApi() {
    try {
        console.log('1. Fetching One Patient...');
        const resAll = await axios.get(getAllUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!resAll.data || resAll.data.length === 0) {
            console.log('No patients found.');
            return;
        }

        const p = resAll.data[0];
        console.log('First Patient Object Keys:', Object.keys(p));
        console.log('First Patient Object:', JSON.stringify(p));
        
        // Try to identify ID
        const id = p.patientID || p.PatientID || p.id || p.ID;
        console.log(`Identified ID: ${id}`);

        if (!id) {
            console.log('Could not identify ID field.');
            return;
        }

        // Test Variations
        const variations = [
            { name: 'Path Param', url: `${getByIdBase}/${id}` },
            { name: 'Query Param id', url: `${getByIdBase}?id=${id}` },
            { name: 'Query Param patientId', url: `${getByIdBase}?patientId=${id}` },
            { name: 'Query Param ID', url: `${getByIdBase}?ID=${id}` },
            { name: 'Trailing Slash Path', url: `${getByIdBase}/${id}/` },
            { name: 'Trailing Slash Query', url: `${getByIdBase}/?patientId=${id}` },
        ];

        for (const v of variations) {
            try {
                console.log(`Testing ${v.name}: ${v.url}`);
                const res = await axios.get(v.url, { headers: { 'Authorization': `Bearer ${token}` } });
                console.log(`[SUCCESS] ${v.name}: Status ${res.status}`);
            } catch (e) {
                console.log(`[FAILED] ${v.name}: ${e.message} (Status: ${e.response?.status})`);
            }
        }

    } catch (err) {
        console.error('Fatal Error:', err.message);
        if (err.response) console.log('Response Status:', err.response.status);
    }
}

testApi();
