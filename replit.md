# Overview

This is a full-stack React application called "Track it" - a smart curriculum activity and attendance tracking system. It's built as a Single Page Application (SPA) using React Router 6 with an integrated Express backend server. The application provides functionality for tracking attendance through multiple methods (QR codes, Bluetooth, WiFi, face recognition) and includes features for students, teachers, and administrators to manage schedules, view dashboards, track streaks, and receive notifications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript running in SPA mode via React Router 6
- **Build Tool**: Vite with React SWC plugin for fast development and building
- **Styling**: TailwindCSS 3 with CSS custom properties for theming, supporting both light and dark modes
- **UI Components**: Radix UI primitives with custom styled components following shadcn/ui patterns
- **State Management**: React Context for global state (theme, schedule data), React Query for server state management, local component state with React hooks
- **Icons**: Lucide React for consistent iconography
- **3D Graphics**: Three.js integration for visual elements
- **Progressive Web App**: Service worker implementation with caching strategies

## Backend Architecture
- **Server Framework**: Express.js with CORS and JSON parsing middleware
- **Development Integration**: Vite plugin system integrates Express server during development
- **API Structure**: RESTful endpoints under `/api/` prefix with TypeScript interfaces shared between client and server
- **Environment Configuration**: dotenv for environment variable management
- **Validation**: Zod for runtime type checking and form validation

## Routing and Navigation
- **Client-side Routing**: React Router 6 with lazy loading for code splitting
- **Route Structure**: File-based organization with pages in `client/pages/` directory
- **Navigation**: Centralized layout with responsive navigation bar and command palette for quick navigation
- **Route Progress**: Custom progress indicator for page transitions

## Development and Build System
- **Package Manager**: PNPM preferred for dependency management
- **TypeScript Configuration**: Relaxed strict mode for faster development with path mapping for clean imports
- **Testing**: Vitest for unit testing with coverage support
- **Code Quality**: Prettier for formatting, ESLint configuration implied
- **Build Process**: Separate client and server builds, with client outputting to `dist/spa/` and server to `dist/server/`

## Data Management
- **Client Storage**: localStorage for user preferences, schedules, and application state
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Data Fetching**: React Query for server state management with caching and optimistic updates
- **Type Safety**: Shared TypeScript interfaces between client and server in `shared/` directory

## Deployment Architecture
- **Production Build**: Static SPA with separate Node.js server for API endpoints
- **Vercel Integration**: Configured for serverless deployment with edge functions
- **Static Assets**: Optimized builds with asset hashing and compression
- **Fallback Routing**: Server-side routing fallback to serve React app for client-side routes

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router 6 for SPA routing
- **Build Tools**: Vite with React SWC plugin, TypeScript compiler
- **Server Framework**: Express.js 5 with CORS support

## UI and Styling
- **Component Library**: Radix UI primitives (40+ components including Dialog, Dropdown Menu, Form components)
- **Styling**: TailwindCSS 3 with PostCSS and Autoprefixer
- **Theming**: next-themes for dark/light mode management
- **Charts**: Recharts for data visualization
- **3D Graphics**: Three.js for interactive visual elements

## Form and Validation
- **Form Management**: React Hook Form with @hookform/resolvers
- **Validation**: Zod for schema validation and type safety
- **Input Components**: Custom form components with Radix UI primitives

## State and Data Management
- **Server State**: TanStack React Query (formerly React Query) for server state management
- **Notifications**: Sonner for toast notifications, custom toast system
- **Local Storage**: Custom hooks for localStorage integration

## Development and Testing
- **Testing**: Vitest for unit testing
- **Code Quality**: Prettier for code formatting
- **Type Checking**: TypeScript with custom configuration

## Deployment and Hosting
- **Vercel**: Configured for serverless deployment with custom build commands
- **Serverless Functions**: @vercel/node for API endpoints
- **Environment**: dotenv for environment variable management

## Additional Utilities
- **Class Management**: clsx and tailwind-merge for conditional styling
- **Icons**: Lucide React for consistent iconography
- **Command Interface**: cmdk for command palette functionality
- **Carousel**: Embla Carousel for image/content sliders
- **Resizable Panels**: react-resizable-panels for layout management