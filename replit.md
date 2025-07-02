# iPhone Call Banner Generator

## Overview

This is a full-stack web application that allows users to create realistic iPhone-style incoming call banners with custom company names, caller names, and profile pictures. The application generates high-quality PNG banners that mimic the native iOS incoming call notification banner that appears at the top of the screen when receiving a call while using another app.

The system follows a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database using Drizzle ORM. The application is designed to be deployed on Replit with support for both development and production environments.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage (MemStorage class)
- **Development**: Hot module replacement via Vite middleware

### Development Setup
- **Monorepo Structure**: Client and server code in separate directories with shared schemas
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Development Server**: Vite dev server with Express API proxy
- **Error Handling**: Runtime error overlay for development

## Key Components

### Core Application Logic
- **Canvas Rendering**: HTML5 Canvas API for generating iPhone-style call banners
- **Image Processing**: Client-side image manipulation and download functionality
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Drag-and-drop file upload with validation
- **Banner Design**: Pill-shaped black banner with iOS-style layout and typography

### UI Components
- **Call Banner Generator**: Main component for creating iPhone-style call banners
- **Form Controls**: Input fields, file upload areas, and action buttons
- **Responsive Design**: Landscape banner format with proper aspect ratio
- **Toast Notifications**: User feedback for actions and errors

### Database Schema
- **Users Table**: Basic user authentication schema (id, username, password)
- **Extensible Design**: Schema structure ready for additional features

## Data Flow

1. **User Input**: Users fill form with company name, person name, and optional profile image
2. **Image Processing**: Profile images are validated and converted to base64 data URLs
3. **Banner Generation**: HTML5 Canvas API creates iPhone-style pill-shaped call banner with:
   - Black rounded background with drop shadow
   - Circular profile image on left side
   - Company name (gray) and person name (white bold) text
   - Red decline and green accept action buttons on right
4. **Export Options**: Generated banners can be downloaded as PNG or copied to clipboard
5. **Responsive Design**: Banner displayed in 3:1 aspect ratio container for optimal viewing

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React ecosystem (React, React-DOM, React Hook Form)
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **State Management**: TanStack Query for server state synchronization
- **Utilities**: clsx for conditional classes, date-fns for date handling

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Driver**: Neon serverless PostgreSQL adapter
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Strict type checking with path mapping
- **Linting/Formatting**: Configured for consistent code style
- **Replit Integration**: Cartographer plugin for Replit-specific features

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to dist/public
- **Backend**: esbuild bundles server code to dist/index.js
- **Assets**: Static assets served from attached_assets directory

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Development**: NODE_ENV=development for dev server with HMR
- **Production**: NODE_ENV=production for optimized builds

### Replit Deployment
- **Scripts**: Configured npm scripts for dev, build, and start
- **Port Configuration**: Express server with proper port binding
- **Asset Serving**: Static file serving for production builds

## Changelog

- July 02, 2025: Initial setup with full-screen call screen generator
- July 02, 2025: Redesigned to iPhone-style pill-shaped call banner with:
  - Black rounded banner with drop shadow effects
  - Left-aligned circular profile image
  - Company name in gray and person name in white bold text
  - Right-aligned red decline and green accept buttons
  - Landscape 5:1 aspect ratio format (1000x200px)
  - iOS-style typography using SF Pro/Inter fonts
- July 02, 2025: Updated banner generator with:
  - Transparent background for generated images
  - Fixed download button visibility issue
  - Reduced banner dimensions to 1000x200px
  - Optimized layout for smaller banner size

## User Preferences

Preferred communication style: Simple, everyday language.