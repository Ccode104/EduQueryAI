# EduAssist - AI Educational Assistant for BTech Students

## Overview

EduAssist is an AI-powered educational assistant platform designed specifically for BTech students. The application enables students to upload course materials (notes, previous year questions, textbooks) and interact with an AI assistant that provides contextual answers based on their uploaded documents. The system processes PDF documents using OCR technology, chunks and indexes the content, and uses AI to generate relevant responses with source citations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Design System**: Material Design-inspired productivity interface using the "new-york" Shadcn style variant. Typography uses Inter for UI elements and JetBrains Mono for technical content. The design emphasizes clear information hierarchy and familiar patterns for quick student adoption.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration

**Routing**: Wouter for client-side routing

**Key Pages**:
- Dashboard: Grid view of courses with document counts and quick actions
- Upload: Document upload interface with drag-and-drop and categorization
- Documents: Filterable list of all uploaded documents with status indicators
- Chat: Split-layout chat interface with AI responses and source references

### Backend Architecture

**Runtime**: Node.js with Express server

**Language**: TypeScript with ES modules

**API Design**: RESTful API endpoints for document management, conversations, and messages

**Request Handling**: Express middleware chain with JSON parsing, request logging, and performance monitoring

**File Processing Pipeline**:
1. PDF upload via multer (in-memory storage)
2. Text extraction using pdf-parse
3. OCR fallback using Tesseract.js for scanned documents
4. Text chunking (500 words with 50-word overlap)
5. Simple hash-based embedding generation for similarity search
6. Storage of chunks with metadata

**AI Integration**: Hugging Face Inference API using Mistral-7B-Instruct model with context-aware prompting and token budget management (max 2000 context tokens to control costs)

### Data Storage

**Database**: PostgreSQL (configured for Neon serverless)

**ORM**: Drizzle ORM for type-safe database operations

**Schema**:
- **users**: Basic authentication (id, username, password)
- **documents**: Uploaded files with metadata (name, type, course, processing status, extracted text, file size)
- **conversations**: Chat sessions with optional course filtering
- **messages**: Individual messages in conversations with role (user/assistant) and optional source references

**In-Memory Storage**: Fallback implementation using Map structures for development/testing, storing document chunks with embeddings for similarity search

**Document Chunks**: Stored with embeddings for semantic search, including document reference and page numbers for citation

### External Dependencies

**AI Service**: Hugging Face Inference API
- Model: mistralai/Mistral-7B-Instruct-v0.2
- Purpose: Generate contextual answers to student questions
- Features: Token budget management, context truncation, fallback responses

**Document Processing**:
- pdf-parse: Extract text from standard PDFs
- Tesseract.js: OCR for scanned documents and images
- multer: File upload handling

**UI Component Libraries**:
- Radix UI: Accessible, unstyled component primitives (accordion, dialog, dropdown, popover, etc.)
- Lucide React: Icon library
- Tailwind CSS: Utility-first styling framework

**Database Provider**: Neon serverless PostgreSQL
- Connection: @neondatabase/serverless driver
- Migration: Drizzle Kit for schema management

**Development Tools**:
- Vite: Frontend build tool with HMR
- Replit plugins: Runtime error overlay, cartographer, dev banner
- TypeScript: Type safety across frontend and backend

**Styling Utilities**:
- class-variance-authority: Component variant management
- clsx/tailwind-merge: Conditional class composition
- date-fns: Date formatting and manipulation