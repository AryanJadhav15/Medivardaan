const axios = require('axios');
axios.get('https://bmetrics.in/APIDemo/api/Report/GetDoctorCollectionReport?FromDate=2024-12-08&ToDate=2025-12-23', {
  headers: {
    // try no auth first
  }
}).then(r => {
  console.log("Status:", r.status);
  console.log("Data:", typeof r.data === 'string' ? r.data.substring(0, 100) : r.data.slice(0,2));
}).catch(e => {
  console.error("Error Status:", e.response ? e.response.status : e.message);
  console.error("Error Data:", e.response ? e.response.data : '');
});
