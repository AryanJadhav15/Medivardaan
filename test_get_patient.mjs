import fetch from "node-fetch";
fetch("https://bmetrics.in/APIDemo/api/Auth/Login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({UserId: "Admin", UserPassword: "#Ortho#$Admin"})
}).then(r => r.json()).then(data => {
    fetch("https://bmetrics.in/APIDemo/api/Patient/GetAllPatients", {
        headers: { "Authorization": "Bearer " + data.token }
    }).then(r => r.json()).then(patients => {
        console.log(patients[0]);
    });
});
