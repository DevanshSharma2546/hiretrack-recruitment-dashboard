# HireTrack – Recruitment Dashboard

## Overview

HireTrack is a frontend-based recruitment dashboard that simulates an Applicant Tracking System (ATS). It allows recruiters to manage job postings, track candidates, and visualize hiring progress through an interactive pipeline.

This project is built entirely on the frontend and uses mock APIs and local storage to replicate backend behavior.

---

## Features

* 📊 Dashboard with recruitment metrics
* 💼 Job management (view and manage job postings)
* 👤 Candidate tracking system
* 🔄 Drag-and-drop hiring pipeline
* 🧪 Assessment tracking
* 🔐 Simulated authentication system

---

## Tech Stack

* **React (v19)** – UI development
* **Vite** – Build tool for fast development
* **Dexie.js** – IndexedDB wrapper for local data storage
* **MSW (Mock Service Worker)** – Mock API simulation
* **DND Kit** – Drag-and-drop functionality
* **date-fns** – Date utilities

---

## Project Structure

```
src/
│── components/       # Reusable UI components
│── pages/            # Application screens (Dashboard, Jobs, etc.)
│── context/          # Global state (AuthContext)
│── services/         # Mock API and data handling
│── App.jsx           # Main app logic and routing
│── main.jsx          # Entry point
```

---

## How It Works

1. User logs in via a simulated authentication system
2. Auth state is managed using React Context
3. The dashboard and pages fetch data from mock services
4. Data is stored locally using IndexedDB (Dexie)
5. Drag-and-drop updates candidate status in the pipeline

---

## Limitations

* No real backend (all data is mocked)
* Authentication is not secure (client-side only)
* Data is stored locally and not shared across devices
* Routing is handled manually instead of using a full routing system

---

## Future Improvements

* Integrate a real backend (Node.js / Express)
* Replace mock APIs with real endpoints
* Implement secure authentication (JWT)
* Add proper routing using React Router
* Improve scalability and state management

---

## Getting Started

### Installation

```bash
npm install
```

### Run the project

```bash
npm run dev
```

---

## Key Learning Outcomes

* Managing state using React Context
* Simulating backend behavior using MSW
* Working with IndexedDB via Dexie
* Implementing drag-and-drop interfaces
* Structuring scalable frontend applications

```
```
