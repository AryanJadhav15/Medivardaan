# 📁 API Structure Explanation

## Why Two Folders?

Your project has **two API folders** that serve **different purposes**:

---

## 1️⃣ `src/api/` - CLIENT-SIDE CODE

**What it contains:**
- ✅ Axios-based API service functions
- ✅ Mock data for development/fallback
- ✅ Shared utilities

**Used by:** React Components & Hooks

**Purpose:** Provides reusable functions for making API calls

```
src/api/
├── client/          ← Import these in your React components
│   ├── doctors.js
│   ├── patients.js
│   ├── invoices.js
│   └── index.js     ← Barrel export
│
└── mocks/           ← Mock data for fallback
    ├── doctors.js
    └── leads.js
```

**Example Usage:**
```javascript
// In your React component
import { getAllDoctors } from '@/api/client/doctors';

const DoctorList = () => {
  const doctors = await getAllDoctors();
  // ...
}
```

---

## 2️⃣ `src/app/api/` - SERVER-SIDE CODE (Next.js Routes)

**What it contains:**
- ✅ Next.js API route handlers (HTTP endpoints)
- ✅ Server-side middleware/proxy logic
- ✅ Authentication token handling

**Used by:** Next.js framework (automatically creates routes)

**Purpose:** Creates actual HTTP endpoints like `/api/doctors`, `/api/auth/login`

```
src/app/api/
├── auth/
│   └── login/
│       └── route.js      ← Creates: POST /api/auth/login
├── doctors/
│   ├── route.js          ← Creates: GET /api/doctors
│   ├── mock/route.js     ← Creates: GET /api/doctors/mock
│   └── upsert/route.js   ← Creates: POST /api/doctors/upsert
└── Leads/
    ├── getLeads/route.js
    └── upsertLeads/route.js
```

**Why it exists:**
Next.js **requires** API routes to be in `src/app/api/` - this is a framework convention that cannot be changed.

---

## 🔄 How They Work Together

```
┌─────────────────────┐
│  React Component    │
│  (Your UI)          │
└──────────┬──────────┘
           │
           │ imports from
           ↓
┌─────────────────────────┐
│  src/api/client/        │  ← CLIENT-SIDE
│  doctors.js              │
│  (Axios service)         │
└──────────┬──────────────┘
           │
           │ HTTP request (fetch/axios)
           ↓
┌─────────────────────────┐
│  src/app/api/doctors/   │  ← SERVER-SIDE
│  route.js                │     (Next.js endpoint)
│  (Next.js handler)       │
└──────────┬──────────────┘
           │
           │ proxies to
           ↓
┌─────────────────────────┐
│  External Backend API   │
│  (bmetrics.in)          │
└─────────────────────────┘
```

---

## ✅ Key Takeaways

| Folder | Purpose | Used By | Can Move? |
|--------|---------|---------|-----------|
| `src/api/` | Client services & mocks | React components | ✅ Yes |
| `src/app/api/` | Server endpoints | Next.js framework | ❌ No (framework requirement) |

**Bottom Line:**
- Both folders are necessary
- `src/api/` = YOUR client code
- `src/app/api/` = Next.js server routes (framework requirement)
- They work together to create a clean architecture

---

## 📚 More Info

See [src/api/README.md](./src/api/README.md) for detailed usage and examples.
