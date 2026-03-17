# Axios + React Query Integration Guide for Doctor Registration

This guide explains how to integrate API endpoints using **Axios** and **React Query** in the MEDIVARDAAN project.

---

## 📁 File Structure

```
src/
├── api/
│   └── doctor.api.js                    # Axios API calls
├── hooks/
│   ├── useDoctors.js                    # React Query GET hooks
│   └── useDoctorMutations.js            # React Query POST/PUT/DELETE hooks
├── lib/
│   └── axiosClient.js                   # Axios configuration with interceptors
├── utils/
│   └── doctorTransformers.js            # Data transformation utilities
└── app/
    └── doctor/
        └── doctor-registration-new/
            └── page.js                  # Component using the hooks
```

---

## 🔧 Step-by-Step Implementation

### **Step 1: Axios Client Configuration**

**File:** `src/lib/axiosClient.js`

```javascript
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://orthosquareportal.com/ManagementApi",
});

// Request Interceptor: Add JWT token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto-logout on 401
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
```

**Features:**
- ✅ Auto-adds JWT token from localStorage
- ✅ Centralized error handling
- ✅ Auto-logout on 401 Unauthorized

---

### **Step 2: Create API Service**

**File:** `src/api/doctor.api.js`

```javascript
import axiosClient from "@/lib/axiosClient";

/**
 * Add or update a doctor
 * Endpoint: POST /DoctorRegistration/UpsertDoctor
 */
export const upsertDoctor = async (doctorData) => {
  try {
    const response = await axiosClient.post(
      "/DoctorRegistration/UpsertDoctor",
      doctorData
    );

    // Handle different response formats
    const data = response.data;

    if (typeof data === 'number') {
      return { doctorID: data, success: true };
    }

    return { ...data, success: true };
  } catch (error) {
    console.error("[Doctor API] Error:", error);

    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.error ||
                        error.message ||
                        "Failed to save doctor";

    throw new Error(errorMessage);
  }
};

/**
 * Fetch all doctors
 * Endpoint: GET /DoctorRegistration/GetAllDoctors
 */
export const getAllDoctors = async (params = {}) => {
  const response = await axiosClient.get(
    "/DoctorRegistration/GetAllDoctors",
    { params }
  );
  return response.data;
};
```

---

### **Step 3: Create React Query Hooks**

#### **A. Query Hook (for GET requests)**

**File:** `src/hooks/useDoctors.js`

```javascript
import { useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "@/api/doctor.api";
import { transformAPIDoctorToDisplay } from "@/utils/doctorTransformers";

export const useDoctors = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      const data = await getAllDoctors(filters);

      // Transform data for display
      if (Array.isArray(data)) {
        return data.map((doctor, index) =>
          transformAPIDoctorToDisplay({ ...doctor, srNo: index + 1 })
        );
      }

      return [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
    ...options,
  });
};
```

**Features:**
- ✅ Automatic caching
- ✅ Auto-refetch on window focus
- ✅ Data transformation
- ✅ Loading and error states

---

#### **B. Mutation Hook (for POST requests)**

**File:** `src/hooks/useDoctorMutations.js`

```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertDoctor } from "@/api/doctor.api";
import { transformFormDataToAPI } from "@/utils/doctorTransformers";

export const useUpsertDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      console.log("[useUpsertDoctor] Submitting:", apiData);

      // Call API
      return await upsertDoctor(apiData);
    },
    onSuccess: (data) => {
      console.log("[useUpsertDoctor] Success:", data);

      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error) => {
      console.error("[useUpsertDoctor] Error:", error);
    },
  });
};
```

**Features:**
- ✅ Auto-invalidates cache on success
- ✅ Transforms form data to API format
- ✅ Loading, error, and success states
- ✅ Optimistic updates support

---

### **Step 4: Use in Component**

**File:** `src/app/doctor/doctor-registration-new/page.js`

```javascript
"use client";

import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor } from "@/hooks/useDoctorMutations";

export default function DoctorRegistrationPage() {
  // Fetch doctors list
  const { data: doctors = [], isLoading, error, refetch } = useDoctors();

  // Mutation for adding/updating doctors
  const upsertMutation = useUpsertDoctor();

  const handleSubmit = async () => {
    // Submit using mutation
    upsertMutation.mutate(formData, {
      onSuccess: (data) => {
        alert(`Doctor added! ID: ${data.doctorID}`);
        // Doctors list auto-refetches due to invalidateQueries
      },
      onError: (error) => {
        alert(`Failed: ${error.message}`);
      },
    });
  };

  return (
    <div>
      {/* Loading state */}
      {isLoading && <p>Loading doctors...</p>}

      {/* Error state */}
      {error && <p>Error: {error.message}</p>}

      {/* Submitting state */}
      <button
        onClick={handleSubmit}
        disabled={upsertMutation.isPending}
      >
        {upsertMutation.isPending ? "Submitting..." : "Submit"}
      </button>

      {/* Success state */}
      {upsertMutation.isSuccess && <p>Doctor saved successfully!</p>}

      {/* Doctors table */}
      {doctors.map(doctor => (
        <div key={doctor.srNo}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎯 Key Benefits of Axios + React Query

### **1. Axios Benefits**
✅ **Interceptors** - Global request/response handling
✅ **Auto-authentication** - Token added automatically
✅ **Error handling** - Centralized error management
✅ **Request cancellation** - Built-in AbortController support
✅ **Better error messages** - Detailed error information

### **2. React Query Benefits**
✅ **Automatic caching** - Reduces unnecessary API calls
✅ **Background refetching** - Keeps data fresh
✅ **Loading states** - `isLoading`, `isPending` built-in
✅ **Error retry** - Automatic retry on failure
✅ **Optimistic updates** - Update UI before API responds
✅ **Cache invalidation** - Auto-refetch related data
✅ **Devtools** - React Query Devtools for debugging

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  Component (page.js)                    │
│  - Click Submit                         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  useDoctorMutations Hook                │
│  - transformFormDataToAPI(formData)     │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  doctor.api.js                          │
│  - upsertDoctor(apiData)                │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  axiosClient                            │
│  - Add Authorization header             │
│  - POST request                         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  External API                           │
│  POST /DoctorRegistration/UpsertDoctor  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Response                               │
│  - Success: { doctorID: 123 }           │
│  - Error: { message: "..." }            │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  React Query Mutation                   │
│  - onSuccess: invalidateQueries         │
│  - Auto-refetch doctors list            │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Component Updates                      │
│  - Show success message                 │
│  - Reset form                           │
│  - Display updated doctors list         │
└─────────────────────────────────────────┘
```

---

## 🔥 Advanced Features

### **1. Query Invalidation**

```javascript
// In mutation onSuccess
queryClient.invalidateQueries({ queryKey: ["doctors"] });
```

This automatically refetches all queries with key `["doctors"]`.

---

### **2. Optimistic Updates**

```javascript
export const useUpsertDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDoctor,
    onMutate: async (newDoctor) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["doctors"] });

      // Snapshot previous value
      const previousDoctors = queryClient.getQueryData(["doctors"]);

      // Optimistically update
      queryClient.setQueryData(["doctors"], (old) => [...old, newDoctor]);

      // Return context with snapshot
      return { previousDoctors };
    },
    onError: (err, newDoctor, context) => {
      // Rollback on error
      queryClient.setQueryData(["doctors"], context.previousDoctors);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
```

---

### **3. Dependent Queries**

```javascript
export const useDoctorDetails = (doctorId) => {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => getDoctorById(doctorId),
    enabled: !!doctorId, // Only run if doctorId exists
  });
};
```

---

### **4. Pagination**

```javascript
export const useDoctorsPaginated = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["doctors", { page, pageSize }],
    queryFn: () => getAllDoctors({ page, pageSize }),
    keepPreviousData: true, // Keep old data while fetching new
  });
};
```

---

## 🛠️ Error Handling

### **Global Error Handler (Axios)**

```javascript
// In axiosClient.js
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - logout
          localStorage.clear();
          window.location.href = '/';
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
      }
    }
    return Promise.reject(error);
  }
);
```

### **Component-level Error Handling**

```javascript
const { data, isLoading, error, refetch } = useDoctors();

if (error) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

---

## 📝 Testing the Integration

### **1. Test in Browser Console**

```javascript
// Check if token exists
localStorage.getItem("token")

// Check React Query cache
queryClient.getQueryData(["doctors"])
```

### **2. Network Tab**

1. Open DevTools → Network tab
2. Submit doctor form
3. Look for:
   - Request URL: `/DoctorRegistration/UpsertDoctor`
   - Request Headers: `Authorization: Bearer ...`
   - Request Payload: Transformed doctor data
   - Response: `{ doctorID: 123 }`

### **3. React Query Devtools**

Already integrated in `src/app/providers.js`:

```javascript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<ReactQueryDevtools initialIsOpen={false} />
```

---

## 🚀 Migration Checklist

To migrate existing pages to Axios + React Query:

- [ ] Create API service in `src/api/[module].api.js`
- [ ] Create React Query hooks in `src/hooks/use[Module].js`
- [ ] Update component to use hooks
- [ ] Remove old fetch/service calls
- [ ] Test CRUD operations
- [ ] Handle loading/error states
- [ ] Add success notifications

---

## 📚 Complete Example

See the full implementation in:
- **API Service:** `src/api/doctor.api.js`
- **Query Hook:** `src/hooks/useDoctors.js`
- **Mutation Hook:** `src/hooks/useDoctorMutations.js`
- **Component:** `src/app/doctor/doctor-registration-new/page.js`

---

## 🎓 Summary

**Axios** handles:
- HTTP requests
- Authentication
- Error handling
- Request/response transformation

**React Query** handles:
- Caching
- Loading states
- Auto-refetching
- Cache invalidation
- Optimistic updates

**Together they provide:**
- ✅ Clean, maintainable code
- ✅ Better UX (loading states, optimistic updates)
- ✅ Reduced API calls (caching)
- ✅ Centralized error handling
- ✅ Type-safe (with TypeScript/JSDoc)

---

## 🔗 Resources

- **Axios Docs:** https://axios-http.com/docs/intro
- **React Query Docs:** https://tanstack.com/query/latest
- **Axios Interceptors:** https://axios-http.com/docs/interceptors
- **React Query Devtools:** https://tanstack.com/query/latest/docs/devtools

---

**Happy Coding! 🚀**
