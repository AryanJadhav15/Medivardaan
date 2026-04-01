import { NextResponse } from 'next/server';
import axiosClient from '@/api/client';
import { authService } from '@/api/auth';

export async function DELETE(request) {
  try {
    const urlObj = new URL(request.url);
    const enquiryId = urlObj.searchParams.get('enquiryId');

    if (!enquiryId) {
      return NextResponse.json({ error: 'enquiryId is required' }, { status: 400 });
    }

    let authHeader = request.headers.get('authorization');
    if (!authHeader) {
      const token = await authService.getToken();
      authHeader = `Bearer ${token}`;
    }

    const requestConfig = {
      headers: {
        'Authorization': authHeader
      }
    };

    // Use the proxy/axiosClient to call the external API
    const response = await axiosClient.delete(`/Leads/DeleteEnquiry?enquiryId=${enquiryId}`, requestConfig);
    
    const data = response.data || response;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting lead:', error.message);
    
    if (error.response) {
      return NextResponse.json(
        { error: 'External API Error', details: error.response.data },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete lead', details: error.message },
      { status: 500 }
    );
  }
}
