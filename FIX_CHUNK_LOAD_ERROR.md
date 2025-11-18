# 🔧 Fix: ChunkLoadError trong Next.js

## ❌ Lỗi
```
Runtime ChunkLoadError
Loading chunk app/layout failed.
(timeout: http://localhost:3000/_next/static/chunks/app/layout.js)
```

## 🎯 Nguyên nhân

### 1. QueryClient shared state (CRITICAL)
```typescript
// ❌ BAD - Shared giữa all requests
const queryClient = new QueryClient();

export function Providers() {
  return <QueryClientProvider client={queryClient}>
}
```

### 2. Next.js cache conflict
- Cache cũ từ Vite build
- Webpack chunks bị corrupt
- Hot reload issues

### 3. Module resolution
- Import paths không đúng
- Dependencies conflict

## ✅ Đã fix

### 1. **Fixed `app/providers.tsx`** ✅
```typescript
// ✅ GOOD - New instance per request
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. **Xóa cache**
```bash
# Option 1: Script tự động
.\clear-cache.bat

# Option 2: Manual
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
```

### 3. **Restart clean**
```bash
# Stop server (Ctrl+C)

# Clear cache
.\clear-cache.bat

# Restart
npm run dev
```

## 🚀 Các bước fix đầy đủ

### Bước 1: Stop server
```bash
Ctrl+C
```

### Bước 2: Xóa cache
```bash
# Windows
.\clear-cache.bat

# Or manual
rd /s /q .next
rd /s /q node_modules\.cache
```

### Bước 3: Reinstall (nếu cần)
```bash
# Nếu vẫn lỗi, xóa node_modules
rd /s /q node_modules
npm install
```

### Bước 4: Restart
```bash
npm run dev
```

### Bước 5: Hard refresh browser
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

## 🔍 Kiểm tra

Sau khi fix, verify:
- [ ] No ChunkLoadError
- [ ] Homepage loads successfully
- [ ] No console errors
- [ ] Hot reload works
- [ ] All routes accessible

## 📝 Lý do chi tiết

### QueryClient Issue
**Vấn đề:** Next.js SSR tạo QueryClient cho mỗi request. Nếu share 1 instance:
- State leak giữa users
- Memory leaks
- Hydration mismatches

**Giải pháp:** Tạo new QueryClient instance trong component với `useState`

### Cache Issue
**Vấn đề:** 
- Vite và Next.js dùng khác build systems
- Cache chunks không compatible
- Module IDs conflict

**Giải pháp:** Xóa `.next` folder trước mỗi lần chuyển đổi

## 💡 Prevention

Để tránh lỗi này trong tương lai:

1. **Luôn clear cache khi:**
   - Chuyển giữa Vite và Next.js
   - Update major dependencies
   - Thay đổi build config
   - Strange errors xuất hiện

2. **QueryClient best practice:**
   ```typescript
   // Always create in component
   const [queryClient] = useState(() => new QueryClient())
   
   // Never create outside
   // const queryClient = new QueryClient() ❌
   ```

3. **Regular cleanup:**
   ```bash
   # Add to package.json
   "clean": "rd /s /q .next && rd /s /q node_modules\\.cache"
   ```

## 🐛 Nếu vẫn lỗi

### Try 1: Full clean
```bash
rd /s /q .next
rd /s /q node_modules
npm install
npm run dev
```

### Try 2: Check ports
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Start on different port
set PORT=3001 && npm run dev
```

### Try 3: Disable cache
```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.cache = false;
    return config;
  }
}
```

### Try 4: Check imports
Verify all imports use correct paths:
- `@/components/...` ✅
- `@/contexts/...` ✅
- `@/lib/...` ✅

## ✅ Expected Result

Sau khi fix đúng:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 3.2s
```

Browser sẽ load trang thành công không có lỗi! 🎉

## 📚 Related Issues

- [Next.js ChunkLoadError](https://github.com/vercel/next.js/issues)
- [React Query SSR](https://tanstack.com/query/latest/docs/react/guides/ssr)

---

**Status:** ✅ Fixed - Clear cache và restart
**Last Updated:** 2025-11-17
