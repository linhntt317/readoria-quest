# 🔧 Fix: localStorage & SSR Errors trong Next.js

## ❌ Các lỗi

### 1. Supabase Client Error
```
TypeError: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')
```

### 2. localStorage Error
```
ReferenceError: localStorage is not defined
```

## ✅ Đã fix

### 1. **Updated `src/integrations/supabase/client.ts`**
- Đổi từ `import.meta.env` → `process.env`
- Add fallback cho cả `NEXT_PUBLIC_` và `VITE_` prefixes
- Fix localStorage check cho SSR (`typeof window !== 'undefined'`)

### 2. **Updated `.env` file**
Thêm Next.js environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://ljmoqseafxhncpwzuwex.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-key-here"
```

### 3. **Fixed All Contexts for SSR**

#### `src/contexts/ThemeContext.tsx` ✅
- Không đọc `localStorage` trong initial state
- Dùng `useEffect` để load sau khi component mount
- Add `mounted` state để tránh hydration mismatch
- Check `typeof window !== 'undefined'` trước khi access localStorage

#### `src/contexts/LanguageContext.tsx` ✅
- Tương tự ThemeContext
- Load từ localStorage sau mount
- Safe check cho `document` access

#### `src/contexts/AuthContext.tsx` ✅
- Check `typeof window === 'undefined'` trước khi setup auth
- Safe window.location access

## 🚀 Để chạy lại:

```bash
# Stop current dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

## 📝 Lý do lỗi

**Server-Side Rendering (SSR)** trong Next.js:
- Server không có `window`, `document`, `localStorage`
- Initial render phải giống nhau giữa server và client
- Browser APIs chỉ available sau khi component mount

**Giải pháp:**
1. ❌ KHÔNG đọc localStorage trong initial state
2. ✅ Đọc localStorage trong `useEffect` (chỉ chạy trên client)
3. ✅ Check `typeof window !== 'undefined'` trước khi access browser APIs
4. ✅ Dùng `mounted` state để handle hydration

## ✅ Pattern đã implement

```typescript
// ❌ BAD - Crashes on SSR
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'system';
});

// ✅ GOOD - Works với SSR
const [theme, setTheme] = useState('system');
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }
}, []);
```

## 🔍 Verify

Sau khi restart, check:
- ✅ Không còn localStorage error
- ✅ Không còn import.meta.env error
- ✅ Homepage load thành công
- ✅ Theme switcher hoạt động
- ✅ Language switcher hoạt động
- ✅ Auth hoạt động

## 📚 Next.js SSR Best Practices

1. **Browser APIs**: Luôn check `typeof window !== 'undefined'`
2. **localStorage/sessionStorage**: Chỉ access trong `useEffect`
3. **Initial State**: Dùng giá trị default, không dynamic
4. **Hydration**: Server render = Client render (lần đầu)
5. **Environment Variables**: Client-side cần `NEXT_PUBLIC_` prefix

---

**Status:** ✅ All Fixed - Restart để apply changes

