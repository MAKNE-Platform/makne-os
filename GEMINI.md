# GEMINI.md

This file contains project-specific instructions and conventions for Gemini CLI.

## Core Architecture & Philosophy
- **Backend-Dominant Design:** Business logic is centralized in server actions and route handlers. Always prioritize server-side validation and lifecycle guards before any state mutation.
- **Agreement State Machine:** Every agreement follows a strict flow: `DRAFT → SHARED → NEGOTIATION → ACCEPTED → ACTIVE → COMPLETED`. Transitions must be role-restricted and logged as immutable events.
- **Role-Based Access Control (RBAC):** Users have one primary role (Brand, Creator, Agency, or System). Enforce permissions at both the API (middleware/route level) and UI level.
- **Data Integrity:** The system is a "workflow engine," not just a CRUD app. Ensure all data modeling follows the established Mongoose schemas with embedded milestones and submission history.

## Development Conventions
- **Next.js App Router:** Use the `src/app` directory for routing. Role-specific pages should stay within their respective folders (e.g., `brand/`, `creator/`).
- **Styling:** Use Tailwind CSS. Prefer the existing dark + primary theme architecture.
- **State Management:** Prioritize server-side state. Use `framer-motion` for complex transitions and interactive feedback.
- **File Handling:** Use the `/api/files` endpoint for uploads, which integrates with Cloudinary. Ensure submissions are tied to specific milestone IDs.
- **Audit Logging:** Every critical state change must be logged to the append-only event timeline for dispute-ready execution history.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, RESTful API Routes, JWT Authentication.
- **Database:** MongoDB with Mongoose ODM.
- **Storage:** Cloudinary.
