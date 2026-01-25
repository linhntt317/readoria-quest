## ❌ Error: Comments Check Constraint Violation

```
ERROR: 23514: new row for relation "comments" violates check constraint "comments_check"
```

### Root Cause

Bảng `comments` có check constraint:
```sql
CHECK (
  (manga_id IS NOT NULL AND chapter_id IS NULL) OR 
  (manga_id IS NULL AND chapter_id IS NOT NULL)
)
```

**Quy tắc:** Phải có **ĐỘC LẬP** `manga_id` HOẶC `chapter_id`, **KHÔNG** được có **CẢ HAI**

### Lỗi của bạn

```
manga_id: 68dd8615-46bb-4e3c-b561-e7debfe1f0d2  ✓ (NOT NULL)
chapter_id: 38e538d6-e0a8-486d-934c-080d46a43528  ✓ (NOT NULL)
```

❌ **CẢ HAI đều NOT NULL → violates constraint!**

### Fix

**Option 1**: Comment cho manga (không chapter)
```json
{
  "mangaId": "68dd8615-46bb-4e3c-b561-e7debfe1f0d2",
  "chapterId": null,  ← NULL
  "nickname": "User",
  "content": "Great manga!"
}
```

**Option 2**: Comment cho chapter (không manga)
```json
{
  "mangaId": null,  ← NULL
  "chapterId": "38e538d6-e0a8-486d-934c-080d46a43528",
  "nickname": "User",
  "content": "Great chapter!"
}
```

### Giải pháp từ phía code

Edge Function đã validate:
```typescript
const createCommentSchema = z
  .object({
    mangaId: z.string().uuid().optional(),
    chapterId: z.string().uuid().optional(),
    // ...
  })
  .refine((data) => data.mangaId || data.chapterId, {
    message: "Either mangaId or chapterId must be provided",
  });
```

Nhưng **KHÔNG** enforce rằng chỉ được một!

### Migration Fix (Optional)

Hãy relax constraint nếu muốn allow cả 2:
```sql
-- Drop old constraint
ALTER TABLE public.comments DROP CONSTRAINT comments_check;

-- Add new constraint (allow both or either)
ALTER TABLE public.comments
ADD CONSTRAINT comments_require_manga_or_chapter 
CHECK (manga_id IS NOT NULL OR chapter_id IS NOT NULL);
```

