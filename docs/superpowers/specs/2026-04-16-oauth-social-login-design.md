# OAuth Social Login Design

## Overview

Kakao, Naver, Apple 소셜 로그인을 JIJI 프론트엔드에 구현한다. 백엔드가 OAuth 플로우를 전담하고, FE는 리다이렉트 트리거와 콜백 처리만 담당한다.

## Flow

```
1. 유저가 로그인 페이지에서 SNS 버튼 클릭
2. window.location.href = 백엔드 OAuth URL (redirectUrl = origin + /callback)
3. 백엔드 → 소셜 로그인 페이지로 302 리다이렉트
4. 유저 로그인 완료 → 백엔드 → /callback?accessToken=xxx 로 302 리다이렉트
5. /callback 페이지에서 accessToken 추출
6. supabase.auth.setSession() 으로 세션 설정
7. /home 으로 이동
```

## Backend API

```
GET /api/v1/auth/oauth/:provider?redirectUrl={url}
```

- provider: `kakao`, `naver`, `apple`
- 성공 콜백: `{redirectUrl}?accessToken=xxx`
- 실패 콜백: `{redirectUrl}?error=AUTH_FAILED&message=...`
- 반환되는 accessToken은 Supabase JWT

## Changes

### 1. `src/app/callback/page.tsx` (new)

- `"use client"` 컴포넌트
- URL 쿼리에서 `accessToken` 또는 `error` / `message` 파싱
- `accessToken` 존재 시:
  - `supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })`
  - `/home` 으로 라우팅
- `error` 존재 시:
  - `/login` 으로 리다이렉트
- 처리 중 로딩 스피너 표시

### 2. `src/app/login/page.tsx` (modify)

- 3개 SNS 버튼 (Naver, Kakao, Apple)에 onClick 핸들러 추가
- 클릭 시:
  ```typescript
  const redirectUrl = `${window.location.origin}/callback`
  const oauthUrl = `${API_BASE}/api/v1/auth/oauth/${provider}?redirectUrl=${encodeURIComponent(redirectUrl)}`
  window.location.href = oauthUrl
  ```

## Not Changed

- `useAuth.tsx` — Supabase `onAuthStateChange` 가 `setSession` 을 자동 감지하므로 수정 불필요
- `api.ts` — `getToken()` 이 `getSession()` 으로 토큰을 가져오므로 수정 불필요
- `types.ts` — 별도 OAuth 타입 불필요 (쿼리 파라미터 파싱만)

## Known Limitations

- **refresh_token 미지원**: 백엔드가 accessToken만 반환하므로 `setSession`에 빈 문자열 전달. 토큰 만료 시 재로그인 필요. 추후 백엔드에서 refreshToken 추가 지원 시 해결.

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| OAuth 최초 로그인 시 회원가입 | 백엔드 자동 처리 | FE는 항상 /home으로 이동 |
| 토큰 종류 | Supabase JWT | 기존 auth 인프라 재사용 |
| 콜백 라우트 | /callback | 정적 빌드 호환 (output: "export") |
| refresh_token | 빈 문자열로 우회 | 추후 해결 |
