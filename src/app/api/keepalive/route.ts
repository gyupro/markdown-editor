import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json({
        success: false,
        message: 'Supabase is not configured',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

    // Supabase 연결 유지를 위한 간단한 쿼리 실행
    const { data, error } = await supabase
      .from('documents')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keepalive error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection is alive',
      timestamp: new Date().toISOString(),
      recordsChecked: data?.length || 0
    });
  } catch (error) {
    console.error('Keepalive error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
