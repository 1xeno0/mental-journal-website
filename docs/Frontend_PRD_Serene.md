# Frontend PRD: Serene -- Next.js Client Application

## Role of the Frontend

The frontend is responsible for:

-   Providing a calm, aesthetically pleasing UI
-   Handling authentication flow
-   Allowing users to create and manage journal entries
-   Displaying AI-generated "Vibe Check" responses
-   Showing weekly mood analytics
-   Communicating securely with the Flask backend API

The frontend must prioritize:

-   Calm UX design
-   Clarity and simplicity
-   Fast interaction
-   Secure session handling
-   Clean modular structure

------------------------------------------------------------------------

# 1. Architecture Overview

## Stack

-   Next.js (App Router)
-   React
-   TailwindCSS (recommended)
-   Fetch API (for backend calls)
-   Recharts (for analytics visualization)

## API Base Path

All API requests must go to:

/api/\*

These routes are served by the Flask backend in the same container.

No direct database access is allowed.

------------------------------------------------------------------------

# 2. Core Pages

## A. Landing Page (/)

Purpose: - Communicate product value - Encourage signup

Requirements: - Calm color palette - Clear headline - Short USP
explanation - CTA button ("Start Journaling") - Link to Login if account
exists

------------------------------------------------------------------------

## B. Authentication Pages

### /login

### /register

Requirements: - Email + password inputs - Form validation - Error
messages - Redirect to dashboard after success

Authentication uses httpOnly cookie set by backend.

Frontend must NOT store JWT in localStorage.

------------------------------------------------------------------------

## C. Dashboard (/app)

Protected route.

If user not authenticated → redirect to /login.

Contains: - Mood entry form - Timeline - Weekly analytics summary

------------------------------------------------------------------------

# 3. Mood Entry Component

## Required Inputs

-   Mood selector (visual cards/icons)
-   Tag selector (multi-select chips)
-   Reflective note (textarea)

## Validation Rules

-   Note must be at least 50 characters
-   Mood must be selected

## Submission Behavior

On submit:

POST /api/entries

If successful: - Display AI response - Add entry to timeline immediately

------------------------------------------------------------------------

# 4. Timeline View

Displays:

-   Entries grouped by date:
    -   Today
    -   Yesterday
    -   Last Week

Each entry card must show:

-   Mood
-   Tags
-   Note preview
-   AI response
-   Edit button
-   Delete button

Cards should be color-coded based on mood.

------------------------------------------------------------------------

# 5. Edit Entry Flow

When editing:

PUT /api/entries/{id}

If note changes: - AI response updates

UI must update immediately after save.

------------------------------------------------------------------------

# 6. Delete Entry Flow

DELETE /api/entries/{id}

Remove entry from UI instantly after success.

------------------------------------------------------------------------

# 7. AI "Vibe Check" Display

After saving an entry:

-   Show AI response below note
-   Display in calm supportive style
-   Optional: streaming text animation (if backend supports streaming)

If backend returns disclaimer: - Show clearly separated notice block

------------------------------------------------------------------------

# 8. Weekly Analytics

GET /api/analytics/weekly

Display:

-   Bar chart showing mood distribution
-   Simple legend

Requirements: - Responsive - Clean layout - No excessive visual noise

------------------------------------------------------------------------

# 9. State Management

Recommended:

-   Local React state for form
-   useEffect for fetching entries
-   No global state library required for MVP

------------------------------------------------------------------------

# 10. Error Handling

All API errors must:

-   Show friendly message
-   Not crash UI
-   Provide retry option when relevant

------------------------------------------------------------------------

# 11. Loading States

Frontend must show:

-   Loading spinner during API calls
-   Disabled submit button while saving
-   Skeleton placeholders for timeline

------------------------------------------------------------------------

# 12. Non-Functional Requirements

-   First load \< 2 seconds
-   Smooth transitions
-   Mobile responsive
-   Accessible form labels
-   No layout shifts

------------------------------------------------------------------------

# 13. Environment Variables

NEXT_PUBLIC_API_BASE=/api

(Used for fetch requests if needed.)

------------------------------------------------------------------------

# 14. Out of Scope (MVP)

-   Push notifications
-   Multi-user sharing
-   Themes toggle
-   Social login
-   Offline mode

------------------------------------------------------------------------

# 15. Implementation Order

Recommended build order:

1.  Landing page
2.  Auth pages
3.  Protected dashboard layout
4.  Mood entry form
5.  Timeline
6.  AI response rendering
7.  Weekly analytics chart
8.  Polish & animations
