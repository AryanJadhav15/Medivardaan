# ✅ Axios + React Query Implementation Summary

## 📦 Files Created

### 1. **API Service Layer**
- ✅ `src/api/doctor.api.js` - Axios API calls for doctor endpoints

### 2. **React Query Hooks**
- ✅ `src/hooks/useDoctors.js` - Query hook for fetching doctors (GET)
- ✅ `src/hooks/useDoctorMutations.js` - Mutation hook for upsert/delete (POST/DELETE)

### 3. **Example Component**
- ✅ `src/app/doctor/doctor-registration-new/page.js` - Full working example

### 4. **Documentation**
- ✅ `AXIOS_REACT_QUERY_GUIDE.md` - Complete integration guide

---

## 🚀 How to Use

### **In Any Component:**

```javascript
"use client";

import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";

export default function MyComponent() {
  // Fetch doctors
  const { data: doctors, isLoading, error } = useDoctors();

  // Add/update doctor
  const upsertMutation = useUpsertDoctor();

  const handleSubmit = () => {
    upsertMutation.mutate(formData, {
      onSuccess: (data) => {
        alert(`Doctor saved! ID: ${data.doctorID}`);
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <button
        onClick={handleSubmit}
        disabled={upsertMutation.isPending}
      >
        {upsertMutation.isPending ? "Saving..." : "Save Doctor"}
      </button>

      {doctors.map(doctor => (
        <div key={doctor.srNo}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

---

## 📋 API Endpoint Details

### **Doctor Registration Endpoint**

**URL:** `POST /DoctorRegistration/UpsertDoctor`

**Base URL:** `https://orthosquareportal.com/ManagementApi` (configured in `src/lib/axiosClient.js`)

**Full URL:** `https://orthosquareportal.com/ManagementApi/DoctorRegistration/UpsertDoctor`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN_FROM_LOCALSTORAGE>
```

**Request Body:**
```json
{
  "mode": "1",
  "doctorID": null,
  "clinicID": 1,
  "doctorTypeID": 1,
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "phoneNo1": "1234567890",
  "emailid": "john@example.com",
  "intime": "09:00",
  "outtime": "17:00",
  "panCardNo": "ABCDE1234F",
  "registrationNo": "REG12345",
  "identityPolicyNo": "POL12345",
  "isActive": true
}
```

**Response:**
```json
{
  "doctorID": 123,
  "success": true
}
```

Or just:
```
123
```

---

## 🔄 Data Flow

```
1. User fills form
   ↓
2. Click Submit
   ↓
3. useUpsertDoctor() mutation
   ↓
4. transformFormDataToAPI() - Transform data
   ↓
5. upsertDoctor() - Axios POST request
   ↓
6. axiosClient - Add Authorization header
   ↓
7. External API - POST /DoctorRegistration/UpsertDoctor
   ↓
8. Response received
   ↓
9. onSuccess callback
   ↓
10. invalidateQueries(["doctors"]) - Refresh doctors list
   ↓
11. useDoctors() auto-refetches
   ↓
12. UI updates with new doctor
```

---

## 🎯 Key Features

### **Axios (HTTP Client)**
- ✅ Auto-adds JWT token from localStorage
- ✅ Centralized error handling (401 → auto-logout)
- ✅ Request/response interceptors
- ✅ Better error messages

### **React Query (State Management)**
- ✅ Automatic caching (1 minute stale time)
- ✅ Auto-refetch on window focus
- ✅ Loading/error states built-in
- ✅ Cache invalidation (auto-refresh after mutation)
- ✅ Optimistic updates support
- ✅ React Query Devtools included

---

## 🛠️ Configuration

### **Axios Base URL**
Located in `src/lib/axiosClient.js`:

```javascript
const axiosClient = axios.create({
    baseURL: "https://orthosquareportal.com/ManagementApi",
});
```

### **React Query Settings**
Located in `src/hooks/useDoctors.js`:

```javascript
{
  staleTime: 1 * 60 * 1000,  // 1 minute
  retry: 1,                   // Retry once on failure
}
```

---

## 📊 Available Hooks

### **Query Hooks (GET)**

```javascript
// Fetch all doctors
const { data, isLoading, error } = useDoctors();

// Fetch doctors with filters
const { data } = useDoctors({ ClinicID: 1 });

// Fetch single doctor
const { data } = useDoctor(doctorId);
```

### **Mutation Hooks (POST/DELETE)**

```javascript
// Add/update doctor
const upsertMutation = useUpsertDoctor();
upsertMutation.mutate(formData);

// Delete doctor
const deleteMutation = useDeleteDoctor();
deleteMutation.mutate(doctorId);
```

---

## 🔍 Testing

### **Check Token**
```javascript
// In browser console
localStorage.getItem("token")
```

### **Check Network Request**
1. Open DevTools → Network tab
2. Submit form
3. Look for request to `/DoctorRegistration/UpsertDoctor`
4. Check request headers for `Authorization: Bearer ...`

### **Check React Query Cache**
1. Look for React Query Devtools panel at bottom of page
2. Click to expand
3. View cached queries and mutations

---

## 📝 Next Steps

To implement for other modules (Patients, Leads, etc.):

1. **Create API Service:** `src/api/[module].api.js`
   ```javascript
   export const upsertPatient = async (data) => {
     const response = await axiosClient.post("/Patient/Upsert", data);
     return response.data;
   };
   ```

2. **Create Hooks:** `src/hooks/use[Module].js`
   ```javascript
   export const usePatients = () => {
     return useQuery({
       queryKey: ["patients"],
       queryFn: getAllPatients,
     });
   };
   ```

3. **Use in Component:**
   ```javascript
   const { data: patients } = usePatients();
   const upsertMutation = useUpsertPatient();
   ```

---

## 🎓 Resources

- **Complete Guide:** `AXIOS_REACT_QUERY_GUIDE.md`
- **Example Component:** `src/app/doctor/doctor-registration-new/page.js`
- **API Service:** `src/api/doctor.api.js`
- **Hooks:** `src/hooks/useDoctors.js`, `src/hooks/useDoctorMutations.js`

---

## ⚡ Quick Reference

### **Import Statements**
```javascript
import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";
```

### **Fetch Data**
```javascript
const { data, isLoading, error, refetch } = useDoctors();
```

### **Submit Data**
```javascript
const mutation = useUpsertDoctor();
mutation.mutate(formData, {
  onSuccess: (data) => console.log("Success:", data),
  onError: (error) => console.error("Error:", error),
});
```

### **Check States**
```javascript
{isLoading && <Spinner />}
{error && <Error message={error.message} />}
{mutation.isPending && <p>Saving...</p>}
{mutation.isSuccess && <p>Saved!</p>}
```

---

**🎉 You're all set! Start using Axios + React Query for cleaner, more efficient API integration!**
