# Performance Analysis - Manga Detail Page

## 🔴 Current Issues

### 1. **Bottleneck Analysis**
```
useMangaById hook hiện tại:
├─ Fetch manga details (1 query)
├─ Fetch manga_tags with joins (1 query with join)
├─ Fetch ALL chapters (1 query - UNBOUNDED)
└─ Tổng: 3 queries, có thể fetch hàng trăm chapters
```

**Vấn đề chính:**
- ❌ Fetch ALL chapters - một truyện có thể có 100+ chapters
- ❌ Không pagination chapters
- ❌ Không cache
- ❌ Load toàn bộ dữ liệu trước khi render
- ❌ Không waterfall loading (show basic info first)

---

## 📊 Optimization Solutions (6 Approaches)

### **Solution 1: Incremental Loading (⭐ BEST)**
**Khái niệm:** Load dữ liệu theo priority
- Load manga info + first 5-10 chapters ngay (< 1s)
- Load remaining chapters on demand (lazy load)
- User thấy content ngay, không chờ đợi lâu

**Ưu điểm:**
- ✅ 1-2s response time
- ✅ User experience tốt nhất
- ✅ Không cần thay đổi database
- ✅ Scalable (truyện 1000 chapters vẫn nhanh)

**Nhược điểm:**
- Cần implement logic phức tạp hơn

**Estimate:** 1-2s load initial + lazy load sau

---

### **Solution 2: Database Query Optimization**
**Khái niệm:** Tối ưu câu query, add indexes, pagination

```sql
-- Thay vì lấy ALL chapters:
SELECT * FROM chapters WHERE manga_id = ? ORDER BY chapter_number

-- Thay bằng LIMIT:
SELECT id, chapter_number, title, created_at 
FROM chapters 
WHERE manga_id = ? 
ORDER BY chapter_number DESC 
LIMIT 10  -- Chỉ lấy 10 chapters mới nhất
```

**Ưu điểm:**
- ✅ Giảm 90% payload
- ✅ Database ngay lập tức nhanh hơn
- ✅ Dễ implement

**Nhược điểm:**
- ❌ Vẫn không show full chapters list
- ❌ User phải scroll để load thêm

**Estimate:** 2-3s (tùy số lượng tags)

---

### **Solution 3: Caching Layer (Redis/In-Memory)**
**Khái niệm:** Cache response 5-10 phút

```typescript
// Pseudo code
const cacheKey = `manga:${id}`;
let cachedData = cache.get(cacheKey);
if (cachedData) return cachedData;

const data = await fetchFromDB();
cache.set(cacheKey, data, 5 * 60 * 1000); // 5 min TTL
return data;
```

**Ưu điểm:**
- ✅ Second visit instant (< 100ms)
- ✅ Giảm DB load
- ✅ Dễ implement với Redis

**Nhược điểm:**
- ❌ First time vẫn lâu
- ❌ Cần Redis server
- ❌ Data stale 5 min

**Estimate:** First: 3-4s, Cached: 100ms

---

### **Solution 4: ISR (Incremental Static Regeneration)**
**Khái niệm:** Pre-generate & cache pages tĩnh, revalidate theo thời gian

```typescript
// next.config.js
export const revalidate = 3600; // Revalidate every 1 hour
```

**Ưu điểm:**
- ✅ Instant (< 100ms) - lấy từ cache tĩnh
- ✅ No database query trên first request
- ✅ Next.js built-in

**Nhược điểm:**
- ❌ Không real-time
- ❌ Cần pre-generate mỗi manga (build time lâu)
- ❌ Phức tạp với dynamic routes

**Estimate:** Instant (< 100ms) - nhưng data cũ

---

### **Solution 5: Pagination + Virtualization**
**Khái niệm:** Chia chapters thành pages, chỉ render visible items

```typescript
// Fetch only 20 chapters per page
const { data: chapters } = await supabase
  .from("chapters")
  .select("...")
  .eq("manga_id", id)
  .order("chapter_number", { ascending: false })
  .range(0, 20) // Pagination

// Use react-window để render only visible items
```

**Ưu điểm:**
- ✅ Giảm DOM nodes
- ✅ Smooth scrolling
- ✅ Dễ implement

**Nhược điểm:**
- ❌ First page vẫn 2-3s
- ❌ Phức tạp với react-window

**Estimate:** 2-3s per page load

---

### **Solution 6: Compression + CDN**
**Khái niệm:** Gzip/Brotli compression + serve từ CDN

```typescript
// Headers
Content-Encoding: gzip
Cache-Control: public, max-age=3600
```

**Ưu điểm:**
- ✅ Giảm bandwidth 70%
- ✅ Faster download

**Nhược điểm:**
- ❌ Không giảm server processing time
- ❌ Chỉ help nếu bandwidth là bottleneck

**Estimate:** 2-3s (giảm 20-30% từ compression)

---

## 🏆 RECOMMENDED SOLUTION: **Solution 1 + Solution 2 Hybrid**

### Strategy: "Show Fast, Load More"

**Tách dữ liệu thành 2 tier:**

**Tier 1: CRITICAL (< 1.5s)**
```
GET /api/manga/:id/summary
{
  id, title, author, description, image_url,
  views, rating, created_at,
  tags: [...],
  latestChapters: [10 chapters mới nhất],
  totalChapters: 200 (just count)
}
```

**Tier 2: DETAILS (lazy load)**
```
GET /api/manga/:id/chapters?page=1&limit=20
{
  chapters: [...],
  total: 200,
  page: 1
}
```

### Implementation Plan:
1. ✅ Create `/api/manga/[id]/summary` endpoint (chỉ 10 chapters)
2. ✅ Create `/api/manga/[id]/chapters?page=:page` endpoint (pagination)
3. ✅ Update hook để gọi summary trước
4. ✅ Show skeleton loading cho chapters list
5. ✅ Load thêm chapters on scroll (infinite scroll)

### Performance Target:
- **First Paint:** 800ms - 1.2s ✅
- **Interactive:** 1.5s - 2s ✅
- **Full Load:** 3-5s (lazy load after scroll)

---

## Expected Results

**Before:** 
- 5-7s to show content
- 100-200KB payload

**After:**
- ⚡ 1.5s to show content
- 📦 20-30KB initial payload
- 📚 Lazy load chapters on demand

