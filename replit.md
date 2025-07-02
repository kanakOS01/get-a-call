# iPhone Call Banner Generator

## Overview

This is a web application that allows users to create realistic iPhone-style incoming call banners with custom company names, caller names, and profile pictures. The application generates high-quality PNG banners that mimic the native iOS incoming call notification banner that appears at the top of the screen when receiving a call while using another app.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks for local state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Development Setup
- **Path Aliases**: Configured for clean imports (@/, @assets/)
- **Development Server**: Vite dev server
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
- **Utilities**: clsx for conditional classes, date-fns for date handling

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Strict type checking with path mapping
- **Linting/Formatting**: Configured for consistent code style
- **Replit Integration**: Cartographer plugin for Replit-specific features

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to dist/public
- **Assets**: Static assets served from attached_assets directory

### Environment Configuration
- **Development**: NODE_ENV=development for dev server with HMR
- **Production**: NODE_ENV=production for optimized builds

### Replit Deployment
- **Scripts**: Configured npm scripts for dev, build, and preview
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