# 🚀 Quick Start: Doctor Registration with Axios + React Query

## ⚡ 3-Step Integration

### **Step 1: Import the Hooks**

```javascript
"use client";

import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";
```

---

### **Step 2: Use in Component**

```javascript
export default function DoctorPage() {
  const [formData, setFormData] = useState({
    clinicName: "panvel",
    firstName: "",
    lastName: "",
    mobileNo1: "",
    email: "",
    inTime: "",
    outTime: "",
    panCardNo: "",
    registrationNo: "",
    indemnityPolicyNo: "",
  });

  // Fetch doctors list
  const { data: doctors = [], isLoading, error } = useDoctors();

  // Mutation for adding doctor
  const upsertMutation = useUpsertDoctor();

  const handleSubmit = () => {
    upsertMutation.mutate(formData, {
      onSuccess: (data) => {
        alert(`Doctor added! ID: ${data.doctorID}`);
        setFormData({ /* reset form */ });
      },
      onError: (error) => {
        alert(`Failed: ${error.message}`);
      },
    });
  };

  return (
    <div>
      {/* Form */}
      <input
        value={formData.firstName}
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={upsertMutation.isPending}
      >
        {upsertMutation.isPending ? "Saving..." : "Save Doctor"}
      </button>

      {/* Loading State */}
      {isLoading && <p>Loading doctors...</p>}

      {/* Error State */}
      {error && <p>Error: {error.message}</p>}

      {/* Doctors List */}
      {doctors.map(doctor => (
        <div key={doctor.srNo}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

---

### **Step 3: That's It!**

React Query automatically:
- ✅ Caches the doctors list
- ✅ Manages loading states
- ✅ Handles errors
- ✅ Refetches after mutation
- ✅ Updates UI automatically

Axios automatically:
- ✅ Adds JWT token from localStorage
- ✅ Handles 401 errors (auto-logout)
- ✅ Transforms requests/responses

---

## 📝 Complete Minimal Example

```javascript
"use client";

import { useState } from "react";
import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";

export default function SimpleDoctorForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo1, setMobileNo1] = useState("");

  const { data: doctors = [], isLoading } = useDoctors();
  const upsertMutation = useUpsertDoctor();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      clinicName: "panvel",
      firstName,
      lastName,
      email,
      mobileNo1,
      inTime: "09:00",
      outTime: "17:00",
      panCardNo: "TEMP123",
      registrationNo: "REG123",
      indemnityPolicyNo: "IND123",
    };

    upsertMutation.mutate(formData, {
      onSuccess: () => {
        alert("Doctor added successfully!");
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobileNo1("");
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          placeholder="Mobile Number"
          value={mobileNo1}
          onChange={(e) => setMobileNo1(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          disabled={upsertMutation.isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {upsertMutation.isPending ? "Saving..." : "Add Doctor"}
        </button>

        {upsertMutation.isError && (
          <p className="text-red-600">Error: {upsertMutation.error.message}</p>
        )}

        {upsertMutation.isSuccess && (
          <p className="text-green-600">Doctor added successfully!</p>
        )}
      </form>

      {/* Doctors List */}
      <h2 className="text-xl font-bold mb-4">Doctors List</h2>

      {isLoading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="space-y-2">
          {doctors.map((doctor) => (
            <div key={doctor.srNo} className="border p-3 rounded">
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.emailId}</p>
              <p className="text-sm text-gray-600">{doctor.mobileNo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 What Happens Behind the Scenes

### **When Component Mounts:**
1. `useDoctors()` fires
2. Checks React Query cache
3. If no cache, calls `getAllDoctors()` API
4. Axios adds Authorization header automatically
5. Data cached for 1 minute
6. Component re-renders with data

### **When Form is Submitted:**
1. `upsertMutation.mutate(formData)` is called
2. `transformFormDataToAPI()` transforms data
3. `upsertDoctor()` calls API via Axios
4. Axios adds Authorization header
5. On success:
   - `onSuccess` callback fires
   - `queryClient.invalidateQueries(["doctors"])` fires
   - Doctors list auto-refetches
   - UI updates automatically

---

## 🔍 Available States

### **Query States (useDoctors)**
```javascript
const {
  data,           // Array of doctors
  isLoading,      // Initial loading
  isFetching,     // Background refetch
  error,          // Error object
  refetch,        // Manual refetch function
} = useDoctors();
```

### **Mutation States (useUpsertDoctor)**
```javascript
const {
  mutate,         // Function to call
  isPending,      // Is submitting
  isSuccess,      // Mutation succeeded
  isError,        // Mutation failed
  error,          // Error object
  data,           // Response data
  reset,          // Reset mutation state
} = useUpsertDoctor();
```

---

## 🎨 UI State Examples

### **Loading State**
```javascript
{isLoading && (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Loading doctors...</span>
  </div>
)}
```

### **Error State**
```javascript
{error && (
  <div className="bg-red-50 border border-red-200 p-4 rounded">
    <p className="text-red-800">Error: {error.message}</p>
    <button onClick={() => refetch()}>Retry</button>
  </div>
)}
```

### **Empty State**
```javascript
{!isLoading && doctors.length === 0 && (
  <p className="text-gray-500">No doctors found</p>
)}
```

### **Success State**
```javascript
{upsertMutation.isSuccess && (
  <div className="bg-green-50 border border-green-200 p-4 rounded">
    <p className="text-green-800">Doctor added successfully!</p>
  </div>
)}
```

### **Submitting State**
```javascript
<button disabled={upsertMutation.isPending}>
  {upsertMutation.isPending ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Saving...
    </>
  ) : (
    "Save Doctor"
  )}
</button>
```

---

## 📊 Data Format

### **Form Data (Input)**
```javascript
{
  clinicName: "panvel",        // Will be converted to clinicID: 1
  doctorType: "full-time",     // Will be converted to doctorTypeID: 1
  firstName: "John",
  lastName: "Doe",
  mobileNo1: "1234567890",
  email: "john@example.com",
  // ... other fields
}
```

### **API Data (Auto-transformed)**
```javascript
{
  mode: "1",
  doctorID: null,
  clinicID: 1,
  doctorTypeID: 1,
  firstName: "John",
  lastName: "Doe",
  phoneNo1: "1234567890",
  emailid: "john@example.com",
  // ... other fields
}
```

### **Response Data**
```javascript
{
  doctorID: 123,
  success: true
}
```

---

## ✅ Checklist

Before using, make sure:

- ✅ JWT token exists in localStorage (login first)
- ✅ `src/lib/axiosClient.js` has correct BASE_URL
- ✅ React Query provider is set up in `src/app/providers.js`
- ✅ All mandatory fields are filled

---

## 🐛 Troubleshooting

### **"401 Unauthorized" Error**
```
Solution: Login first to get JWT token
Check: localStorage.getItem("token")
```

### **"Network Error"**
```
Solution: Check if API URL is correct
Check: src/lib/axiosClient.js baseURL
```

### **"Mutation not refetching list"**
```
Solution: queryKey must match in both hooks
Check: queryKey: ["doctors"] in both files
```

### **"Data not transforming"**
```
Solution: Check transformFormDataToAPI function
Check: src/utils/doctorTransformers.js
```

---

## 🎉 That's All!

Now you can use Axios + React Query for any API integration!

**Next:** Read `AXIOS_REACT_QUERY_GUIDE.md` for advanced features like optimistic updates, pagination, and more.
