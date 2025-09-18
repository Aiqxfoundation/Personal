# Organizational Chart Generator - Design Guidelines

## Design Approach
**Selected Approach:** Utility-Focused Design System (Fluent Design)
**Justification:** This is a productivity tool requiring efficiency, clarity, and professional output quality. Users need to quickly create and edit hierarchical structures without distraction.

## Core Design Elements

### Color Palette
**Primary:** 217 19% 27% (Professional navy-blue)
**Secondary:** 217 19% 45% (Medium blue-gray)
**Success:** 142 69% 58% (Green for completed actions)
**Background:** 220 13% 18% (Dark) / 0 0% 98% (Light)
**Surface:** 217 19% 22% (Dark) / 0 0% 100% (Light)
**Text:** 217 19% 88% (Dark) / 217 19% 27% (Light)

### Typography
**Primary:** Inter (Google Fonts) - clean, professional readability
**Hierarchy:** text-xs to text-2xl, font-medium for labels, font-semibold for titles
**Chart Text:** text-sm for names, text-xs for titles within org chart boxes

### Layout System
**Spacing Units:** Tailwind units of 2, 4, 8, 12, 16 (p-4, m-8, gap-12, etc.)
**Grid:** 12-column responsive grid for main layout
**Chart Area:** Centered canvas with 16-unit padding, scrollable with zoom controls

### Component Library

**Navigation:** 
- Top toolbar with file operations (New, Save, Export)
- Left sidebar with templates and hierarchy controls
- Floating zoom/pan controls (bottom-right)

**Chart Elements:**
- Employee boxes: Rounded rectangles with subtle shadows
- Connecting lines: Clean 2px strokes in secondary color
- Hover states: Subtle border color change and elevation
- Selected state: Primary color border with glow effect

**Forms:**
- Modal dialogs for adding/editing positions
- Clean input fields with floating labels
- Dropdown for reporting relationships
- Action buttons (primary blue, outline secondary)

**Data Display:**
- Minimap navigator for large charts (top-right corner)
- Breadcrumb trail for deep hierarchies
- Status indicators for incomplete positions

### Interactions
**Primary Actions:** Drag-and-drop repositioning, double-click to edit
**Secondary Actions:** Right-click context menus, keyboard shortcuts
**Feedback:** Subtle animations on hover, loading states for export
**Visual Hierarchy:** Size differentiation by hierarchy level (CEO larger than managers)

### Professional Export Styling
- High-resolution rendering (300 DPI minimum)
- Consistent spacing and alignment
- Clean typography with proper line heights
- Subtle drop shadows for depth without distraction
- White background for printing compatibility

### Images
**Templates Section:** Small preview thumbnails (150x100px) showing common org structures
**Empty State:** Subtle illustration encouraging users to start building their chart
**No large hero image required** - focus remains on the functional workspace

This utility-focused approach prioritizes clarity, efficiency, and professional output quality over visual flourishes.