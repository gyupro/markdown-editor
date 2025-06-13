# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입/로그인
2. "New Project" 클릭
3. 프로젝트 이름과 비밀번호 설정
4. 리전 선택 (Northeast Asia - Seoul 권장)

## 2. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 "SQL Editor" 클릭
2. `supabase/migrations/001_create_documents.sql` 파일의 내용을 복사하여 실행

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 환경 변수 값 찾기:

1. Supabase 대시보드에서 "Settings" → "API" 클릭
2. "Project URL"을 `NEXT_PUBLIC_SUPABASE_URL`에 복사
3. "anon public" 키를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사

## 4. RLS (Row Level Security) 정책 확인

위의 SQL 스크립트가 다음 정책들을 자동으로 생성합니다:
- 공개 문서는 누구나 읽기 가능
- 누구나 문서 생성 가능
- 누구나 문서 업데이트 가능 (현재는 단순 구현)

## 5. 테스트

1. 개발 서버 실행: `npm run dev`
2. 마크다운 에디터에서 텍스트 작성
3. 툴바의 🌐 버튼 클릭
4. "공유 링크 생성" 버튼 클릭
5. 생성된 링크를 새 탭에서 열어 확인

## 주의사항

- 현재 구현은 기본적인 공유 기능만 포함합니다
- 권한 관리, 사용자 인증 등은 추후 구현 예정
- 모든 문서는 현재 공개 상태로 생성됩니다 