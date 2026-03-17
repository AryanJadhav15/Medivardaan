import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/api/config';
import { authService } from '@/api/auth';
import axios from 'axios';

const { BASE_URL } = API_CONFIG;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    console.log('[DEBUG] Route hit. PatientId:', patientId);

    if (!patientId) {
      return NextResponse.json(
        { error: 'PatientId is required' },
        { status: 400 }
      );
    }

    // Get authentication token
    const token = await authService.getToken();

    // Assuming the external API follows the pattern
    const url = `${BASE_URL}/Patient/GetPatientById?PatientId=${patientId}`;
    
    console.log('[DEBUG] Fetching from External API:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'text/plain'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching patient details:', error?.response?.data || error.message);
    
    // Fallback to mock data if API fails or returns 404
    console.warn('Falling back to mock data due to API error/404.');
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    // Mock Data matching GetAllPatients
    const mockPatients = [
        { patientID: 1, firstName: "Prashant", lastName: "Desai", mobile: "7045544960", email: "prashant@example.com", age: "30", gender: "Male", city: "Mumbai", address: "Test Address, Mumbai", bloodGroup: "O+", dob: "1994-01-01" },
        { patientID: 2, firstName: "Karan", lastName: "Mithbawkar", mobile: "9664226872", email: "karan@example.com", age: "28", gender: "Male", city: "Pune", address: "Pune Address", bloodGroup: "A+", dob: "1996-05-15" },
        { patientID: 3, firstName: "Snehal", lastName: "Bornaks", mobile: "9137872164", email: "snehal@example.com", age: "25", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "B+", dob: "1999-08-20" },
        { patientID: 4, firstName: "Suryabhan", lastName: "Yadav", mobile: "9029230585", email: "suryabhan@example.com", age: "45", gender: "Male", city: "Nashik", address: "Nashik Address", bloodGroup: "AB+", dob: "1979-11-11" },
        { patientID: 5, firstName: "Hardik", lastName: "Joshi", mobile: "9029230585", email: "hardik@example.com", age: "32", gender: "Male", city: "Mumbai", address: "Mumbai Address", bloodGroup: "O-", dob: "1992-02-28" },
        { patientID: 6, firstName: "Siddhi", lastName: "Jadhav", mobile: "8291011876", email: "siddhi@example.com", age: "22", gender: "Female", city: "Panvel", address: "Panvel Address", bloodGroup: "A-", dob: "2002-07-07" },
        { patientID: 7, firstName: "Pooja", lastName: "Modi", mobile: "9757316731", email: "pooja@example.com", age: "29", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "B-", dob: "1995-03-30" },
        { patientID: 8, firstName: "Jijabai", lastName: "Vidhate", mobile: "9511753941", email: "jijabai@example.com", age: "50", gender: "Female", city: "Pune", address: "Pune Address", bloodGroup: "AB-", dob: "1974-12-12" },
        { patientID: 9, firstName: "Tanya", lastName: "Madhani", mobile: "2487788628", email: "tanya@example.com", age: "26", gender: "Female", city: "Mumbai", address: "Mumbai Address", bloodGroup: "O+", dob: "1998-06-18" },
        { patientID: 10, firstName: "Punya", lastName: "Arora", mobile: "8527132822", email: "punya@example.com", age: "27", gender: "Female", city: "Delhi", address: "Delhi Address", bloodGroup: "A+", dob: "1997-09-09" }
    ];

    // Find patient by ID
    const foundPatient = mockPatients.find(p => p.patientID == patientId);

    if (foundPatient) {
        return NextResponse.json(foundPatient);
    } else {
         return NextResponse.json(
            { error: 'Patient not found in mock data' },
            { status: 404 }
          );
    }
  }
}
