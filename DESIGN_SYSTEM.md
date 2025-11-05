# Design System Documentation - SintasApp

## Font Family
**Montserrat** digunakan untuk seluruh aplikasi
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- **Source**: Google Fonts

## Color Palette

### Primary Colors (Green Theme)
- **Dark Green**: `#32642D` - Company badge, icon colors
- **Medium Green**: `#72AB72` - Background gradient start
- **Light Green**: `#C8FFC8` - Background gradient end
- **Green Icon**: `#2d6a4f` - Time icons, check-in icons
- **Green Accent**: `#7fb069` - Active states

### Neutral Colors
- **Dark Gray**: `#2d3436` - Primary text
- **Medium Gray**: `#636e72` - Secondary text, labels
- **Light Gray**: `#D9D9D9` - Icon circles, placeholders
- **Light Gray BG**: `#F2F2F2` - Card backgrounds, menu buttons
- **White**: `#ffffff` - Borders, highlights
- **Light Text**: `#e4dddd` - Text on dark backgrounds

### Status Colors
- **Check-in (Green)**: `#2d6a4f` - Check-in icons and indicators
- **Check-out (Red)**: `#8b3e3e` - Check-out icons and indicators
- **Hadir (Success)**: `#d4edda` background, `#155724` text
- **Tidak Hadir (Danger)**: `#f8d7da` background, `#721c24` text
- **Izin (Warning)**: `#fff3cd` background, `#856404` text
- **Cuti (Info)**: `#d1ecf1` background, `#0c5460` text

## Typography

### Font Sizes
- **Large Heading**: `24px` (font-weight: 700) - Greeting text
- **Section Title**: `16px` (font-weight: 600) - Section headers
- **Card Title**: `14px` (font-weight: 600-700) - Card headers, dates
- **Body Text**: `13-14px` (font-weight: 400-500) - Regular content
- **Small Text**: `11-12px` (font-weight: 500) - Labels, hints
- **Large Time**: `18-20px` (font-weight: 700) - Time display

### Font Weights
- **Regular (400)**: Body text
- **Medium (500)**: Labels, secondary text
- **Semi-bold (600)**: Section titles, card titles
- **Bold (700)**: Headings, time values, important text

## Spacing & Layout

### Container
- **Max Width**: `480px` - Main container max width
- **Padding**: `20px 16px` - Container padding
- **Gap Between Elements**: `12px`, `16px`, `20px`, `24px`

### Border Radius
- **Small**: `10px` - Icon boxes, small elements
- **Medium**: `14px` - Cards, badges
- **Large**: `18px` - Menu buttons, large cards
- **Circle**: `50%` - Profile pics, buttons

### Shadows
- **Light**: `0 2px 6px rgba(0, 0, 0, 0.06)` - Subtle elevation
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.08)` - Card elevation
- **Strong**: `0 8px 20px rgba(0, 0, 0, 0.08)` - Major elevation
- **Colored Shadows**: Status-specific colored shadows for interactive elements

## Component Patterns

### Cards
- **Background**: White or light gray (`#F2F2F2` or `rgba(255, 255, 255, 0.95)`)
- **Border**: `1px solid rgba(255, 255, 255, 0.6-0.9)`
- **Border Radius**: `14px` or `18px`
- **Padding**: `16px` or `17px`
- **Shadow**: Medium shadow for depth

### Buttons
- **Menu Buttons**: `70px x 70px`, `#F2F2F2` background, `18px` border radius
- **Icon Size**: `40px` for menu buttons, `28-32px` for nav buttons
- **Hover/Active**: `transform: translateY(1px) scale(0.98)` with shadow reduction

### Icons
- **Icon Circles**: `44px` diameter, `#D9D9D9` background
- **Icon Boxes**: `40px x 40px`, colored background (`#2d6a4f` or `#8b3e3e`)
- **Icon Size**: Varies by context (16px-40px)

### Navigation
- **Bottom Nav Height**: `70px`
- **Nav Button**: `50px x 50px`
- **Active State**: White background (`rgba(255, 255, 255, 0.8)`), `16px` border radius
- **Fingerprint Button**: `70px` diameter, centered in nav, with gradient

## Background Patterns

### Main Background
- **Gradient**: `linear-gradient(180deg, #72AB72 30%, #C8FFC8 100%)`
- Creates soft green gradient from darker to lighter

### Card Backgrounds
- **Primary Cards**: `#F2F2F2` (solid gray)
- **Secondary Cards**: `rgba(255, 255, 255, 0.5-0.95)` with backdrop-filter
- **Backdrop Filter**: `blur(8px)` for glass effect

## Interactive States

### Hover/Active
- **Buttons**: Slight scale down (`scale(0.98)`) and shadow reduction
- **Transitions**: `0.15s-0.2s ease` for smooth interactions

### Disabled
- **Opacity**: `0.5`
- **Cursor**: `not-allowed`

## Responsive Breakpoints
- **Small Devices**: `max-width: 360px`
  - Reduced font sizes
  - Smaller button dimensions
  - Adjusted spacing

## Design Principles

1. **Consistency**: Same spacing, border radius, and color usage throughout
2. **Clarity**: High contrast text on backgrounds, clear visual hierarchy
3. **Modern**: Soft shadows, rounded corners, glass morphism effects
4. **Accessibility**: Good contrast ratios, readable font sizes
5. **Mobile-First**: Optimized for touch targets (minimum 44px)
6. **Visual Hierarchy**: Font weight and size variation for importance
7. **Status Feedback**: Color-coded states for actions and attendance status

## Component Library Reference

### Header Section
- Company badge: Dark green (`#32642D`), rounded (`14px`)
- Greeting: Large text (`24px`, `700`), light color (`#e4dddd`)
- Profile pic: `60px` circle, white border (`3px`)

### Date Time Card
- Background: `#F2F2F2`
- Icon circles: `#D9D9D9` background, `44px` diameter
- Time values: Large (`20px`, `700`)

### Menu Section
- Buttons: `70px x 70px`, `#F2F2F2` background
- Icons: `40px`, green color (`#32642d`)

### Attendance Cards
- Each item: White background, `14px` border radius
- Time blocks: Horizontal layout with colored icon boxes
- Check-in: Green (`#2d6a4f`)
- Check-out: Red (`#8b3e3e`)

### Bottom Navigation
- Gradient background: `linear-gradient(135deg, #c9e4b8 0%, #C8FFC8 100%)`
- Fingerprint button: Gradient, `70px` diameter, elevated
- Nav buttons: `50px x 50px`, active state with white background

