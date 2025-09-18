# Organizational Chart Generator

## Overview

This is a professional organizational chart generator built with React and TypeScript. The application allows users to create, visualize, and export hierarchical organizational structures with a clean, modern interface. It features an interactive org chart component that can render organizational data in a tree structure with connecting lines between positions, and includes functionality to download high-quality PNG images of the generated charts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a modern React architecture with TypeScript:
- **Component Structure**: Modular component design with reusable UI components from shadcn/ui
- **State Management**: Uses React hooks for local state management and React Query for server state
- **Routing**: Implements client-side routing with Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom design tokens and a professional color scheme based on Fluent Design principles
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
Express.js server with TypeScript:
- **API Layer**: RESTful API structure with Express routes (currently minimal implementation)
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)
- **Development Setup**: Integrated with Vite for seamless full-stack development experience

### Data Management
- **Schema Definition**: Centralized schema definitions in shared directory using Zod for validation
- **ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **Database**: PostgreSQL database (configured but not actively used in current implementation)
- **Type Safety**: Full TypeScript integration from database to UI components

### UI Design System
- **Component Library**: shadcn/ui components with custom styling
- **Theme System**: CSS variables for consistent theming with dark/light mode support
- **Typography**: Inter font family for professional appearance
- **Color Palette**: Professional navy-blue primary color scheme with semantic color tokens
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

### Chart Rendering
- **Visualization**: Custom React components for hierarchical chart rendering
- **Export Functionality**: html2canvas integration for high-quality PNG export
- **Interactive Features**: Node selection, editing capabilities, and zoom/pan controls (planned)
- **Layout Algorithm**: Tree-based layout system for automatic positioning of org chart nodes

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **TypeScript**: Type safety across the entire application
- **Express.js**: Backend web server framework
- **Vite**: Build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL database operations
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library built on Radix UI
- **Radix UI**: Headless UI components for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating component variants
- **clsx & tailwind-merge**: CSS class manipulation utilities

### Form Management & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching
- **TanStack Query (React Query)**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Chart Export
- **html2canvas**: HTML to canvas conversion for chart export functionality

### Development & Build Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment