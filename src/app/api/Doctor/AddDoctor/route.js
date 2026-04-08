import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/api/config';
import { authService } from '@/api/auth';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function POST(request) {
  try {
    const doctorData = await request.json();

    // Get authentication token
    const token = await authService.getToken();

    const url = `${BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR.ADD}`;

    console.log('[Doctor Add] Posting to:', url);
    console.log('[Doctor Add] Payload:', JSON.stringify(doctorData, null, 2));

    const response = await axios.post(url, doctorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Allow any response to propagate
      validateStatus: (status) => true,
    });

    console.log('[Doctor Add] Success. Status:', response.status);

    // If it's a 204 or just empty text like typically expected
    if (response.status === 204 || !response.data) {
      return NextResponse.json({ success: true, doctorID: doctorData.doctorID });
    }

    // Sometimes they just return a numeric ID
    if (typeof response.data === 'number') {
        return NextResponse.json(response.data);
    }
    
    return NextResponse.json(response.data, { status: response.status === 400 ? 400 : 200 });
  } catch (error) {
    const upstreamStatus = error?.response?.status;
    const upstreamData = error?.response?.data;

    console.error('[Doctor Add] Error. Status:', upstreamStatus);
    console.error('[Doctor Add] Message:', error.message);

    return NextResponse.json(
      {
        error: 'Failed to add doctor',
        details: upstreamData || error.message,
      },
      { status: upstreamStatus || 500 }
    );
  }
}
