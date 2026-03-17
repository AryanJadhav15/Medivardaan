import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(' ', '_');
    
    // In a real app, we would upload to S3/Cloudinary here.
    // For now, we mock a successful upload response.
    console.log(`[Mock Upload] Received file: ${filename}, Size: ${buffer.length} bytes`);

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: `/mock-uploads/${filename}`, // Mock URL
      filename: filename
    });

  } catch (error) {
    console.error('Error occurred ', error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
}
