import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/api/config';
import { authService } from '@/api/auth';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function POST(request) {
  try {
    const patientData = await request.json();

    // Get authentication token
    const token = await authService.getToken();

    // Confirmed endpoint: https://bmetrics.in/APIDemo/api/Patient/UpsertPatient
    // Returns HTTP 204 No Content on success
    const url = `${BASE_URL}/Patient/UpsertPatient`;

    console.log('[Patient Upsert] Posting to:', url);
    console.log('[Patient Upsert] Payload:', JSON.stringify(patientData, null, 2));

    const response = await axios.post(url, patientData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'text/plain',
      },
      // Allow 204 No Content as a valid success response
      validateStatus: (status) => status >= 200 && status < 300,
    });

    console.log('[Patient Upsert] Success. Status:', response.status);

    // 204 = No Content — return a success JSON to the frontend
    if (response.status === 204 || !response.data) {
      return NextResponse.json({ success: true, message: 'Patient registered successfully.' });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    const upstreamStatus = error?.response?.status;
    const upstreamData = error?.response?.data;

    console.error('[Patient Upsert] Error. Status:', upstreamStatus);
    console.error('[Patient Upsert] Upstream response:', JSON.stringify(upstreamData, null, 2));
    console.error('[Patient Upsert] Message:', error.message);

    return NextResponse.json(
      {
        error: 'Failed to upsert patient',
        details: upstreamData || error.message,
      },
      { status: upstreamStatus || 500 }
    );
  }
}

