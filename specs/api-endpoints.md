# JIJI API Endpoints Reference

> **Base URL**: No global prefix. CORS allows `localhost:3000` and `*.vercel.app`.
> **Auth**: JWT Bearer token via Supabase Auth (`Authorization: Bearer <token>`).
> **Validation**: Global `ValidationPipe` with `whitelist: true` and `transform: true`.
> **Swagger**: Available at `/docs/api`.

---

## Auth

### POST `/api/v1/auth/signup`
- **Auth**: None
- **Request Body**: `SignUpRequest`
  ```ts
  { email: string; password: string; name: string }
  ```
- **Response** `201`: `AuthResponse`
  ```ts
  { accessToken: string; user: { id, email, name? } }
  ```
- **Notes**: Creates a Supabase user and returns a JWT access token.

### POST `/api/v1/auth/signin`
- **Auth**: None
- **Request Body**: `SignInRequest`
  ```ts
  { email: string; password: string }
  ```
- **Response** `200`: `AuthResponse`
- **Notes**: Returns HTTP 200 (not 201). Same response shape as signup.

---

## Users / Profile

### GET `/api/v1/users/me`
- **Auth**: JWT required
- **Response**: `ProfileResponse`
  ```ts
  { id, email, name, birthDate, height, weight, createdAt, updatedAt }
  ```
- **Notes**: Returns the authenticated user's profile. User ID extracted from JWT `sub` claim.

### PATCH `/api/v1/users/me`
- **Auth**: JWT required
- **Request Body**: `UpdateProfileRequest` (all fields optional)
  ```ts
  { name?, birthDate?, height?, weight? }
  ```
- **Response**: `ProfileResponse`
- **Notes**: Partial update. Height: 50-250, Weight: 20-300.

---

## Surveys - MRS (Menopause Rating Scale)

### GET `/api/v1/survey/mrs`
- **Auth**: None
- **Response**: `MrsQuestionnaire`
  ```ts
  { type: 'MRS', title, version, questions: MrsQuestion[] }
  ```
- **Notes**: Returns the full MRS questionnaire with 11 questions. Each question has domain (SOMATIC / PSYCHOLOGICAL / UROGENITAL) and answer options 0-4.

### POST `/api/v1/survey/mrs`
- **Auth**: JWT required
- **Request Body**: `SubmitMrsRequest`
  ```ts
  { answers: [{ questionId: number, answer: number }] }
  ```
- **Response**: `MrsResult`
  ```ts
  {
    id: number,
    diagnosis: { summaryScore, severityLabel, totalPossibleScore, topPercentileLabel, nextAction },
    symptoms: { physical: {score, total}, psychological: {score, total}, urinary: {score, total} }
  }
  ```
- **Data Flow**: `nextAction` determines the next screen:
  - `EXPERT_CONSULTATION` -> Direct to expert consultation
  - `CBT_GUIDANCE` -> Cognitive behavioral therapy guidance chat
  - `START_HRT_ABSOLUTE` -> Proceed to HRT Absolute contraindication survey
  - `NON_HORMONAL_QA` -> Non-hormonal treatment Q&A chat
  - `LIFESTYLE_GUIDANCE` -> Lifestyle guidance chat

---

## Surveys - HRT (Hormone Replacement Therapy) Contraindications

### GET `/api/v1/survey/hrt/absolute`
- **Auth**: JWT required
- **Response**: `HrtAbsoluteQuestionnaire`
  ```ts
  { type: 'HRT_ABSOLUTE', title, version, questions: HrtAbsoluteQuestion[] }
  ```
- **Notes**: Returns HRT absolute contraindication questions. Answer options: YES / NO / DONT_KNOW.

### POST `/api/v1/survey/hrt/absolute`
- **Auth**: JWT required
- **Request Body**: `SubmitHrtAbsoluteRequest`
  ```ts
  { answers: [{ questionId: number, answer: string }] }
  ```
- **Response**: `HrtAbsoluteResult`
  ```ts
  { id: string, diagnosis: { nextAction: HrtAbsoluteNextAction } }
  ```
- **Data Flow**: `nextAction` determines the next screen:
  - `START_HRT_RELATIVE` -> Proceed to HRT Relative contraindication survey
  - `EXPERT_CONSULTATION` -> Direct to expert consultation (absolute contraindication found)

### GET `/api/v1/survey/hrt/relative`
- **Auth**: JWT required
- **Response**: `HrtRelativeQuestionnaire`
  ```ts
  { type: 'HRT_RELATIVE', title, version, questions: HrtRelativeQuestion[] }
  ```
- **Notes**: Returns HRT relative contraindication questions, grouped by `category`.

### POST `/api/v1/survey/hrt/relative`
- **Auth**: JWT required
- **Request Body**: `SubmitHrtRelativeRequest`
  ```ts
  { answers: [{ questionId: number, answer: string }] }
  ```
- **Response**: `HrtRelativeResult`
  ```ts
  { id: string, diagnosis: { nextAction: HrtRelativeNextAction } }
  ```
- **Data Flow**: `nextAction` determines the next screen:
  - `HORMONAL_THERAPY` -> Safe for HRT; show hormonal therapy info
  - `RELATIVE_CONTRAINDICATION` -> Relative contraindication found; expert consult needed
  - `RELATIVE_CONTRAINDICATION_SUSPECTED` -> Suspected relative contraindication; expert consult recommended

---

## Surveys - Legacy Session-Based Endpoints

> These endpoints use a different path prefix (`/surveys/...` without `/api/v1`). They are excluded from Swagger.

### POST `/surveys/sessions`
- **Auth**: JWT required
- **Response**: `SurveySessionResponse`
- **Notes**: Creates a new survey session for the authenticated user.

### GET `/surveys/sessions`
- **Auth**: JWT required
- **Response**: `SurveySessionResponse[]`
- **Notes**: Returns all survey sessions for the authenticated user.

### GET `/surveys/sessions/:id`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `SurveySessionWithResponses`
- **Notes**: Returns a single session with all its responses.

### POST `/surveys/sessions/:id/responses`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Request Body**: `SubmitSurveyResponseRequest`
  ```ts
  { questionId: string, answer?: unknown, score?: number }
  ```
- **Response**: `SurveyResponseItem`

### POST `/surveys/sessions/:id/complete`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `SurveyResultResponse`
- **Notes**: Marks the session as complete and triggers scoring calculation.

### GET `/surveys/questions`
- **Auth**: JWT required
- **Query**: `after` (optional, question ID)
- **Response**: `QuestionResponse | null`
- **Notes**: Returns the first question (no `after`) or the next question after a given ID.

### GET `/surveys/questions/all`
- **Auth**: JWT required
- **Response**: `QuestionResponse[]`

### GET `/surveys/results/:id`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `SurveyResultResponse`

---

## Chats - Sessions

> Path prefix: `/chats/sessions` (no `/api/v1`). Excluded from Swagger.

### POST `/chats/sessions`
- **Auth**: JWT required
- **Request Body**: `CreateChatSessionRequest`
  ```ts
  { context: 'result' | 'faq' | 'question' | 'closing', surveyResultId?: string }
  ```
- **Response**: `ChatSessionResponse`
- **Notes**: `context` determines the chat mode. Provide `surveyResultId` when context is `result`.

### GET `/chats/sessions`
- **Auth**: JWT required
- **Response**: `ChatSessionResponse[]`

### GET `/chats/sessions/:id`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `ChatSessionResponse`

### POST `/chats/sessions/:id/end`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `ChatSessionResponse`
- **Notes**: Marks the chat session as ended (sets `endedAt`).

---

## Chats - Messages

> Path prefix: `/chats/sessions/:sessionId/messages` (no `/api/v1`). Excluded from Swagger.

### GET `/chats/sessions/:sessionId/messages`
- **Auth**: JWT required
- **Params**: `sessionId` (UUID)
- **Response**: `MessageResponse[]`

### POST `/chats/sessions/:sessionId/messages`
- **Auth**: JWT required
- **Params**: `sessionId` (UUID)
- **Request Body**: `CreateMessageRequest`
  ```ts
  { senderType: 'user' | 'assistant', content: string, metadata?: Record<string, unknown> }
  ```
- **Response**: `MessageResponse`

---

## Chats - FAQ

### GET `/api/v1/chats/faq`
- **Auth**: JWT required
- **Query**: `category` (optional string)
- **Response**: `FaqResponse[]`
- **Notes**: Returns all FAQs, optionally filtered by category.

### GET `/api/v1/chats/faq/:id`
- **Auth**: JWT required
- **Params**: `id` (UUID)
- **Response**: `FaqResponse`

---

## Chats - Closing

### GET `/api/v1/chats/sessions/:sessionId/closing`
- **Auth**: JWT required
- **Params**: `sessionId` (UUID)
- **Response**: `ClosingResponse`
  ```ts
  { sessionId, taskSummary: { completed, total, items }, closingMessage, nextSteps }
  ```
- **Notes**: Returns the closing summary for a completed chat session.

---

## Emails

### POST `/api/v1/emails/send`
- **Auth**: JWT required
- **Request Body**: `SendEmailRequest`
  ```ts
  { to: string, subject: string, html: string, text?: string }
  ```
- **Response**: `EmailResponse`
  ```ts
  { id, to, subject }
  ```

---

## Health / Utility

### GET `/`
- **Auth**: None
- **Response**: `string` ("Hello World")

### GET `/health`
- **Auth**: None
- **Response**: `HealthCheckResponse` (NestJS Terminus format)
- **Notes**: Checks Supabase connectivity.

### GET `/api/v1/test/agent-kit/hello-world`
- **Auth**: None
- **Response**: `AgentKitTestResponse`
  ```ts
  { message: string }
  ```
- **Notes**: Test endpoint for AI agent API connectivity verification.

---

## Complete Survey Flow Diagram

```
User starts
    |
    v
GET  /api/v1/survey/mrs          (load MRS questions)
POST /api/v1/survey/mrs          (submit answers)
    |
    +-- nextAction = EXPERT_CONSULTATION     --> Expert consult screen
    +-- nextAction = CBT_GUIDANCE            --> CBT guidance chat
    +-- nextAction = NON_HORMONAL_QA         --> Non-hormonal Q&A chat
    +-- nextAction = LIFESTYLE_GUIDANCE      --> Lifestyle guidance chat
    +-- nextAction = START_HRT_ABSOLUTE      --> Continue below
                |
                v
GET  /api/v1/survey/hrt/absolute     (load HRT absolute questions)
POST /api/v1/survey/hrt/absolute     (submit answers)
    |
    +-- nextAction = EXPERT_CONSULTATION     --> Expert consult screen
    +-- nextAction = START_HRT_RELATIVE      --> Continue below
                |
                v
GET  /api/v1/survey/hrt/relative     (load HRT relative questions)
POST /api/v1/survey/hrt/relative     (submit answers)
    |
    +-- nextAction = HORMONAL_THERAPY                      --> HRT info screen
    +-- nextAction = RELATIVE_CONTRAINDICATION             --> Expert consult
    +-- nextAction = RELATIVE_CONTRAINDICATION_SUSPECTED   --> Expert consult recommended
```
