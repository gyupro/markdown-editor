-- 문서 테이블 생성
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  content TEXT NOT NULL DEFAULT '',
  share_token TEXT UNIQUE NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_documents_share_token ON documents(share_token);
CREATE INDEX idx_documents_created_at ON documents(created_at);
-- content 컬럼에 해시 인덱스 추가 (중복 검사 성능 향상)
CREATE INDEX idx_documents_content_hash ON documents USING hash(content);

-- RLS (Row Level Security) 활성화
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 공개 문서는 누구나 읽을 수 있도록 정책 설정
CREATE POLICY "Public documents are readable by everyone" 
ON documents FOR SELECT 
USING (is_public = true);

-- 모든 사용자가 문서를 생성할 수 있도록 정책 설정
CREATE POLICY "Anyone can create documents" 
ON documents FOR INSERT 
WITH CHECK (true);

-- 문서 소유자가 업데이트할 수 있도록 정책 설정 (일단 모든 사용자가 업데이트 가능)
CREATE POLICY "Anyone can update documents" 
ON documents FOR UPDATE 
USING (true); 