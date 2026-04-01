import { NextResponse } from 'next/server';
import { getMockLeads } from '@/api/mocks/leads.js';
import axiosClient from '@/api/client';
import { authService } from '@/api/auth';

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = false; // Changed to false to debug real API

export async function GET(request) {
  try {
    console.log('Fetching leads list...');
    
    // Get query parameters from the request
    const urlObj = new URL(request.url);
    const searchParams = urlObj.searchParams;
    
    // Construct search payload
    const searchPayload = {
      PageSize: searchParams.get('PageSize') || 20,
      PageNumber: searchParams.get('PageNumber') || 1,

      // Map common filters
      Name: searchParams.get('firstName') || searchParams.get('name') || searchParams.get('visitorName'),
      MobileNo: searchParams.get('mobile') || searchParams.get('mobileNo'),
      
      // Pass ClinicID directly if it's a number (handling "all" or empty)
      ClinicID: (searchParams.get('clinic') && searchParams.get('clinic') !== "all") 
        ? Number(searchParams.get('clinic')) 
        : undefined,

      fromDate: searchParams.get('fromDate'),
      toDate: searchParams.get('toDate'),
      
      EnquiryID: searchParams.get('EnquiryID') || searchParams.get('enquiryId'),
      LeadID: searchParams.get('LeadID') || searchParams.get('leadID'),
    };

    console.log('[DEBUG] Mapped payload:', JSON.stringify(searchPayload));

    // Use incoming auth header when present, otherwise fetch a service token.
    // This matches other working API routes and prevents the leads page from
    // failing when the browser token is missing or expired locally.
    let authHeader = request.headers.get('authorization');
    if (!authHeader) {
        const token = await authService.getToken();
        authHeader = `Bearer ${token}`;
        console.log('[DEBUG] Using service token for leads fetch');
    }

    const requestConfig = {
        headers: {
            'Authorization': authHeader
        }
    };

    let response;
    try {
        console.log(`[PERF] Starting External API Call (GET)...`);
        
        const getQueryParams = new URLSearchParams();
        const validBackendKeys = ['PageSize', 'PageNumber', 'Name', 'MobileNo', 'ClinicID', 'EnquiryID', 'LeadID', 'fromDate', 'toDate'];
        
        Object.entries(searchPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && !Number.isNaN(value) && validBackendKeys.includes(key)) {
                getQueryParams.append(key, value);
            }
        });
        
        const getQueryString = getQueryParams.toString();
        console.log(`[DEBUG] Final GET query: ${getQueryString}`);

        const timerLabel = "ExternalAPI_Duration";
        console.time(timerLabel);
        try {
          response = await axiosClient.get(`/Leads/GetAllLeads${getQueryString ? `?${getQueryString}` : ''}`, requestConfig);
        } finally {
          console.timeEnd(timerLabel);
        }

    } catch (error) {
        console.error(`[DEBUG] GET Error: ${error.message}`);
        
        if (error.response) {
            console.error(`[DEBUG] GET Error Status: ${error.response.status}`);
            console.error(`[DEBUG] GET Error Data:`, JSON.stringify(error.response.data));

            if (USE_MOCK_FALLBACK) {
                 const mockLeads = getMockLeads();
                 return NextResponse.json(mockLeads);
            }

            return NextResponse.json(
                 { error: 'External API Error', details: error.response.data },
                 { status: error.response.status }
            );
        }
        throw error;
    }

    const data = response.data || response; // Handle axois unwrap
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    
    if (USE_MOCK_FALLBACK) {
      const mockLeads = getMockLeads();
      return NextResponse.json(mockLeads);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch leads',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
