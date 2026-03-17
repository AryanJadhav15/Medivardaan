# API Directory Structure

This directory contains **client-side API services** and **mock data** for the MediVardan application.

> **Note**: Next.js API route handlers live in `src/app/api/` (required by Next.js framework).

## Directory Structure

```
src/
├── api/                     # Client-side API services & mocks
│   ├── client/              # Axios-based API service functions
│   │   ├── accounts.js      # Account operations
│   │   ├── auth.js          # Authentication hooks
│   │   ├── common.js        # Common/shared services
│   │   ├── dashboard.js     # Dashboard data fetching
│   │   ├── dashboardCount.js # Dashboard metrics
│   │   ├── dashboardCount.js # Dashboard metrics
│   │   ├── getUser.js       # User information retrieval
│   │   ├── invoices.js      # Invoice operations
│   │   ├── menu.js          # Menu/navigation services
│   │   ├── parameterType.js # Parameter type definitions
│   │   ├── patients.js      # Patient management (CRUD)
│   │   ├── reports.js       # Report generation
│   │   └── index.js         # Barrel export file
│   │
│   ├── doctor/              # Doctor domain services
│   │   ├── index.js         # Main doctor API exports
│   │   └── transformers.js  # Data transformation utilities
│   │
│   ├── mocks/               # Mock data and fallback storage
│   │   ├── doctors.js       # Doctor mock data & CRUD
│   │   └── leads.js         # Lead mock data & CRUD
│   │
│   └── shared/              # Shared utilities (future use)
│
└── app/
    └── api/                 # Next.js API route handlers (server endpoints)
        ├── auth/            # Authentication endpoints
        │   └── login/route.js
        ├── doctors/         # Doctor endpoints
        │   ├── route.js     # GET /api/doctors
        │   ├── mock/route.js
        │   └── upsert/route.js
        └── Leads/           # Lead endpoints
            ├── getLeads/route.js
            └── upsertLeads/route.js
```

## Usage

### Importing Client Services

You can import API services in two ways:

**Option 1: Direct import from specific file**

```javascript
import { getAllDoctors, upsertDoctor } from "@/api/client/doctors";
import { reportsService } from "@/api/client/reports";
```

**Option 2: Import from barrel export (recommended)**

```javascript
import { getAllDoctors, upsertDoctor, reportsService } from "@/api/client";
```

### Client Services (`client/`)

These are **Axios-based service functions** that React components use to make HTTP requests. They provide:

- Clean abstraction over API calls
- Error handling
- Response transformation
- TypeScript-friendly interfaces (if using TS)

**Example:**

```javascript
// In your React component or hook
import { getAllDoctors } from "@/api/client/doctors";

const doctors = await getAllDoctors({ ClinicID: 1 });
```

### Next.js API Routes (`src/app/api/`)

Next.js **requires** API route handlers to be in `src/app/api/` to function as HTTP endpoints. These are server-side routes that:

- Act as middleware between frontend and external backend
- Handle authentication tokens
- Provide mock data fallback
- Implement request/response logging

**Note**: These files must stay in `src/app/api/` per Next.js App Router framework requirements.

### Mock Data (`mocks/`)

Mock data provides:

- **Fallback support** when external API is unavailable
- **Development mode** testing without backend
- **In-memory storage** for rapid prototyping

**Available Mocks:**

- `doctors.js` - Doctor CRUD operations with sample data
- `leads.js` - Lead CRUD operations with sample data

**Example:**

```javascript
import { getMockDoctors, addMockDoctor } from "@/api/mocks/doctors";

// Get all mock doctors
const doctors = getMockDoctors({ ClinicID: 1 });

// Add a new mock doctor
const newDoctor = addMockDoctor(doctorData);
```

## Architecture Flow

```
React Component
    ↓ imports & calls
@/api/client/* (Axios service functions)
    ↓ HTTP request to
/app/api/* (Next.js route handlers)
    ↓ proxies to
External Backend API (bmetrics.in)
    ↓ if fails & mock enabled
@/api/mocks/* (Mock fallback data)
```

## Why Two API Folders?

**`src/api/`** (This directory)

- Client-side services that React components import
- Mock data for development/fallback
- Shared utilities

**`src/app/api/`** (Required by Next.js)

- Server-side route handlers (HTTP endpoints)
- Must be in this location for Next.js routing to work
- Acts as middleware/proxy to external backend

## Benefits of This Structure

1. **Clear Separation** - Client code (`src/api/`) vs Server routes (`src/app/api/`)
2. **Framework Compliance** - Follows Next.js App Router conventions
3. **Easy to Navigate** - Developers know exactly where to look
4. **Better Imports** - Shorter, cleaner import paths via barrel exports
5. **Maintainable** - Related functionality grouped together
6. **Scalable** - Easy to add new services or endpoints

## Migration Notes

All imports have been updated from:

- `@/api/doctor.api` → `@/api/client/doctors`
- `@/api/patient.service` → `@/api/client/patients`
- `@/api/invoice.api` → `@/api/client/invoices`
- `@/api/reports.service` → `@/api/client/reports`
- etc.

The old scattered API files have been consolidated and removed.
