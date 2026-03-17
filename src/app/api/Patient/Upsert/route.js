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

    // Target external API - guessing pattern matches Doctor (/DoctorRegistration/UpsertDoctor)
    const url = `${BASE_URL}/PatientRegistration/UpsertPatient`;
    
    console.log('Upserting patient to:', url);
    console.log('Payload:', JSON.stringify(patientData, null, 2));

    const response = await axios.post(url, patientData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error upserting patient:', error?.response?.data || error.message);
    
    return NextResponse.json(
      {
        error: 'Failed to upsert patient',
        details: error?.response?.data || error.message
      },
      { status: error?.response?.status || 500 }
    );
  }
}
