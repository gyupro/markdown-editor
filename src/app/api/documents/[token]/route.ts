import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 공유 토큰으로 문서 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('share_token', token)
      .eq('is_public', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/documents/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 문서 업데이트 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const { title, content } = await request.json();

    const { data, error } = await supabase
      .from('documents')
      .update({
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('share_token', token)
      .eq('is_public', true)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Document not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/documents/[token]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 