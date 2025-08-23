import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, message } = body;

    const API_KEY = process.env.TEXTBEE_API_KEY;
    const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

    if (!API_KEY || !DEVICE_ID) {
      return NextResponse.json({ error: 'Missing TextBee credentials' }, { status: 500 });
    }

    const response = await axios.post(
      `https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`,
      { recipients, message },
      { headers: { 'x-api-key': API_KEY } }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
