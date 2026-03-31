# API Integration Status Report

Based on a comprehensive scan of the codebase (`src/api`, `src/app`, Next.js routes, and frontend components), here is the current status of the API integration in the MediVardan project.

## 🟢 Fully Integrated & Working
The central integration point has been successfully configured in `src/api/client.js` with the base URL pointing to the live production server (`https://bmetrics.in/APIDemo/api`). The mock fallbacks in API handlers have been explicitly disabled.

The following modules are successfully wired up to call real APIs:
- **Authentication**: Login flow (`/Auth/Login`).
- **Dashboard**: Grouped data and statistics (`/api/Dashboard/...`).
- **Patient Management**: Patient search, registration (Upsert/Create), view by ID, and listing (`/api/Patient/...`).
- **Leads / Enquiries**: Getting leads, upserting leads, and listing follow-ups.
- **Doctors**: Doctor search, registration, and profile fetching.
- **Common & Master Data**: Fetching Clinics, Specialities, Doctor Types, and Menu items.
- **Reports (Base)**: Clinic-wise, treatment-wise, date-wise, and patient-wise reports using `src/api/reports.js`.

---

## 🟡 Partially Integrated & Pending
Some modules have API functions defined in the `src/api/` folder (like `invoices.js`, `accounts.js`), but the UI pages themselves still rely on hardcoded `mockData` arrays for rendering tables, or have explicit TODOs left behind.

### 📝 Pages Currently Utilizing Mock Data (Remaining API Integrations)

**1. Invoice & Billing Pages**
These pages are largely populated by local `mockData` variables:
- `Online Payment Invoice` 
- `Bajaj Scheme Invoice`
- `Cheque Invoice`
- `View Invoice`
- `Payment Collection`
- `Finance Reconciliation`
- `Cancellation Treatment` (Dropdown uses mock doctor data)
- `Upgradation` (Dropdown uses mock doctor data)

**2. Appointments**
- `All Appointments List` (Has an API call but falls back to a massive mock list).
- `Appointments Report`
- `View Today's Confirmed Appointment`

**3. MIS (Management Information System)**
- `Patient Visit Report`
- `Repeat Patient Report`
- `Visitor Page`
- `Consent Page`
- `Consultation Page` (Some mock IDs are used)
- `New Patient Report`
- `Patient Clinic Transfer`

**4. Inventory & Inventory Settings**
- `Request Inventory`
- `Purchase Order Receive Report`
- `View Request Inventory`
- `View Order History`
- `Clinic Request Stock Send Report`
- `Vendor Settings`

**5. Additional Reports & Accounts**
- `Clinic Expense Report`
- `Order History Report`
- `Transaction Report`
- `Cheque Report`
- `Medicines Collection Report`

**6. Misc Pending Tasks Found in Code**
- `Patient Edit / Registration Form`: Image Upload to server is marked as `// TODO: Implement actual image upload to server`. (Even though an API route exists, the components haven't wired it up strictly).
- `Enquiry Followups`: Several doctor assignments are currently hardcoded (e.g., "Dr. MADHU PAWAR", "Dr. pooja kumari").

---

## 🎯 Next Steps Recommendation
To continue the integration process:
1. **Invoices**: Hook up the mock state variables in `src/app/invoice/*` pages to the already defined functions in `src/api/invoices.js`.
2. **Appointments**: Ensure the `/Appointment/...` API endpoints are fully providing data to replace the `mockAppointments` fallback array.
3. **Inventory & MIS**: Create new API service client files in `src/api/` for Inventory and MIS reports, as they heavily rely on hardcoded UI mock data right now.
