# 🎨 Ice Cost Calculator - Design System

## 📋 Overview

Professional SaaS design system for the Ice Cost Calculator application, built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🎯 Design Principles

### 1. **Professional & Clean**
- Minimalist interface with focus on functionality
- Consistent spacing using 4rem margins and 12-column grid
- Professional color palette optimized for SaaS applications

### 2. **Responsive-First**
- Mobile-first approach with breakpoints at 768px, 1024px, 1280px
- Collapsible sidebar (240px expanded / 72px collapsed)
- Adaptive layouts for all screen sizes

### 3. **Accessibility (AA Compliant)**
- High contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- ARIA roles and labels
- Focus indicators and screen reader support

### 4. **Performance Optimized**
- Lazy loading for heavy components
- Optimized animations with Framer Motion
- Minimal bundle size with tree-shaking

## 🎨 Color Palette

```css
/* Primary Colors */
--primary: #2563eb (Blue 600)
--secondary: #10b981 (Emerald 500)
--warning: #f59e0b (Amber 500)
--danger: #ef4444 (Red 500)
--success: #10b981 (Emerald 500)

/* Neutral Colors */
--gray-50: #f8fafc
--gray-100: #f1f5f9
--gray-600: #475569
--gray-900: #0f172a
```

## 📐 Layout System

### Grid System (12 Columns)
```tsx
<Grid cols={12} gap="md">
  <Col span={6} spanMd={4} spanLg={3}>Content</Col>
  <Col span={6} spanMd={8} spanLg={9}>Content</Col>
</Grid>
```

### Container Sizes
- **sm**: 640px max-width
- **md**: 768px max-width  
- **lg**: 1024px max-width
- **xl**: 1280px max-width (default)
- **2xl**: 1536px max-width

### Spacing Scale
- **4rem**: Container padding
- **1.5rem**: Grid gaps
- **0.5rem**: Component spacing

## 🧩 Component Library

### Core Components

#### Button
```tsx
<Button variant="primary" size="md" icon={<Plus />}>
  Add Recipe
</Button>
```

**Variants**: primary, secondary, outline, ghost, danger, success
**Sizes**: sm, md, lg, xl

#### Input
```tsx
<Input 
  label="Recipe Name"
  placeholder="Enter recipe name"
  icon={<Search />}
  error="This field is required"
/>
```

#### Card
```tsx
<Card padding="md" shadow="md" hover>
  <CardHeader>
    <CardTitle>Recipe Details</CardTitle>
    <CardDescription>Manage your recipe information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### KpiCard
```tsx
<KpiCard
  title="Total Recipes"
  value="24"
  icon={ChefHat}
  color="primary"
  tooltip="Total recipes in system"
/>
```

### Layout Components

#### Header
- Fixed position with backdrop blur
- Logo, search bar, notifications, user menu
- Responsive design with mobile hamburger menu

#### Sidebar
- Collapsible (240px / 72px)
- Smooth animations with Framer Motion
- Keyboard shortcuts (Ctrl+B to toggle)
- Mobile overlay on small screens

#### MainContent
- Responsive margins based on sidebar state
- Container with max-width and padding
- Smooth transitions

## ⌨️ Keyboard Shortcuts

- **Ctrl + B**: Toggle sidebar
- **Escape**: Close sidebar (mobile)
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Sidebar Behavior
- **< 1024px**: Collapsed by default, overlay when open
- **≥ 1024px**: Expanded by default, pushes content

## 🎭 Animations

### Framer Motion Presets
```tsx
// Page transitions
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Button interactions
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Sidebar animations
animate={{ x: isOpen ? 0 : -240 }}
transition={{ duration: 0.3, ease: 'easeInOut' }}
```

## 🔧 Implementation Guidelines

### File Structure
```
src/
├── components/
│   ├── layout/          # Layout components
│   ├── ui/              # Reusable UI components
│   ├── kpi/             # KPI and dashboard components
│   └── [feature]/       # Feature-specific components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
└── app/                 # Next.js app directory
```

### Naming Conventions
- **Components**: PascalCase (e.g., `KpiCard`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: Tailwind utility classes
- **Props**: camelCase

### Best Practices
1. Use TypeScript for all components
2. Include proper ARIA labels and roles
3. Test keyboard navigation
4. Optimize for performance with React.memo when needed
5. Use semantic HTML elements
6. Follow mobile-first responsive design

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install framer-motion @tanstack/react-query chart.js react-chartjs-2
```

2. Import components:
```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/kpi/KpiCard';
```

3. Use the layout system:
```tsx
import { MainLayout, Container, Grid, Col } from '@/components/layout/MainLayout';
```

## 📊 Performance Metrics

### Target Lighthouse Scores
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Bundle Size Optimization
- Tree-shaking enabled
- Dynamic imports for heavy components
- Optimized images and assets
- Minimal CSS footprint with Tailwind purging
