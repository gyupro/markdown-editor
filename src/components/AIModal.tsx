import React, { useState } from 'react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMarkdown: string;
  onApplyContent: (content: string, replaceAll: boolean) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ 
  isOpen, 
  onClose, 
  currentMarkdown, 
  onApplyContent 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<'create' | 'improve' | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (replaceMode: boolean) => {
    setIsGenerating(true);
    setError('');
    setGeneratedContent('');
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMarkdown,
          replaceMode,
          userPrompt: userPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('AI 생성 중 오류가 발생했습니다.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('스트림을 읽을 수 없습니다.');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.content) {
                accumulatedContent += data.content;
                setGeneratedContent(accumulatedContent);
              }
              
              if (data.done) {
                setIsGenerating(false);
                return;
              }
            } catch (parseError) {
              // JSON 파싱 오류는 무시 (빈 줄이나 불완전한 데이터)
              console.debug('JSON 파싱 건너뜀:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI 생성 중 오류:', error);
      setError(error instanceof Error ? error.message : 'AI 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = (replaceAll: boolean) => {
    if (generatedContent) {
      onApplyContent(generatedContent, replaceAll);
      setGeneratedContent('');
      setError('');
      setUserPrompt('');
      onClose();
    }
  };

  const handleClose = () => {
    setGeneratedContent('');
    setError('');
    setUserPrompt('');
    setSelectedMode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            🤖 AI 콘텐츠 생성
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {!selectedMode ? (
            /* 1단계: 모드 선택 */
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  어떤 작업을 하시겠어요?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  원하시는 모드를 선택해주세요
                </p>
              </div>
              
              <div className="grid gap-4">
                <button
                  onClick={() => setSelectedMode('create')}
                  className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">✨</div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        새로운 콘텐츠 생성
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        처음부터 새로운 마크다운 문서를 생성합니다
                      </p>
                    </div>
                  </div>
                </button>
                
                {currentMarkdown.trim() && (
                  <button
                    onClick={() => setSelectedMode('improve')}
                    className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">🔧</div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                          기존 텍스트 개선
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          현재 작성된 텍스트를 개선하고 확장합니다
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* 2단계: 프롬프트 입력 및 생성 */
            <div className="space-y-6">
              {/* 선택된 모드 표시 */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {selectedMode === 'create' ? '✨' : '🔧'}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {selectedMode === 'create' ? '새로운 콘텐츠 생성' : '기존 텍스트 개선'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                  변경
                </button>
              </div>

              {/* 프롬프트 입력 필드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {selectedMode === 'create' ? '생성할 콘텐츠 설명 *' : '개선 요청사항 *'}
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder={
                    selectedMode === 'create'
                      ? "예: React 훅 사용법에 대한 가이드, Python 데이터 분석 튜토리얼, JavaScript 비동기 처리 방법 등..."
                      : "예: 더 자세한 예시 추가, 코드 블록 포함, 구체적인 설명, 목차 추가, 전문 용어 설명 등..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={4}
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  * {selectedMode === 'create'
                    ? '생성하고 싶은 콘텐츠의 주제나 내용을 구체적으로 입력해주세요'
                    : '어떤 방향으로 개선하고 싶은지 구체적으로 입력해주세요'
                  }
                </p>
              </div>

              {/* 생성 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleGenerate(selectedMode === 'improve')}
                  disabled={isGenerating || !userPrompt.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      AI 작업 중...
                    </>
                  ) : (
                    <>
                      <span>{selectedMode === 'create' ? '✨' : '🔧'}</span>
                      {selectedMode === 'create' ? '콘텐츠 생성' : '텍스트 개선'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {generatedContent && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                생성된 콘텐츠:
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {generatedContent}
                </pre>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleApply(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  현재 위치에 추가
                </button>
                <button
                  onClick={() => handleApply(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  전체 교체
                </button>
                <button
                  onClick={() => setGeneratedContent('')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  다시 생성
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 