import { NextResponse } from "next/server";
import { API_CONFIG } from "@/api/config";
import { authService } from "@/api/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const backendParams = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (value) backendParams.append(key, value);
    });

    const token = await authService.getToken();
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR.GET_ALL}${
      backendParams.toString() ? `?${backendParams.toString()}` : ""
    }`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
      cache: "no-store",
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : [];
    } catch {
      data = [];
    }

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
