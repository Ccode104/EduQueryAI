# Design Guidelines: AI Educational Assistant for BTech Students

## Design Approach
**System:** Material Design-inspired productivity interface
**Rationale:** Education platform requiring clear information hierarchy, efficient workflows, and familiar patterns for quick student adoption. Focus on functionality over visual flourish.

## Typography System
- **Primary Font:** Inter (Google Fonts) for UI elements
- **Secondary Font:** JetBrains Mono for code snippets or technical content
- **Hierarchy:**
  - Headings: text-2xl to text-4xl, font-semibold
  - Body: text-base, font-normal
  - Labels/Metadata: text-sm, font-medium
  - Captions: text-xs, font-normal

## Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-4 or p-6
- Section margins: mb-6 or mb-8
- Grid gaps: gap-4 or gap-6
- Container max-width: max-w-7xl for main content

## Core Components

### 1. Dashboard Layout
- **Two-column layout:** Sidebar (w-64) + Main content area
- **Sidebar:** Fixed navigation with course categories, upload button, and document library
- **Main area:** Grid of course cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6)
- **Course cards:** Rounded-lg border with document count, last updated, and quick action button

### 2. Document Upload Interface
- **Drag-and-drop zone:** Large dashed border area (border-2 border-dashed) with upload icon
- **File list:** Display uploaded PDFs with filename, size, type badge (Notes/PYQ/Book), and processing status
- **Progress indicators:** Linear progress bars for OCR processing
- **Category selector:** Dropdown to assign course/subject during upload

### 3. Chat Interface
- **Split layout:** Chat history (2/3 width) + Document references sidebar (1/3 width)
- **Message bubbles:** User messages (right-aligned, rounded-2xl) vs AI responses (left-aligned, rounded-2xl)
- **Input area:** Fixed bottom with text-lg input field, send button, and attachment option
- **Citations:** Inline source tags within AI responses linking to specific documents
- **Conversation history:** Collapsible previous sessions with timestamps

### 4. Document References Panel
- **Sticky sidebar:** Shows relevant documents used in current answer
- **Document cards:** Compact cards with document name, excerpt preview, and page number
- **Quick preview:** Click to expand document snippet in modal overlay

### 5. Navigation
- **Top bar:** Logo, search bar (w-full max-w-2xl), and user profile
- **Sidebar menu:** Icon + label navigation items with active state indicators
- **Breadcrumbs:** For deep navigation in document library

## UI Patterns

### Cards
- Consistent rounded-lg with border
- Padding: p-6
- Hover: subtle shadow lift (hover:shadow-lg)
- Header: flex justify-between items-center

### Buttons
- **Primary:** Solid fill, rounded-lg, px-6 py-3
- **Secondary:** Border outline, rounded-lg, px-6 py-3
- **Icon buttons:** Rounded-full, p-2
- Implement standard hover/active states

### Forms
- **Input fields:** Rounded-lg border, px-4 py-3, focus ring
- **Labels:** text-sm font-medium mb-2
- **Error states:** Red border with helper text below

### Modals/Overlays
- **Backdrop:** Semi-transparent overlay
- **Container:** Centered, rounded-xl, max-w-2xl, p-8
- **Close button:** Top-right corner, rounded-full icon button

## Icons
**Library:** Heroicons (via CDN)
- Upload: CloudArrowUpIcon
- Chat: ChatBubbleLeftRightIcon
- Document: DocumentTextIcon
- Search: MagnifyingGlassIcon
- Course: AcademicCapIcon
- Settings: CogIcon

## Responsive Behavior
- **Mobile (< 768px):** Single column, hamburger menu for sidebar, full-width chat
- **Tablet (768px - 1024px):** Collapsible sidebar, two-column grids
- **Desktop (> 1024px):** Full sidebar visible, three-column grids, split chat view

## Special Considerations
- **Loading states:** Skeleton screens for document processing
- **Empty states:** Friendly illustrations with clear CTAs to upload documents
- **Error handling:** Toast notifications for upload failures or API errors
- **Accessibility:** ARIA labels for all interactive elements, keyboard navigation throughout

## Images
No hero image required for this utility application. Use simple document/education-themed icons and illustrations for empty states only.