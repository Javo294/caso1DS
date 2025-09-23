# 20minCoach — Frontend Architecture (Caso #1)


**Curso:** Course: Software Design / IC-6821

**Group:** 3 members
## Members
- Fiorella Chinchilla Ortiz - fichinchilla@estudiantec.cr
- Javier Rodriguez Menjivar - ja.rodriguez@estudiantec.cr
- Josue Salazar Quiros - jo.salazar@estudiantec.cr

## Brief Description
Platform for instant connection between users and coaches for 20-minute sessions. This repository contains the front-end architecture proposal, PoC, unit tests, and implementation documentation. 

### Stack

- **Framework:** React + TypeScript  
- **State Management:** Redux Toolkit + RTK Query  
- **Styling:** Tailwind CSS  
- **Real-Time Video:** WebRTC (via Simple-Peer)  
- **Real-Time Notifications:** Socket.IO  
- **Authentication:** AWS Cognito  
- **Testing:**  
  - Unit & Component: Jest + React Testing Library  
  - End-to-End (E2E): Cypress  
- **UX Prototyping:** Figma  
- **UX Testing:** Maze  
- **Linting & Formatting:** ESLint + Prettier  
- **Monitoring & Logging:** Sentry  
- **Build Tool:** Vite  
- **Deployment:** Vercel (Frontend Hosting)  
- **Version Control:** GitHub 

## N-Layer Architecture Design
The /src directory follows a layered architecture (inspired by N-Layer and Clean Architecture).
Each layer has a single responsibility and communicates only with adjacent layers.
This structure improves maintainability, testability, and scalability of the frontend codebase.

### Layer Responsibilities

- **Components (`/components`)**  
  Reusable UI blocks (atoms, molecules, organisms).  

- **Containers (`/containers`)**  
  Smart components that combine UI components with controllers.  

- **Controllers (`/controllers`)**  
  Hooks with business logic and state handling (`useAuthController`, `useCoachSearch`).  

- **Models (`/models`)**  
  Core domain entities (`Coach`, `Session`).  

- **DTOs (`/dto`)**  
  Data Transfer Objects defining contracts with backend APIs.  

- **Services (`/services`)**  
  Domain logic (e.g., `CoachService` handles coach operations).  

- **Store (`/store`)**  
  Redux Toolkit slices and hooks (`useAuthStore`, `useCoachStore`).  

- **API (`/api`)**  
  Abstracted API clients and Auth0 client (`apiClient`, `authClient`).  

- **Listeners (`/listeners`)**  
  Real-time handlers for WebRTC and Socket.io.  

- **Validators (`/validators`)**  
  Input validation logic for domain models.  

- **Middleware (`/middleware`)**  
  Request/response interceptors, auth, error handling, logging.  

- **Exceptions (`/exceptions`)**  
  Custom error classes for consistent error handling.  

- **Utils (`/utils`)**  
  Shared helpers (constants, formatting, logger).  

- **Styles (`/styles`)**  
  Tailwind configuration, theming, and global styles.
  
---

# System Architecture & Development Standards

## 1. Logging
**Location:** `/src/utils/logger.ts`  

**Tool:** [Sentry]  

**Base Class:**  
- `Logger.ts`: A wrapper around the Sentry SDK that standardizes logging methods (`logInfo`, `logWarn`, `logError`).  

**Structured Format:**  
- Required fields: `timestamp`, `level`, `service`, `message`.  
- Optional field: `userId`.  

**Configuration:**  
- Environment variables (`SENTRY_DSN`, `SENTRY_ENVIRONMENT`) managed via `.env`.  
- Automatic error reporting for React runtime issues in production environments.  

**Retention Policy:**  
- Log retention duration is defined by the Sentry plan.  
- Expired logs are archived within Sentry or exported in accordance with organizational policies.  

---
## Diagramas

### 1. Diagrama de Clases  
![Diagrama de Clases](./src/diagrams/Clases_Corregido.png)

### 2. Diagrama de Secuencia - Inicio de Sesión  
![Secuencia Login](./src/diagrams/Secuencias_Inicio%20de%20Sesión.png)

### 3. Diagrama de Secuencia - Agendar Sesión  
![Secuencia Agendar](./src/diagrams/Secuencias_Agendar.png)

## 2. Background Jobs & Notifications
**Location:**  
- `/src/hooks/useNotifications.ts`  
- `/src/services/socket.ts`  

**Technologies:**  
- **Socket.io** → real-time event notifications (e.g., session status, availability).  
- **Browser Notifications API** → local client-side notifications.  

**Design Pattern:** **Publisher/Subscriber**  
- Event publishing: `socket.emit("event", payload)`.  
- Event subscription: `socket.on("event", handler)`.  

**Example:**  
- `sessionCreated` event notifies both the coach and the user in real time.  

---

## 3. Linter & Code Standards
**Configuration Files:**  
- ESLint: `/.eslintrc.js`  
- Prettier: `/.prettierrc`  
- NPM scripts (`package.json`):  
  - `"lint": "eslint 'src/**/*.{ts,tsx}' --fix"`  

**Tools:** ESLint + Prettier  

**Enforcement Strategy:**  
- **Active:** `pre-commit` hook via Husky.  
- **Passive:** manual execution of `yarn lint`.  

**Core Rules:**  
- Strict TypeScript typing (`strict: true`).  
- Enforce absolute imports (`@/components`, `@/services`).  
- Naming conventions:  
  - PascalCase → React components.  
  - camelCase → functions and variables.  
- `any` type usage is prohibited unless explicitly documented.  

---

## 4. Services Layer
**Location:** `/src/services`  

**Examples:**  
- `authService.ts`  
- `sessionService.ts`  
- `coachService.ts`  

**Applied Pattern:** **Service Abstraction**  
- Encapsulates business logic and API calls (using RTK Query).  

**Constraints:**  
- Services must not directly access the global state.  
- They are only exposed through **Redux Toolkit slices**.  

---

## 5. Error Handling & Exceptions
**Location:** `/src/utils/errors.ts`  

**Custom Error Classes:**  
- `AppError` → generic application error with `code`, `message`, and `context`.  
- `AuthError` → authentication-related errors.  
- `SessionError` → session-related errors.  

**Integration Points:**  
- `ErrorBoundary` (React) ensures runtime resilience in critical components.  
- `Sentry` integration for stack trace capture and reporting.  

---

## 6. Middleware
**Location:** `/src/middleware`  

**Implemented Redux Middleware:**  
- `authMiddleware.ts` → refreshes tokens (Auth0/AWS Cognito).  
- `loggerMiddleware.ts` → records critical actions to Sentry.  
- `errorMiddleware.ts` → converts runtime errors into Redux-manageable actions.  

**Applied Pattern:** **Chain of Responsibility**  
- Each middleware processes the action and forwards it down the chain.  

---

## 7. Build & Deployment Pipeline
**Location:** `.github/workflows/ci.yml`  

**Pipeline Stages:**  
1. **Lint & Test**: ESLint, Jest, React Testing Library.  
2. **Build**: Vite.  
3. **Deploy**: Vercel (staging and production).  

**Environment Configurations:**  
- `.env.development` → local development.  
- `.env.production` → production (Vercel).  

**Secret Management:**  
- Sensitive values stored in **Vercel Environment Variables**.  

---

## 8. Security Layer
**Location:** `/src/components/auth`  

**Authentication Framework:** Auth0 or AWS Cognito (depending on environment).  

**Authentication Screens:**  
- `Login.tsx`  
- `ChangePassword.tsx`  
- `ForgotPassword.tsx`  
- `TwoFactorAuth.tsx`  

**Configuration:**  
- Environment variables (`AUTH0_CLIENT_ID`, `AUTH0_DOMAIN`) defined in `.env`.  
- Token validation handled within Redux middleware.  

**Security Rules:**  
- `clientSecret` must never be exposed on the frontend.  
- User roles (Basic vs Premium) are stored in `user.roles`.  

---

# N-Layer Architecture + Design Patterns

| **Layer**                   | **Responsibility**                                                                 | **Applied Patterns**                                      | **Tools / Technologies**                         |
|------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------------------|--------------------------------------------------|
| **Presentation (UI)**        | Render views, manage user interaction, navigation, and visual state.               | *Component-Based Architecture*, *Container/Presentational Pattern*. | React, TypeScript, Tailwind, Redux Toolkit (slices). |
| **Controllers**              | Orchestrate use cases and communication between UI and services.                   | *Controller Pattern*, *Mediator* (coordinates flows).    | React Hooks + RTK Query (queries/mutations).     |
| **Domain (Entities + Business Logic)** | Represent business rules (users, coaches, sessions).                         | *Domain Model Pattern*, *DTO Pattern*.                   | TypeScript (DTOs, Models).                       |
| **Services**                 | Application logic, data access, and integration with external APIs.                 | *Service Layer Pattern*, *Dependency Injection*.         | ApiClient, AuthService, SessionService, etc.     |
| **Infrastructure**           | Technical connections (REST API, WebRTC, Socket.io, Auth0).                        | *Adapter Pattern* (ApiClient), *Observer / Pub-Sub* (Socket.io). | WebRTC, Socket.io, Auth0, AWS Cognito, REST API. |
| **Cross-Cutting (Middleware + Validation + Logging)** | Common functions spanning multiple layers (auth, logging, validation). | *Chain of Responsibility* (middlewares), *Decorator* (validators). | Express middlewares, Yup/Zod, Sentry.            |
