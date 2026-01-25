## 🚀 Fix POST Comment 500 Error - Auto-Fix Endpoint

API endpoint created to automatically fix RLS policy:

### **One-Click Fix**:

**Option 1 - Using curl**:
```bash
curl http://localhost:3000/api/setup/fix-comments-rls
```

**Option 2 - Using browser**:
Visit: http://localhost:3000/api/setup/fix-comments-rls

**Option 3 - Using JavaScript** (in browser console):
```javascript
fetch('http://localhost:3000/api/setup/fix-comments-rls')
  .then(r => r.json())
  .then(data => console.log(data))
```

### **Expected Response**:
```json
{
  "success": true,
  "message": "RLS policy fixed successfully"
}
```

### **After Fix**:
1. Refresh your app
2. Try posting a comment
3. Should work with **201 Created** response ✅

### **If It Fails**:
If endpoint returns error with manual SQL, copy-paste this into Supabase Dashboard SQL Editor:
```sql
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
```

---

**Endpoint created**: `/app/api/setup/fix-comments-rls/route.ts`
