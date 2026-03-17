# Medivardaan - Healthcare Management System

A comprehensive dental clinic management and analytics platform built with Next.js 16, featuring the Medivardaan brand identity with teal and blue color scheme.

## Features

### Authentication & Authorization
- **Role-based Access Control**: Admin (Role 1) and Clinic Staff (Role 2)
- **Secure Login**: JWT token-based authentication
- **Auto-redirect**: Based on user role after login

### Admin Dashboard
- **Regional Analytics**: Filter by All, East, West, North, South, Central regions
- **Time Period Filters**: Yesterday, Last 7/30/90/365 Days, All Time
- **Key Metrics**:
  - Total Patients
  - Total Procedures
  - Total Revenue
  - Revenue per Patient
  - Revenue per Procedure
- **Branch Summary Table**: Performance across different locations

### Clinic Dashboard
- **Clinic/Doctor Selection**: Filter by specific clinic and doctor
- **Performance Metrics**: Same comprehensive metrics as admin dashboard
- **Time-based Analysis**: Track performance over different time periods

### Reports System
1. **Clinic-wise Report**: Performance metrics by clinic
2. **Date-wise Report**: Daily financial and operational metrics
3. **Patient-wise Report**: Patient visit and revenue analysis
4. **Treatment-wise Report**: Treatment revenue and lead analysis

### Medical Information System (MIS)
1. **Patient Consultation**:
   - Patient demographics management
   - Vital signs recording
   - Diagnosis documentation
   - Treatment notes
   - Next appointment scheduling

2. **Treatment Updates**:
   - Ongoing treatment tracking
   - Status updates (Completed, Hold, Ongoing, Given to Lab)
   - Detailed procedure documentation

## Tech Stack

### Frontend
- **Next.js 16.0.0** with App Router
- **React 19.0.0**
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library

### State Management
- **Redux Toolkit** for global state
- **Redux Persist** for state persistence
- **TanStack React Query** for server state management

### UI Components
- **Radix UI** primitives
- **Lucide React** icons
- **Recharts** for data visualization
- **TanStack React Table** for advanced tables

### Data & API
- **Axios** for HTTP requests
- REST API integration
- Real-time data fetching with React Query

## Color Theme

The application uses the Medivardaan brand colors:
- **Primary Teal**: `#4DB8AC`
- **Teal Dark**: `#3A9A8F`
- **Secondary Blue**: `#1E6B8C`
- **Blue Dark**: `#154E6B`
- **Blue Light**: `#2887B3`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
medivardaan-app/
├── app/
│   ├── dashboard/
│   │   ├── admin/           # Admin dashboard
│   │   └── clinic/          # Clinic dashboard
│   ├── reports/
│   │   ├── clinic-wise/     # Clinic-wise reports
│   │   ├── date-wise/       # Date-wise reports
│   │   ├── patient-wise/    # Patient-wise reports
│   │   └── treatment-wise/  # Treatment-wise reports
│   ├── MIS/
│   │   ├── consultation/    # Patient consultation
│   │   └── treatment-updates/ # Treatment updates
│   ├── page.js              # Login page
│   ├── layout.js            # Root layout
│   ├── app-layout.js        # App layout with sidebar
│   ├── header.js            # Header component
│   ├── sidebar.js           # Sidebar navigation
│   └── providers.js         # Context providers
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── common/              # Common components
├── hooks/                   # Custom React hooks
├── api/                     # API service layer
├── store/                   # Redux store and slices
├── lib/                     # Utility functions
└── public/                  # Static assets
```

## API Integration

The app connects to the backend API at:
```
https://orthosquareportal.com/ManagementApi
```

### Key Endpoints
- `POST /api/Auth/Login` - User authentication
- `GET /api/Dashboard/GetAllDashboard` - Admin dashboard data
- `GET /api/Dashboard/GetAllClinicDashboard` - Clinic dashboard data
- `GET /api/Report/*` - Various report endpoints
- `GET /api/Clinic/GetClinic` - Clinic list
- `GET /api/Doctor/GetClinicByDoctor` - Doctors by clinic

## Features Implementation

### Authentication Flow
1. User enters credentials on login page
2. System authenticates via API
3. Token and user data stored in Redux & localStorage
4. Auto-redirect based on role:
   - Admin → `/dashboard/admin`
   - Clinic Staff → `/dashboard/clinic`

### Data Fetching Strategy
- **React Query** for server state (automatic caching, refetching)
- **Redux** for UI state (filters, user session)
- **Redux Persist** for persistence across sessions

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for small screens
- Responsive tables and charts
- Optimized for desktop and tablet use

## Security Features
- JWT token authentication
- Protected routes (redirect to login if not authenticated)
- Role-based access control
- Secure API calls with Bearer token
- Automatic logout on 401 errors

## Development Notes

### Custom Hooks
- `useDashboardData` - Dashboard analytics data
- `useClinics` - Clinic and doctor data
- `useMenuData` - Dynamic menu based on role
- `useUser` - Current user information

### Utility Functions
- `formatCurrency` - Indian Rupee formatting
- `formatNumber` - Number formatting with Indian locale
- `formatDate` - Date formatting
- `cn` - Class name merging utility

## Future Enhancements
- Dark mode toggle in header
- Export reports to PDF/Excel
- Advanced charting with Recharts
- Print functionality for consultation
- Real-time notifications
- Multi-language support

## License

Proprietary - Medivardaan Healthcare Solutions

## Support

For issues or questions, please contact the development team.

---

**Powered by Medivardaan Healthcare Solutions**
