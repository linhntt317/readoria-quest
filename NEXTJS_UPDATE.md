# 🔄 Update Next.js to Latest

## Current Version
- Next.js: 14.2.33 (outdated)

## Target Version  
- Next.js: 15.1.3 (latest stable)

## How to Update

### Option 1: Automatic (Recommended)
```bash
npm install next@latest react@latest react-dom@latest
```

### Option 2: Manual
1. Updated `package.json`:
   - Changed `"next": "^14.0.0"` → `"next": "^15.1.3"`

2. Run install:
```bash
npm install
```

## Breaking Changes in Next.js 15

### 1. React 19 Support (optional)
Next.js 15 supports React 19, but React 18 still works.

### 2. Async Request APIs
Some APIs are now async (but có fallback):
- `cookies()`
- `headers()`
- `params`
- `searchParams`

### 3. Fetch Caching
Default fetch caching behavior changed:
- Before: cached by default
- Now: not cached by default

### 4. Route Handlers
Default to dynamic rendering.

## Migration Steps

### Step 1: Update packages
```bash
# Stop dev server first
npm install

# Or use yarn
yarn install
```

### Step 2: Clear cache
```bash
# Remove build cache
rm -rf .next

# Remove node_modules if needed
rm -rf node_modules
npm install
```

### Step 3: Test
```bash
npm run dev
```

## Potential Issues & Fixes

### Issue 1: Type errors
```bash
npm install --save-dev @types/node@latest @types/react@latest @types/react-dom@latest
```

### Issue 2: ESLint errors
```bash
npm install --save-dev eslint-config-next@latest
```

### Issue 3: Metadata API changes
Our current metadata setup should work fine, but verify:
```typescript
export const metadata = {
  // Still works in Next.js 15
}
```

## What to Check After Update

- [ ] Dev server starts without errors
- [ ] Pages load correctly
- [ ] No TypeScript errors
- [ ] Metadata working
- [ ] Image optimization working
- [ ] API routes working
- [ ] SSR/SSG working
- [ ] Build completes successfully

## Rollback if Needed

If something breaks:
```bash
# Restore old version
npm install next@14.2.33

# Clear cache
rm -rf .next

# Restart
npm run dev
```

## Benefits of Next.js 15

1. ✅ Faster builds
2. ✅ Better performance
3. ✅ Improved dev experience
4. ✅ Better error messages
5. ✅ Turbopack support (experimental)
6. ✅ Security updates
7. ✅ Bug fixes

## Recommended: Update Together

```bash
npm install next@latest react@latest react-dom@latest @types/node@latest @types/react@latest @types/react-dom@latest
```

---

**Status:** ⏳ Ready to update - Run `npm install` after updating package.json
