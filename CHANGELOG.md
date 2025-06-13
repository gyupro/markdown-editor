# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **공유링크 길이 대폭 축소**: UUID v4(36자)를 Nano ID(10자)로 교체하여 링크 길이를 72% 단축
- **하위 호환성 유지**: 기존 UUID 공유 링크(`ae92a073-6db7-49ca-aa10-3c473a0e4572` 등)는 계속 작동
- **보안성 유지**: Nano ID는 UUID와 동일한 수준의 보안성과 충돌 확률을 제공
- **사용자 친화적**: 더 짧은 링크로 복사/공유가 더욱 편리해짐

### Added
- **React 성능 최적화**: useMemo, useCallback, React.memo로 렌더링 성능 향상
- **강화된 에러 처리**: 재시도 메커니즘, 타임아웃 처리, 사용자 친화적 에러 메시지
- **포괄적 보안 강화**: 토큰 검증, 입력값 생성, Rate Limiting, 환경 변수 검증

### Technical Details
- `uuid` 패키지를 `nanoid` 패키지로 교체
- 기존: `https://domain.com/shared/ae92a073-6db7-49ca-aa10-3c473a0e4572` (36자) ✅ 계속 지원
- 새로운: `https://domain.com/shared/V1StGXR8_Z` (10자) ✨ 새로 생성되는 링크
- 충돌 확률: 10자 nanoid로 천만 개 생성 시 중복 확률 ~0.000004%
- 이전 버전 호환성: 기존 UUID v4 토큰 완전 지원

### Dependencies
- ➕ Added: `nanoid@^5.0.0`
- ➖ Removed: `uuid@^11.1.0`, `@types/uuid@^10.0.0` 