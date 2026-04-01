const axios = require('axios');
const client = axios.create({ baseURL: 'https://bmetrics.in/APIDemo/api' });
console.log(client.getUri({ url: '/api/Report/GetDoctorCollectionReport' }));
