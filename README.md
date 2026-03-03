# MAKNE

> Creator × Brand Collaboration Platform

A production-grade full-stack collaboration platform enabling structured agreements, milestone tracking, secure submissions, and transparent brand–creator workflows.

---

## Table of Contents

* [Overview](#overview)
* [Core Features](#core-features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Security](#security)
* [Workflow](#workflow)
* [Installation](#installation)
* [API Endpoints](#api-endpoints)
* [Design Philosophy](#design-philosophy)
* [Roadmap](#roadmap)
* [Contributors](#contributors)
* [License](#license)
* [Status](#status)

---

## Overview

MAKNE is a full-stack web platform designed to streamline collaborations between brands and creators.

It introduces a structured agreement lifecycle, milestone-based workflow management, and secure deliverable submissions to ensure accountability, clarity, and operational efficiency throughout the partnership process.

The platform follows a backend-dominant architecture with strong emphasis on:

* Role-based system design
* Agreement lifecycle integrity
* Secure data access
* Structured milestone management
* Scalable full-stack architecture

---

## Core Features

### Role-Based Authentication System

* Brand and Creator authentication
* JWT-secured session management
* Role-scoped API access control
* Account-level data isolation

### Agreement Lifecycle Management

**Agreement States**

```
DRAFT → SENT → ACTIVE → COMPLETED
```

* Brands create and draft agreements
* Agreements are validated before activation
* Creator approval required before moving to ACTIVE
* Lifecycle transitions strictly validated server-side

### Milestone Workflow Engine

Each agreement supports structured milestone tracking with the following states:

* PENDING
* IN_PROGRESS
* REVISION
* COMPLETED

**Creator Capabilities**

* Submit deliverables with file uploads

**Brand Capabilities**

* Review submissions
* Request revisions
* Approve milestones

### Secure File Submission System

* File uploads handled via `/api/files`
* Submissions tied to specific milestone IDs
* Controlled access visibility
* Server-side validation and ownership checks

### Responsive UI System

* Dark + primary theme architecture
* Mobile-first responsive layout
* Desktop table view and mobile card UI patterns
* Reusable agreement detail page structure
* Structured dashboards for both roles

---

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide Icons

### Backend

* Node.js
* RESTful API Architecture
* JWT Authentication
* Role-based Middleware Guards

### Database

* MongoDB
* Mongoose ODM

### Development & Deployment

* Thunder Client (API testing)
* Git & GitHub
* Vercel (Frontend deployment)
* Docker (Local testing environment)

---

## Architecture

### Backend-Dominant Design

* Business logic centralized in server actions and route handlers
* Strict lifecycle transition guards
* Validation before any state mutation
* Milestone gating before agreement activation
* Controlled file upload routing and validation

### Data Modeling Strategy

* Structured Agreement schema
* Embedded Milestone documents
* Submission history tracking
* Role-based query filtering
* Ownership validation before updates

---

## Project Structure

```
/app
  /brand
  /creator
  /api
/components
/lib
/models
/server
```

* `/api` — Route handlers
* `/models` — Mongoose schemas
* `/lib` — Utilities and helpers
* `/server` — Business logic layer
* `/components` — Reusable UI modules

---

## Security

* JWT-based authentication
* Role-level middleware guards
* Agreement ownership validation
* Milestone-level access restriction
* Server-side lifecycle validation before transitions
* Controlled file access policies

---

## Workflow

### Agreement Creation

1. Brand drafts agreement
2. Policies, milestones, and creator selection required
3. Validation before sending agreement

### Creator Review

* Creator can accept or reject agreement

### Active Phase

* Milestones become actionable
* Creator submits deliverables
* Brand reviews and updates milestone status

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/makne.git
cd makne
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file:

```
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run Development Server

```bash
npm run dev
```

---

## API Endpoints

```
POST   /api/auth/login
POST   /api/agreements
PATCH  /api/agreements/:id
POST   /api/milestones/:id/submit
POST   /api/files
```

All routes are protected via authentication and role-based middleware.

---

## Design Philosophy

MAKNE is built with:

* Backend-first architectural thinking
* Structured state transitions
* Production-grade data validation
* Clear separation of concerns
* Mobile and desktop parity
* Scalable UI architecture

The system is designed as a workflow engine rather than a simple CRUD application.

---

## Roadmap

Planned future enhancements include:

* AI-powered content validation
* Federated workflow analytics
* Payment integration system
* Notification engine
* Real-time collaboration
* Admin control panel
* Advanced analytics dashboard

---

## Contributors

**Developed by**
Vaidika Kaul

**Project lifecycle support and guidance**
Gautam Jagthap

---

## License

This project is licensed under the MIT License.

---

## Status

Actively evolving.

* Core agreement lifecycle implemented
* Backend architecture stable
* UI system structured and scalable
* Foundation prepared for advanced workflow and AI integrations
