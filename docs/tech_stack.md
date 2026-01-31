# Tech Stack & Architecture for Offline-First SaaS BMS

## 1. Executive Summary

To achieve the goal of a "Premium," "Reliable," and "Offline-First" Booking Management System, we need a stack that blends the performance of a native app with the reach of the web (PWA). The architecture will prioritize **Local-First** interactions—meaning the UI reads/writes to a local database immediately, and synchronizes with the cloud in the background.

## 2. The Core Stack

### Frontend Application

- **Framework:** **Next.js 15 (App Router)**
  - _Why:_ Industry standard, excellent PWA support, hybrid rendering (Static + Dynamic), and easy deployment to Vercel.
- **Language:** **TypeScript**
  - _Why:_ Non-negotiable for a complex BMS to ensure type safety across booking logic and dates.
- **Styling & UI:** **Tailwind CSS** + **Shadcn/UI** + **Framer Motion**
  - _Why:_ Tailwind for speed. Shadcn/UI for accessible, premium-looking components that we can fully customize. Framer Motion for the "wow" factor (page transitions, micro-interactions) requested.

### Backend & Cloud Infrastructure

- **BaaS (Backend-as-a-Service):** **Supabase**
  - _Why:_ Provides a scalable PostgreSQL database, Authentication, Real-time subscriptions, and Edge Functions out of the box.
- **Database:** **PostgreSQL** (via Supabase)
  - _Why:_ Hotel data is highly relational (Rooms <-> Bookings <-> Guests <-> Invoices). NoSQL is often a trap for this specific domain due to complex availability queries.

## 3. The "Offline-First" Architecture

This is the most critical decision. We need a Local Database in the browser that mimics our Cloud Database.

### Option A: The "Enterprise Sync" Route (Recommended)

**Tech:** **PowerSync** + **SQLite (WASM)**

- **How it works:** PowerSync runs a real SQLite database inside the browser (via WebAssembly). It maintains an automatic continuous sync with Supabase Postgres.
- **Pros:** You can write actual SQL queries locally (e.g., `SELECT * FROM rooms WHERE id NOT IN (SELECT room_id FROM bookings...)`). This is HUGE for checking room availability offline.
- **Cons:** Requires setup of a "Sync Service" (PowerSync offers a free tier).

### Option B: The "Custom Build" Route (Fallback)

**Tech:** **Dexie.js** (IndexedDB) + **Custom Sync Queue**

- **How it works:** We use Dexie.js to store JSON objects in the browser's IndexedDB. We build a custom "Mutation Queue" that captures user actions (e.g., `CREATE_BOOKING`) and replays them to the API when online.
- **Pros:** Free, no external dependencies, full control.
- **Cons:** Complex availability logic is harder to write in IndexedDB compared to SQL. You have to handle "Conflict Resolution" manually.

**Recommendation:** For this project, we will start with **Option B (Dexie.js)** for simplicity and zero-cost, but architect the data layer so we can swap to PowerSync if complex SQL needs arise.

## 4. Detailed Library Selection

| Category             | Technology                       | Reasoning                                                                                       |
| :------------------- | :------------------------------- | :---------------------------------------------------------------------------------------------- |
| **State Management** | **Zustand**                      | Lightweight, simple hook-based state. Perfect for managing the "Sync Queue" and UI state.       |
| **Data Fetching**    | **TanStack Query (React Query)** | Industry standard. We will use it with its `networkMode: 'offlineFirst'` setting.               |
| **Forms**            | **React Hook Form + Zod**        | Performance focused forms with strict schema validation (crucial for booking dates validation). |
| **Date Handling**    | **date-fns**                     | Lightweight date math (needed for Check-in/Check-out calculations).                             |
| **Icons**            | **Lucide React**                 | Clean, modern, consistent icon set.                                                             |
| **PWA Helpers**      | **@ducanh2912/next-pwa**         | Modern wrapper to generate `manifest.json` and Service Workers for Next.js 14/15.               |

## 5. Development Workflow

1.  **Initialize Project:** Setup Next.js with Shadcn/UI.
2.  **Database Schema:** Define SQL schema in Supabase (Rooms, Rates, Bookings).
3.  **Local DB Layer:** Create a Dexie.js schema that mirrors the Supabase definitions.
4.  **Sync Engine:** Build a hook `useSync()` that:
    - Pulls latest data from Supabase → updates Dexie.
    - Listens for online status `window.addEventListener('online', ...)` → pushes queued mutations.
5.  **Offline UI:** Build the grid/calendar to read solely from Dexie, ensuring it works 100% without network.

## 6. Offline "Gotchas" to Mitigate

- **Double Booking:** If two staff members book Room 101 offline on different devices, a conflict occurs.
  - _Solution:_ Optimistic UI + "Soft Locks". We allow the booking but mark it as "Pending Sync". The server validates the final timestamp. If conflict, the second user gets a "Conflict Resolved" notification and is moved to a waitlist or asked to pick another room.
