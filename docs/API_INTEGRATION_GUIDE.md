# API Integration Guide

## Current Setup

Your application has API integration in the following folders:

### 1. Backend API Routes (Next.js API Routes)
**Location:** `src/app/api/`

These Next.js API routes act as a middleware layer between your frontend and external APIs.

```
src/app/api/
├── auth/
│   └── login/
│       └── route.js          # Authentication endpoint
├── doctors/
│   ├── route.js              # GET /api/doctors (fetch all doctors)
│   ├── mock/
│   │   └── route.js          # Mock data fallback
│   └── upsert/
│       └── route.js          # POST /api/doctors/upsert (add/update doctor)
```

### 2. Service Layer (Frontend API Calls)
**Location:** `src/services/`

Service files contain reusable functions that components call to interact with APIs.

```
src/services/
└── doctorApi.js              # Doctor-related API functions
```

### 3. Component Layer (UI)
**Location:** `src/app/doctor/doctor-registration/`

Components use the service layer to fetch and display data.

## How It Works

```
┌─────────────────┐
│   Component     │ (page.js)
│  (UI Layer)     │
└────────┬────────┘
         │ calls getAllDoctors()
         ↓
┌─────────────────┐
│ Service Layer   │ (doctorApi.js)
│  (Business)     │
└────────┬────────┘
         │ fetch('/api/doctors')
         ↓
┌─────────────────┐
│ Next.js API     │ (route.js)
│  (Middleware)   │
└────────┬────────┘
         │
         ├─→ External API (if working)
         │   https://bmetrics.in/APIDemo/api
         │
         └─→ Mock API (fallback)
             /api/doctors/mock
```

## Mock Data Fallback

Due to the external API currently returning 500 errors, a **mock data fallback** has been implemented.

### Enabling/Disabling Mock Fallback

Edit `src/app/api/doctors/route.js`:

```javascript
// Set to true to use mock data when external API fails
// Set to false to always return errors when external API fails
const USE_MOCK_FALLBACK = true;
```

### Mock Data Location

Mock doctor data is stored in:
- `src/app/api/doctors/mockStorage.js` - Shared storage that persists during the session
- `src/app/api/doctors/mock/route.js` - GET endpoint that reads from storage
- `src/app/api/doctors/upsert/route.js` - POST endpoint that writes to storage

**How it works:**
- When you add a doctor in mock mode, it's stored in `mockStorage.js`
- The doctor will appear in the list immediately
- Data persists until you restart the dev server
- Changes are NOT saved to the external database

You can edit `mockStorage.js` to add more default sample doctors.

## Adding New API Endpoints

To add a new API endpoint (e.g., for patients):

### Step 1: Create Backend Route
Create `src/app/api/patients/route.js`:

```javascript
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Your logic here
  return NextResponse.json({ data: [] });
}

export async function POST(request) {
  const body = await request.json();
  // Your logic here
  return NextResponse.json({ success: true });
}
```

### Step 2: Create Service Layer
Create `src/services/patientApi.js`:

```javascript
const API_BASE_URL = "/api/patients";

export const getAllPatients = async () => {
  const response = await fetch(API_BASE_URL);
  const data = await response.json();
  return data;
};
```

### Step 3: Use in Component
In your component:

```javascript
import { getAllPatients } from '@/services/patientApi';

const MyComponent = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPatients();
      setPatients(data);
    };
    fetchData();
  }, []);

  // ... rest of component
};
```

## External API Information

**Base URL:** `https://bmetrics.in/APIDemo/api`

**Swagger Documentation:** https://bmetrics.in/APIDemo/swagger/index.html

**Authentication:**
- Endpoint: `/api/Auth/Login`
- Method: POST
- Credentials stored in: `src/app/api/doctors/route.js`

**Current Status:** ⚠️ The external API is returning 500 errors. Using mock data fallback.

## Troubleshooting

### "Using Mock Data" Warning
This means the external API is unavailable. The app is using sample data from `/api/doctors/mock`.

**Solutions:**
1. Contact the external API administrator about the 500 error
2. Wait for them to fix their server
3. Use mock data for development (current setup)

### To Disable Mock Fallback
Set `USE_MOCK_FALLBACK = false` in `src/app/api/doctors/route.js`

### To Test External API Directly
```bash
# Test authentication
curl -X POST "https://bmetrics.in/APIDemo/api/Auth/Login" \
  -H "Content-Type: application/json" \
  -d '{"userId":"Admin","userPassword":"#Ortho#$Admin"}'

# Test GetAllDoctors (requires token from above)
curl -X GET "https://bmetrics.in/APIDemo/api/DoctorRegistration/GetAllDoctors" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Summary

✅ **API integration is in the correct folders**
✅ **Mock data fallback is working**
✅ **Error handling is improved**
⚠️ **External API needs fixing by their team**

You can continue developing with mock data until the external API is fixed.
