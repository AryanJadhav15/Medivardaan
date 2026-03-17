import { NextResponse } from 'next/server';
import axiosClient from '@/api/client';

// Flag to enable/disable mock data fallback
const USE_MOCK_FALLBACK = false;

export async function GET(request) {
  try {
    console.log('Fetching patient list...');
    
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Construct payload for potential POST search if needed, or just pass params for GET
    // Based on Leads implementation, we might need a similar strategy, 
    // but for now we'll stick to GET as requested by user command, 
    // but we'll prepare the params object just in case.
    
    const params = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    // Ensure PageSize is passed in multiple formats if API is picky
    if (params.PageSize) {
        params.pageSize = params.PageSize;
    }

    console.log('[DEBUG] Fetching patients with params:', params);
    
    if (USE_MOCK_FALLBACK) {
        throw new Error("Forcing Mock Data");
    }

    // Extract auth header
    const authHeader = request.headers.get('authorization');
    const requestConfig = {
        headers: {
            'Authorization': authHeader
        },
        params: params
    };

    // The user provided curl uses GET, so we use GET.
    console.log('[DEBUG] Outgoing Request URL:', axiosClient.defaults.baseURL + '/Patient/GetAllPatients');
    console.log('[DEBUG] Outgoing Request Headers:', requestConfig.headers);
    console.log('[DEBUG] Outgoing Request Params:', requestConfig.params);
    
    const response = await axiosClient.get('/Patient/GetAllPatients', requestConfig);

    // axiosClient interceptor already unwraps response.data, so response IS the data
    const data = response;
    
    console.log('Patients fetch successful, count:', Array.isArray(data) ? data.length : 'N/A');
    if (Array.isArray(data) && data.length > 0) {
        console.log('[DEBUG] First Patient Record:', JSON.stringify(data[0], null, 2));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching patients:', error.message);
    console.error('[DEBUG] Full Error Object:', error);
    
    // Log full error details
    if (error.response) {
         console.error('[DEBUG] Upstream Response Status:', error.response.status);
         console.error('[DEBUG] Upstream Response Data:', JSON.stringify(error.response.data, null, 2));
         return NextResponse.json(error.response.data, { status: error.response.status });
    }

    return NextResponse.json(
        { message: "Failed to fetch patients", error: error.message, stack: error.stack },
        { status: 500 }
    );
  }
}
