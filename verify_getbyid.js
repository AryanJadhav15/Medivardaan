const axios = require('axios');

const baseUrl = 'https://bmetrics.in/APIDemo/api/Patient/GetPatientById';
const token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IkFkbWluIiwiSXNDdXN0b21lciI6ImZhbHNlIiwiZXhwIjoxNzY5MTgxMjUzLCJpc3MiOiJodHRwczovL215d2ViYXBpLmNvbSIsImF1ZCI6Imh0dHBzOi8vbXl3ZWJhcGkuY29tIn0.Jn_hhkaEDtrryoRR8FX5lyo7TwGmvgbU4mGsHfajjyo';

// We need a valid patient ID first. Let's fetch one from GetAllPatients.
async function testGetById() {
    try {
        console.log('Fetching a patient ID first...');
        const listUrl = 'https://bmetrics.in/APIDemo/api/Patient/GetAllPatients?PageNumber=1&PageSize=1';
        const listRes = await axios.get(listUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!listRes.data || listRes.data.length === 0) {
            console.log('No patients found to test with.');
            return;
        }

        const patient = listRes.data[0];
        const id = patient.patientID || patient.PatientID || patient.id; // adjust based on actual key
        console.log(`Testing with Patient ID: ${id}`);

        // Test Path Param: /GetPatientById/1
        try {
            console.log(`Attempting Path Param: ${baseUrl}/${id}`);
            const resPath = await axios.get(`${baseUrl}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            console.log('Path Param Success:', resPath.status);
            console.log('Data keys:', Object.keys(resPath.data));
        } catch (e) {
            console.log('Path Param Failed:', e.message);
        }

        // Test Query Param: /GetPatientById?patientId=1
        try {
            console.log(`Attempting Query Param: ${baseUrl}?patientId=${id}`);
            const resQuery = await axios.get(`${baseUrl}`, { 
                headers: { 'Authorization': `Bearer ${token}` },
                params: { patientId: id }
            });
            console.log('Query Param Success:', resQuery.status);
            console.log('Data keys:', Object.keys(resQuery.data));
            console.log('Sample Data:', JSON.stringify(resQuery.data).substring(0, 100));
        } catch (e) {
            console.log('Query Param Failed:', e.message);
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

testGetById();
