import { API_CONFIG } from "./src/api/config.js";
console.log(API_CONFIG.ENDPOINTS.DOCTOR.ADD);
const payload = {
    UserName: API_CONFIG.AUTH.USERNAME,
    Password: API_CONFIG.AUTH.PASSWORD
};
const res = await fetch("https://bmetrics.in/APIDemo/api/Auth/Login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
});
const data = await res.json();
console.log("Token:", data.token.substring(0, 10) + "...");
const postRes = await fetch("https://bmetrics.in/APIDemo/api" + API_CONFIG.ENDPOINTS.DOCTOR.ADD, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + data.token
    },
    body: JSON.stringify({})
});
console.log("Status:", postRes.status);
console.log("Response:", await postRes.text());
