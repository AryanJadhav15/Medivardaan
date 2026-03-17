import { NextResponse } from 'next/server';
import axiosClient from '@/api/client';
import { authService } from '@/api/auth';

// Flag to enable/disable mock data fallback for UpsertLeads endpoint
// Set to false to always try real API first
const USE_MOCK_FALLBACK = false;

export async function POST(request) {
  try {
    const body = await request.json();
    
    // LOGGING TO FILE FOR DEBUGGING
    try {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'debug_upsert_log.txt');
        const logEntry = `\n\n[${new Date().toISOString()}] Payload:\n${JSON.stringify(body, null, 2)}\n`;
        fs.appendFileSync(logPath, logEntry);
    } catch (err) { console.error('Log file write failed', err); }

    console.log('Upserting lead with data:', JSON.stringify(body, null, 2));

    // Get dynamic token using authService
    // This will handle login if needed
    const token = await authService.getToken();
    let authHeader = `Bearer ${token}`; 
    console.log('[DEBUG] Using AuthService token');

    // Revert to Single Object (User said "nope" to Array)
    const payload = body;

    console.log('[DEBUG] Outgoing Payload Status Fields:', {
        Status: payload.Status,
        status: payload.status,
        PStatus: payload.PStatus,
        PatientStatus: payload.PatientStatus,
        PatientFollowup: payload.PatientFollowup,
        LeadStatus: payload.LeadStatus
    });
    
    console.log('[DEBUG] Outgoing Payload Status Fields:', {
        Status: payload.Status,
        status: payload.status,
        PStatus: payload.PStatus,
        PatientStatus: payload.PatientStatus,
        PatientFollowup: payload.PatientFollowup
    });
    
    console.log('[DEBUG] Outgoing Payload Status Fields:', {
        Status: payload.Status,
        status: payload.status,
        PStatus: payload.PStatus,
        PatientStatus: payload.PatientStatus,
        PatientFollowup: payload.PatientFollowup
    });

    const apiUrl = 'https://bmetrics.in/APIDemo/api/Leads/UpsertLeads';
    


    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    console.log('Upsert response status:', response.status);
    
    // Attempt to parse response
    const text = await response.text();

    // LOG RESPONSE TO FILE
    try {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'debug_upsert_log.txt');
        const logEntry = `[${new Date().toISOString()}] Response (${response.status}):\n${text}\n----------------------------------\n`;
        fs.appendFileSync(logPath, logEntry);
    } catch (err) { }

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
    
    // Handle case where API returns just a number (lead ID)
    if (typeof data === 'number') {
      data = { leadID: data, success: true };
    }
    
    console.log('Lead upsert successful, data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error upserting lead:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to upsert lead',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
