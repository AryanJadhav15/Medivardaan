
const axios = require('axios');

const BASE_URL = "https://bmetrics.in/APIDemo/api";
const AUTH = {
    USERNAME: "Admin",
    PASSWORD: "#Ortho#$Admin",
};

async function testExternalApi() {
    try {
        console.log("1. Logging in...");
        const loginUrl = `${BASE_URL}/Auth/Login`;
        const loginResponse = await axios.post(loginUrl, {
            userId: AUTH.USERNAME,
            userPassword: AUTH.PASSWORD
        });

        // Try to find the token
        const data = loginResponse.data;
        const token = data.token || data.accessToken || data.jwt || data;
        
        if (!token || typeof token !== 'string') {
            console.error("Failed to get token:", data);
            return;
        }
        console.log("Login successful. Token obtained.");

        console.log("2. Fetching PatientById...");
        // Test with patientId=1 (from the mock data example)
        const patientId = 1; 
        const patientUrl = `${BASE_URL}/Patient/GetPatientById?PatientId=${patientId}`;
        console.log("Target URL:", patientUrl);

        try {
            const patientResponse = await axios.get(patientUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'text/plain'
                }
            });
            console.log("Patient API Success:", patientResponse.status);
            console.log("Data:", JSON.stringify(patientResponse.data, null, 2));
        } catch (patientError) {
            console.error("Patient API Failed:", patientError.response ? patientError.response.status : patientError.message);
            if (patientError.response) {
                console.error("Response Data:", patientError.response.data);
            }
        }

    } catch (error) {
        console.error("General Error:", error.message);
        if (error.response) {
            console.error("Response Data:", error.response.data);
        }
    }
}

testExternalApi();
