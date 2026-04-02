import { NextRequest } from 'next/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import {
  validateTitle,
  validateContent,
  sanitizeInput,
} from '@/utils/validation';

const SITE_URL = 'https://markdown.develop-on.co.kr';

function createServer(): McpServer {
  const server = new McpServer({
    name: 'markdown-editor',
    version: '1.0.0',
  });

  // --- Tools ---

  server.tool(
    'create_share_link',
    `마크다운 문서를 저장하고 공유 링크를 생성합니다.
이 에디터는 GFM, KaTeX 수식, Mermaid 다이어그램, 이모지, 하이라이트(==text==), 각주, 접기/펼치기(<details>) 등을 지원합니다.
공유 링크를 생성하기 전에 'syntax-guide' 리소스를 읽어 지원 문법을 확인하세요.`,
    {
      title: z.string().max(200).describe('문서 제목 (최대 200자)'),
      content: z.string().describe('마크다운 내용'),
    },
    async ({ title, content }) => {
      const titleValidation = validateTitle(title);
      if (!titleValidation.isValid) {
        return {
          content: [{ type: 'text' as const, text: `오류: ${titleValidation.error}` }],
          isError: true,
        };
      }

      const contentValidation = validateContent(content);
      if (!contentValidation.isValid) {
        return {
          content: [{ type: 'text' as const, text: `오류: ${contentValidation.error}` }],
          isError: true,
        };
      }

      const sanitizedTitle = sanitizeInput(title, 200);
      const sanitizedContent = sanitizeInput(content, 10 * 1024 * 1024);

      // 동일 내용 기존 문서 확인
      const { data: existing } = await supabase
        .from('documents')
        .select('share_token')
        .eq('content', sanitizedContent)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        const url = `${SITE_URL}/shared/${existing.share_token}`;
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              url,
              share_token: existing.share_token,
              reused: true,
              message: '동일한 내용의 문서가 이미 존재하여 기존 링크를 반환합니다.',
            }),
          }],
        };
      }

      const shareToken = nanoid(10);
      const { data: doc, error } = await supabase
        .from('documents')
        .insert([{
          title: sanitizedTitle,
          content: sanitizedContent,
          share_token: shareToken,
          is_public: true,
        }])
        .select('share_token, title, created_at')
        .single();

      if (error) {
        return {
          content: [{ type: 'text' as const, text: '오류: 문서 생성에 실패했습니다.' }],
          isError: true,
        };
      }

      const url = `${SITE_URL}/shared/${doc.share_token}`;
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            url,
            share_token: doc.share_token,
            title: doc.title,
            created_at: doc.created_at,
            reused: false,
          }),
        }],
      };
    }
  );

  server.tool(
    'get_shared_document',
    '공유 토큰으로 마크다운 문서를 조회합니다.',
    {
      token: z.string().describe('공유 토큰 (URL의 /shared/ 뒤 부분)'),
    },
    async ({ token }) => {
      const { data: doc, error } = await supabase
        .from('documents')
        .select('title, content, created_at')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

      if (error || !doc) {
        return {
          content: [{ type: 'text' as const, text: '오류: 문서를 찾을 수 없습니다.' }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            title: doc.title,
            content: doc.content,
            created_at: doc.created_at,
            url: `${SITE_URL}/shared/${token}`,
          }),
        }],
      };
    }
  );

  // --- Resources ---

  server.resource(
    'syntax-guide',
    'markdown-editor://syntax-guide',
    {
      description: '이 에디터가 지원하는 전체 마크다운 문법 가이드',
      mimeType: 'text/markdown',
    },
    async () => ({
      contents: [{
        uri: 'markdown-editor://syntax-guide',
        mimeType: 'text/markdown',
        text: SYNTAX_GUIDE,
      }],
    })
  );

  server.resource(
    'mermaid-guide',
    'markdown-editor://mermaid-guide',
    {
      description: 'Mermaid 다이어그램 작성법 및 예시',
      mimeType: 'text/markdown',
    },
    async () => ({
      contents: [{
        uri: 'markdown-editor://mermaid-guide',
        mimeType: 'text/markdown',
        text: MERMAID_GUIDE,
      }],
    })
  );

  // --- Prompts ---

  server.prompt(
    'write_document',
    '주어진 주제로 마크다운 문서를 작성하고 공유 링크를 생성합니다.',
    { topic: z.string().describe('문서 주제') },
    ({ topic }) => ({
      messages: [{
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `다음 주제로 마크다운 문서를 작성해주세요: "${topic}"

작성 규칙:
1. 먼저 'syntax-guide' 리소스를 읽어 지원 문법을 확인하세요.
2. 이 에디터가 지원하는 문법을 최대한 활용하세요 (GFM 테이블, 수식, Mermaid 다이어그램, 이모지, 하이라이트 등).
3. 작성이 끝나면 'create_share_link' 도구로 공유 링크를 생성하세요.
4. 최종적으로 공유 링크를 사용자에게 전달하세요.`,
        },
      }],
    })
  );

  return server;
}

// Next.js Request → Node.js IncomingMessage 변환
function toIncomingMessage(request: NextRequest, body: string): IncomingMessage {
  const socket = new Socket();
  const msg = new IncomingMessage(socket);
  msg.method = request.method;
  msg.url = new URL(request.url).pathname;
  request.headers.forEach((value, key) => {
    msg.headers[key] = value;
  });
  msg.push(body);
  msg.push(null);
  return msg;
}

// Node.js ServerResponse 결과 수집
function createMockResponse(res: ServerResponse): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = function (chunk: unknown) {
      if (chunk) chunks.push(Buffer.from(chunk as string));
      return originalWrite(chunk as string);
    } as typeof res.write;

    res.end = function (chunk?: unknown) {
      if (chunk) chunks.push(Buffer.from(chunk as string));
      resolve({
        status: res.statusCode,
        headers: Object.fromEntries(
          Object.entries(res.getHeaders()).map(([k, v]) => [k, String(v)])
        ),
        body: Buffer.concat(chunks).toString('utf-8'),
      });
      return originalEnd(chunk as string);
    } as typeof res.end;
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id',
};

export async function POST(request: NextRequest) {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);

    const body = await request.text();
    const req = toIncomingMessage(request, body);
    const socket = new Socket();
    const res = new ServerResponse(req);
    res.assignSocket(socket);

    const resultPromise = createMockResponse(res);

    await transport.handleRequest(req, res, JSON.parse(body));

    const result = await resultPromise;

    socket.destroy();

    return new Response(result.body, {
      status: result.status,
      headers: {
        ...result.headers,
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error('MCP POST error:', error);
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      name: 'markdown-editor',
      version: '1.0.0',
      description: '마크다운 문서 공유 링크를 생성하는 MCP 서버',
      tools: ['create_share_link', 'get_shared_document'],
      resources: ['markdown-editor://syntax-guide', 'markdown-editor://mermaid-guide'],
      prompts: ['write_document'],
      usage: {
        endpoint: `${SITE_URL}/api/mcp`,
        transport: 'streamable-http',
        method: 'POST',
        example_config: {
          claude_desktop: {
            mcpServers: {
              'markdown-editor': {
                type: 'url',
                url: `${SITE_URL}/api/mcp`,
              },
            },
          },
        },
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// --- Content ---

const SYNTAX_GUIDE = `# 마크다운 에디터 문법 가이드

이 에디터는 다음 마크다운 문법을 지원합니다.

## 기본 문법

| 문법 | 작성법 | 결과 |
|------|--------|------|
| 굵게 | \`**텍스트**\` | **텍스트** |
| 기울임 | \`*텍스트*\` | *텍스트* |
| 취소선 | \`~~텍스트~~\` | ~~텍스트~~ |
| 인라인 코드 | \`\\\`코드\\\`\` | \`코드\` |
| 링크 | \`[텍스트](URL)\` | [텍스트](URL) |
| 이미지 | \`![대체텍스트](URL)\` | 이미지 표시 |

## 헤딩

\`# h1\` ~ \`###### h6\` (1~6단계)

## 리스트

- 순서 없는: \`- 항목\` 또는 \`* 항목\`
- 순서 있는: \`1. 항목\`
- 체크리스트: \`- [x] 완료\` / \`- [ ] 미완료\`

## GFM 테이블

\`\`\`markdown
| 열1 | 열2 | 열3 |
|-----|:---:|----:|
| 왼쪽 | 가운데 | 오른쪽 |
\`\`\`

## 수학 수식 (KaTeX/LaTeX)

- 인라인: \`$E = mc^2$\`
- 블록:
\`\`\`
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
\`\`\`

## 코드 블록

\`\`\`\`markdown
\\\`\\\`\\\`typescript
const hello: string = "world";
\\\`\\\`\\\`
\`\`\`\`

지원 언어: typescript, javascript, python, java, go, rust, c, cpp, csharp, ruby, php, swift, kotlin, sql, bash, html, css, json, yaml, xml 등 (Prism 전체 지원)

## Mermaid 다이어그램

\\\`\\\`\\\`mermaid 코드 블록으로 다이어그램을 작성할 수 있습니다.
flowchart, sequenceDiagram, classDiagram, stateDiagram, gantt 등을 지원합니다.
자세한 내용은 'mermaid-guide' 리소스를 참고하세요.

## 하이라이트

\`==강조할 텍스트==\` → 노란색 배경으로 강조 표시

## 이모지

이모지 단축코드 사용: \`:rocket:\` → 🚀, \`:heart:\` → ❤️, \`:star:\` → ⭐, \`:fire:\` → 🔥, \`:warning:\` → ⚠️

## 각주

\`텍스트[^1]\`로 참조하고, \`[^1]: 설명\`으로 정의합니다.

## 위첨자 & 아래첨자

- 위첨자: \`<sup>2</sup>\` → x<sup>2</sup>
- 아래첨자: \`<sub>2</sub>\` → H<sub>2</sub>O

## 접기/펼치기

\`\`\`html
<details>
<summary>제목</summary>
숨겨진 내용
</details>
\`\`\`

## 인용문

\`> 인용 텍스트\`

## 수평선

\`---\` 또는 \`***\`
`;

const MERMAID_GUIDE = `# Mermaid 다이어그램 가이드

## Flowchart (순서도)

\`\`\`mermaid
graph TD
    A[시작] --> B{조건}
    B -->|Yes| C[실행]
    B -->|No| D[종료]
\`\`\`

방향: TD(위→아래), LR(왼→오른), BT(아래→위), RL(오른→왼)

노드 형태:
- \`[텍스트]\` 사각형
- \`{텍스트}\` 다이아몬드 (조건)
- \`(텍스트)\` 둥근 사각형
- \`((텍스트))\` 원
- \`>텍스트]\` 비대칭

## Sequence Diagram (시퀀스 다이어그램)

\`\`\`mermaid
sequenceDiagram
    participant A as 클라이언트
    participant B as 서버
    A->>B: 요청
    B-->>A: 응답
    Note over A,B: 통신 완료
\`\`\`

## Class Diagram (클래스 다이어그램)

\`\`\`mermaid
classDiagram
    class Animal {
        +String name
        +makeSound()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
\`\`\`

## State Diagram (상태 다이어그램)

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: start
    Processing --> Done: complete
    Done --> [*]
\`\`\`

## Gantt Chart (간트 차트)

\`\`\`mermaid
gantt
    title 프로젝트 일정
    dateFormat YYYY-MM-DD
    section 기획
    요구사항 분석 :a1, 2024-01-01, 7d
    section 개발
    구현 :a2, after a1, 14d
\`\`\`

## Pie Chart (파이 차트)

\`\`\`mermaid
pie title 언어 비율
    "TypeScript" : 45
    "Python" : 30
    "Go" : 25
\`\`\`
`;
