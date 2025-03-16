import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const serverTime = new Date().toISOString();
    return NextResponse.json({ 
        success: true, 
        message: "Server Time fetched successfully!",
        data: serverTime
    });
  } catch (error) {
    return NextResponse.json({ 
        success: false, 
        message: `Internal Server Error: ${error}` 
    }, { status: 500 });
  }
}