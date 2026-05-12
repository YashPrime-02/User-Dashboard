# User Dashboard - Angular Frontend Assignment

## Overview

This project is a modern Angular User Dashboard built as part of a Frontend Engineer assignment.

The application allows users to:

- View users in a dynamic table
- Add new users through a lazy-loaded modal form
- Edit existing users
- Delete users
- Search and filter users
- View role distribution using a dynamic Chart.js doughnut chart
- Persist data using localStorage
- Navigate paginated user data

The project focuses heavily on:

- Angular standalone architecture
- RxJS state management
- Lazy loading optimization
- Reactive forms
- Performance-focused frontend practices

---

# Tech Stack

- Angular 17+
- TypeScript
- RxJS
- Chart.js
- SCSS
- Standalone Components

---

# Features

## User Management

- Add User
- Edit User
- Delete User
- Search Users
- Pagination
- Toast Notifications

## Dynamic Analytics

- Real-time role distribution chart
- Doughnut chart using Chart.js
- Automatic updates on CRUD operations

## Lazy Loading

### Chart.js Lazy Loading

Chart.js is dynamically imported only when required.

```ts
await import('chart.js/auto');
```

### UserFormComponent Lazy Loading

The modal component is dynamically imported and instantiated only when the user opens the modal.

```ts
await import('../user-form/user-form');
```

This improves initial bundle performance.

---

# State Management

RxJS `BehaviorSubject` is used for reactive state management.

```ts
private usersSubject =
  new BehaviorSubject<User[]>([]);
```

All UI sections automatically update when the user state changes.

---

# Form Validation

Reactive Forms validation includes:

- Required fields
- Email validation
- Minimum name length
- Role selection validation

---

# Design Requirements Implemented

## Theme Colors

- #383838
- #1c4980

## UI Standards

- Inputs: 48px height
- Buttons: 48px height
- Responsive layout
- Modern card-based UI

---

# Bonus Features Implemented

- Pagination
- Search / Filtering
- Edit User
- Delete User
- localStorage Persistence
- Toast Notifications

---

# Project Structure

```bash
src/app
│
├── components
│   ├── user-dashboard
│   └── user-form
│
├── models
│   └── user.ts
│
├── services
│   └── user.ts
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
ng serve
```

Navigate to:

```bash
http://localhost:4200
```

---

# Performance Optimizations

- Lazy-loaded Chart.js
- Lazy-loaded UserFormComponent
- Dynamic component rendering
- Reactive UI updates
- Optimized pagination rendering

---

# Acceptance Criteria Coverage

| Requirement | Status |
|---|---|
| Dynamic User Table | ✅ |
| Chart.js Role Distribution | ✅ |
| Lazy-loaded Modal | ✅ |
| Lazy-loaded Chart.js | ✅ |
| RxJS BehaviorSubject | ✅ |
| Real-time Updates | ✅ |
| Form Validation | ✅ |
| Responsive Design | ✅ |
| No Console Errors | ✅ |

---

# Author

Yash Mishra

Frontend Developer
