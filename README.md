# 20minCoach — Frontend Architecture (Caso #1)


**Curso:** Course: Software Design / IC-6821

**Group:** 3 members
## Members
- Fiorella Chinchilla Ortiz - fichinchilla@estudiantec.cr
- Javier Rodriguez Menjivar - ja.rodriguez@estudiantec.cr
- Josue Salazar Quiros - jo.salazar@estudiantec.cr

## Brief Description
Platform for instant connection between users and coaches for 20-minute sessions. This repository contains the front-end architecture proposal, PoC, unit tests, and implementation documentation. 

### Chosen Stack

- **Framework:** React + TypeScript  
  React provides a component-based architecture, ideal for dynamic real-time UIs. TypeScript adds static typing, improving robustness and maintainability.

- **State Management:** Redux Toolkit + RTK Query  
  Redux Toolkit simplifies state management with predictable patterns. RTK Query adds efficient data fetching, caching, and auto-invalidation.

- **Styling:** Tailwind CSS  
  Utility-first CSS for responsive design. Built-in support for dark/light themes and rapid customization.

- **Real-Time Video:** WebRTC (with Simple-Peer)  
  Industry standard for P2P audio/video communication. Scalable for live coaching sessions.

- **Real-Time Notifications:** Socket.io  
  Enables push updates such as coach availability or session status changes.

- **Authentication:** Auth0 / AWS Cognito  
  Secure authentication flows, MFA support, and role-based access control (Basic vs Premium User).

- **Testing:**  
  - **Unit & Component Tests:** Jest + React Testing Library  
  - **End-to-End (E2E):** Cypress  

- **UX Prototyping:** Figma  
- **UX Testing:** Maze (heatmaps, task completion rate).  

- **Linting & Formatting:** ESLint + Prettier  
  Ensures consistent code style and prevents common errors.

- **Monitoring & Logging:** Sentry  
  Captures frontend errors in production with contextual information.

- **Build Tool:** Vite  
  Faster build and dev server compared to Webpack.

- **Deployment:** Vercel  
  GitHub integration, preview deployments, and production hosting.

- **Package Manager:** Yarn  
  Optimized for performance and monorepo support.

- **Version Control:** GitHub  
  Standard tool for collaboration and CI/CD pipelines.

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




