import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// 문서 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    
    // 동일한 내용의 기존 공개 문서가 있는지 확인
    const { data: existingDocument, error: searchError } = await supabase
      .from('documents')
      .select('*')
      .eq('content', content || '')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 기존 문서가 있다면 그것을 반환
    if (existingDocument && !searchError) {
      return NextResponse.json({
        ...existingDocument,
        _meta: {
          isReused: true,
          message: '동일한 내용의 문서가 이미 존재하여 기존 공유 링크를 사용합니다.'
        }
      });
    }
    
    // 기존 문서가 없다면 새로운 문서 생성
    const shareToken = uuidv4();
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: title || 'Untitled Document',
        content: content || '',
        share_token: shareToken,
        is_public: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      return NextResponse.json(
        { error: 'Failed to create document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...data,
      _meta: {
        isReused: false,
        message: '새로운 공유 링크가 생성되었습니다.'
      }
    });
  } catch (error) {
    console.error('Error in POST /api/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 