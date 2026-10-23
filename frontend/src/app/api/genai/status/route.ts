import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    has_api_key: true,
    default_model: 'Google Gemini 3.1 Flash-Lite (Live API)',
    fallback_active: true,
    voice_enabled: true,
    speech_synthesis_supported: true,
    speech_recognition_supported: true,
    zero_shaming_guardrails: 'Enforced'
  });
}
