# Loading Animation System

This portfolio project includes a comprehensive loading animation system designed for optimal user experience during page transitions and data fetching.

## Features

- **Global Page Loading**: Automatic loading states for route transitions
- **Section-Specific Loading**: Different loading experiences for admin and portfolio sections
- **Reusable Components**: Modular loading components for various use cases
- **Premium Animations**: Custom CSS animations matching the design system
- **Dark Mode Support**: Fully compatible with the app's dark/light theme
- **Responsive Design**: Optimized for all screen sizes

## Implementation

### 1. Global Loading (`app/loading.tsx`)
Automatically shows during page navigation and initial app load.

```tsx
import { PageLoading } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return <PageLoading text="Loading your portfolio..." />;
}
```

### 2. Section-Specific Loading
- **Admin Section** (`app/(admin)/loading.tsx`): Clean admin-focused loading
- **Portfolio Section** (`app/(portfolio)/loading.tsx`): Branded portfolio loading

### 3. Reusable Components (`components/ui/LoadingSpinner.tsx`)

#### PageLoading Component
Full-screen overlay with backdrop blur and premium styling.

```tsx
import { PageLoading } from '@/components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <PageLoading text="Custom loading message..." />
  );
}
```

#### LoadingSpinner Component
Flexible spinner for inline loading states.

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <LoadingSpinner
      size="md" // 'sm' | 'md' | 'lg'
      text="Loading data..."
      showDots={true}
      className="my-custom-class"
    />
  );
}
```

#### SkeletonLoader Component
For content placeholder loading.

```tsx
import { SkeletonLoader } from '@/components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <SkeletonLoader className="space-y-4" />
  );
}
```

## Usage Examples

### Loading State for Data Fetching
```tsx
'use client';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching data..." />;
  }

  return <div>{/* Your content */}</div>;
}
```

### Loading State for Form Submissions
```tsx
'use client';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitForm(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2"
      >
        {submitting && <LoadingSpinner size="sm" showDots={false} />}
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### Loading State for Modal Content
```tsx
'use client';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProjectModal({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject(projectId).then(setProject).finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="modal">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner text="Loading project details..." />
        </div>
      ) : (
        /* Project content */
      )}
    </div>
  );
}
```

## Customization

### Custom Loading Messages
```tsx
<PageLoading text="Preparing your experience..." />
<LoadingSpinner text="Uploading files..." />
```

### Custom Styling
```tsx
<LoadingSpinner
  className="text-blue-600 dark:text-blue-400"
  size="lg"
/>
```

### Conditional Loading States
```tsx
{isLoading && <LoadingSpinner />}
{!isLoading && <YourContent />}
```

## Animation Details

The loading system uses custom CSS animations:
- `animate-loading-ring`: Smooth rotating ring
- `animate-loading-dots`: Staggered dot animation
- `animate-pulse-glow`: Subtle glow effect
- `animate-shimmer`: Text shimmer effect

## Performance Considerations

- Components use CSS animations for optimal performance
- Loading states are automatically handled by Next.js App Router
- Minimal re-renders with proper state management
- Backdrop blur for modern visual appeal

## Accessibility

- Screen reader friendly loading messages
- Proper ARIA labels where applicable
- Reduced motion support (respects user's motion preferences)
- High contrast colors for visibility

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Fallback animations for older browsers
- Progressive enhancement approach
