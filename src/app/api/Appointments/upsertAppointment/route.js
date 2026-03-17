import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/api/config';
import { authService } from '@/api/auth';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Upserting appointment with data:', JSON.stringify(body, null, 2));

    // Get Auth Token
    let token;
    try {
        token = await authService.getToken();
    } catch (authError) {
        console.error('Failed to get auth token:', authError);
        return NextResponse.json(
            { error: 'Authentication failed', details: authError.message },
            { status: 401 }
        );
    }

    const { BASE_URL } = API_CONFIG;
    // Assuming the endpoint for upserting appointments is /Appointment/UpsertAppointment based on previous code
    const endpoint = '/Appointment/UpsertAppointment';
    const apiUrl = `${BASE_URL}${endpoint}`;
    
    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    // Handle 401 - Refresh Token and Retry
    if (response.status === 401) {
        console.log('Received 401, clearing token cache and retrying...');
        authService.clearToken();
        try {
            token = await authService.getToken();
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        } catch (retryError) {
             console.error('Retry failed:', retryError);
             return NextResponse.json(
                { error: 'Authentication retry failed', details: retryError.message },
                { status: 401 }
            );
        }
    }

    console.log('Upsert response status:', response.status);
    
    // Attempt to parse response
    const text = await response.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        // If not JSON, it might be a plain text ID or success message
        data = { message: text, success: response.ok };
    }

    if (!response.ok) {
        console.error('External API Error:', response.status, text);
        return NextResponse.json(
            { error: `External API Error: ${response.status}`, details: data },
            { status: response.status }
        );
    }
    
    console.log('Appointment upsert successful, data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error upserting appointment:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upsert appointment',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
