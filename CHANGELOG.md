# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **공유링크 길이 대폭 축소**: UUID v4(36자)를 Nano ID(10자)로 교체하여 링크 길이를 72% 단축
- **보안성 유지**: Nano ID는 UUID와 동일한 수준의 보안성과 충돌 확률을 제공
- **사용자 친화적**: 더 짧은 링크로 복사/공유가 더욱 편리해짐

### Technical Details
- `uuid` 패키지를 `nanoid` 패키지로 교체
- 기존: `https://domain.com/shared/550e8400-e29b-41d4-a716-446655440000` (36자)
- 개선: `https://domain.com/shared/V1StGXR8_Z` (10자)
- 충돌 확률: 10자 nanoid로 천만 개 생성 시 중복 확률 ~0.000004%

### Dependencies
- ➕ Added: `nanoid@^5.0.0`
- ➖ Removed: `uuid@^11.1.0`, `@types/uuid@^10.0.0` 