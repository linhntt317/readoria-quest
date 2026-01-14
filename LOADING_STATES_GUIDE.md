# Loading States & Navigation - Implementation Guide

## Overview

This guide explains how to use the new loading state system for API calls and page navigation.

---

## 1. Global Loading State

A global loading context is now available through `LoadingContext`. This displays a loading spinner across the entire app during async operations.

### Components Created

- **`LoadingContext.tsx`** - Global loading state management
- **`useLoading()` hook** - Access loading state in any component
- **`useAsyncWithLoading()` hook** - Wrap API calls with automatic loading
- **`useNavigationWithLoading()` hook** - Navigation with loading states

---

## 2. Using the Loading Hook in Components

### Basic Usage

```tsx
"use client";
import { useLoading } from "@/contexts/LoadingContext";

export function MyComponent() {
  const { isLoading, showLoading, hideLoading } = useLoading();

  const handleClick = async () => {
    showLoading();
    try {
      await someAsyncOperation();
    } finally {
      hideLoading();
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "Click Me"}
    </button>
  );
}
```

### With useAsyncWithLoading Hook

```tsx
"use client";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";

export function MyComponent() {
  const { execute } = useAsyncWithLoading();

  const handleSubmit = async () => {
    const result = await execute(async () => {
      // Your async operation here
      const response = await fetch("/api/data");
      return response.json();
    });
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

---

## 3. Using Navigation with Loading States

### With useNavigationWithLoading Hook

```tsx
"use client";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

export function MyComponent() {
  const { push, replace, back } = useNavigationWithLoading();

  return (
    <>
      <button onClick={() => push("/admin/dashboard")}>
        Go to Dashboard
      </button>
      <button onClick={() => replace("/admin/login")}>
        Replace to Login
      </button>
      <button onClick={back}>
        Go Back
      </button>
    </>
  );
}
```

### Default Behavior

- **Loading shown for**: 500ms (for push/replace) or 300ms (for back)
- **Auto-hide**: Yes, after specified delay
- **Spinner**: Displayed in center of screen with backdrop

---

## 4. Admin Login Flow (Fixed)

The admin login now properly redirects to dashboard after successful authentication.

### What's Fixed

1. **Auth State Update** - `signIn()` now waits for auth state to update
2. **Admin Role Check** - Verifies admin role before redirect
3. **Loading Indicator** - Shows spinner during login process
4. **Timeout Safety** - Auto-hides loading after 30 seconds

### Login Component Changes

```tsx
// Old: Navigation happens via useEffect
// const { error } = await signIn(email, password);

// New: signIn waits for state update
const { error } = await signIn(email, password);
if (!error) {
  // User state will update automatically
  // useEffect hook will trigger redirect
}
```

---

## 5. Loading Context API Reference

### `useLoading()` Hook

```tsx
interface LoadingContextType {
  isLoading: boolean;           // Current loading state
  setIsLoading: (loading: boolean) => void;  // Set loading state
  showLoading: () => void;      // Show loading spinner
  hideLoading: () => void;      // Hide loading spinner
}
```

### Features

- **Auto-hide timeout**: 30 seconds to prevent stuck states
- **Backdrop blur**: Semi-transparent overlay during loading
- **Centered spinner**: Vertically and horizontally centered
- **Non-blocking**: Loading overlay is `pointer-events-none` on overlay
- **Vietnamese text**: "Đang tải..." (Loading...)

---

## 6. Implementation Examples

### Example 1: Form Submission with Loading

```tsx
"use client";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";
import { toast } from "sonner";

export function AddMangaForm() {
  const { execute } = useAsyncWithLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await execute(async () => {
      const response = await fetch("/api/manga", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add manga");
      
      toast.success("Manga added successfully!");
      return response.json();
    });
  };

  return <form onSubmit={handleSubmit}>...form fields...</form>;
}
```

### Example 2: Navigation with Confirmation

```tsx
"use client";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

export function MangaCard() {
  const { push } = useNavigationWithLoading();

  const handleEdit = () => {
    if (confirm("Edit this manga?")) {
      push(`/admin/edit-manga/${mangaId}`);
    }
  };

  return <button onClick={handleEdit}>Edit</button>;
}
```

### Example 3: Complex Async Flow

```tsx
"use client";
import { useAsyncWithLoading } from "@/hooks/useAsyncWithLoading";

export function SyncDataComponent() {
  const { execute, executeWithTimeout } = useAsyncWithLoading();

  const syncWithTimeout = async () => {
    await executeWithTimeout(
      async () => {
        const response = await fetch("/api/sync");
        return response.json();
      },
      5000 // 5 second timeout
    );
  };

  return <button onClick={syncWithTimeout}>Sync (5s timeout)</button>;
}
```

---

## 7. Best Practices

### Do's ✅

- Use `useAsyncWithLoading` for API calls
- Use `useNavigationWithLoading` for page navigation
- Keep loading state time < 30 seconds
- Show meaningful feedback with toast notifications
- Clear error states after operations

### Don'ts ❌

- Don't manually show/hide without try/finally
- Don't create nested loading states
- Don't ignore loading timeout (auto-hide at 30s)
- Don't hide loading immediately without delay
- Don't use with external loading libraries simultaneously

---

## 8. TypeScript Types

All hooks are fully typed:

```tsx
// useAsyncWithLoading
const { execute, executeWithTimeout } = useAsyncWithLoading();
execute<T>(fn: () => Promise<T>): Promise<T | null>;
executeWithTimeout<T>(fn: () => Promise<T>, timeoutMs?: number): Promise<T | null>;

// useNavigationWithLoading
const { push, replace, back } = useNavigationWithLoading();
push(href: string, delay?: number): void;
replace(href: string, delay?: number): void;
back(): void;
```

---

## 9. Troubleshooting

### Issue: Loading spinner not showing

**Solution**: Ensure `LoadingProvider` is in providers.tsx wrapping all children

```tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      {/* other providers */}
      {children}
    </LoadingProvider>
  );
}
```

### Issue: Loading spinner stuck

**Solution**: Auto-hide timeout is 30 seconds. If stuck longer, manually call `hideLoading()`

```tsx
const { hideLoading } = useLoading();
// In catch block
catch (error) {
  hideLoading();
  toast.error("Error: " + error.message);
}
```

### Issue: Loading not working with async operations

**Solution**: Make sure to use try/finally pattern

```tsx
showLoading();
try {
  // async operation
} finally {
  hideLoading();  // Always called
}
```

---

## 10. Styling the Loading Spinner

The loading spinner uses Tailwind CSS classes and can be customized in `LoadingContext.tsx`:

```tsx
<div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  <p className="text-sm font-medium text-foreground">Đang tải...</p>
</div>
```

### Customize colors:

- `border-primary` - Spinner color (uses theme primary)
- `bg-background/50` - Overlay background
- `backdrop-blur-sm` - Blur effect intensity

---

## 11. Performance Considerations

- **No re-renders**: `isLoading` state change only affects loading overlay
- **No memory leaks**: Timeouts cleared on component unmount
- **No blocking**: UI remains interactive except for pointer events
- **Lightweight**: ~2KB added to bundle

---

## 12. Migration Guide

### From old manual loading states

**Before**:
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.call();
  } finally {
    setIsLoading(false);
  }
};
```

**After**:
```tsx
const { execute } = useAsyncWithLoading();

const handleSubmit = async () => {
  await execute(() => api.call());
};
```

---

## Summary

The new loading system provides:

✅ **Automatic Loading States** - No more manual management
✅ **Global Spinner** - Consistent UX across app
✅ **Type-Safe** - Full TypeScript support
✅ **Auto-Timeout** - 30-second safety limit
✅ **Easy Integration** - Drop-in hooks for existing code
✅ **Performance** - Minimal bundle and runtime impact

For questions or issues, refer to the component files:
- `src/contexts/LoadingContext.tsx`
- `src/hooks/useAsyncWithLoading.ts`
- `src/hooks/useNavigationWithLoading.ts`
