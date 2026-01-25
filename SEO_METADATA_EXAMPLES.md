# SEO Metadata Examples & Reference

This document shows actual metadata output for different page types in the system.

## 1. HOME PAGE METADATA

**URL**: https://truyennhameo.vercel.app

### HTML Head Tags
```html
<title>Truyện Nhà Mèo - Đọc Truyện Ngôn Tình, Tiểu Thuyết, Truyện Edit Online Miễn Phí</title>
<meta name="description" content="Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí. Hàng ngàn bộ truyện ngôn tình hay, tiểu thuyết lãng mạn, truyện edit sáng tạo. Cập nhật hàng ngày." />
<meta name="keywords" content="đọc truyện online, truyện ngôn tình, tiểu thuyết, truyện edit, truyện dịch, đọc truyện miễn phí, web novel, truyện web, truyện yêu, truyện lãng mạn, truyện xuyên không, đam mỹ, lighten, truyện nhà mèo" />

<meta property="og:title" content="Truyện Nhà Mèo - Đọc Truyện Ngôn Tình, Tiểu Thuyết Miễn Phí" />
<meta property="og:description" content="Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí. Khám phá hàng ngàn bộ truyện đa dạng." />
<meta property="og:url" content="https://truyennhameo.vercel.app" />
<meta property="og:site_name" content="Truyện Nhà Mèo" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://truyennhameo.vercel.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Truyện Nhà Mèo - Đọc Truyện Online Miễn Phí" />
<meta name="twitter:description" content="Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí" />
<meta name="twitter:creator" content="@truyennhameo" />

<link rel="canonical" href="https://truyennhameo.vercel.app" />

<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Truyện Nhà Mèo",
  "description": "Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí",
  "url": "https://truyennhameo.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://truyennhameo.vercel.app?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Truyện Nhà Mèo",
    "url": "https://truyennhameo.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://truyennhameo.vercel.app/logo.png",
      "width": 200,
      "height": 200
    }
  }
}
</script>
```

---

## 2. NOVEL DETAIL PAGE METADATA

**Example URL**: https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid

### HTML Head Tags (Dynamic)
```html
<title>Tình Yêu Đỉnh Cao - Đọc Online Miễn Phí | Truyện Nhà Mèo</title>
<meta name="description" content="Đọc truyện \"Tình Yêu Đỉnh Cao\" online miễn phí trên Truyện Nhà Mèo. Một câu chuyện tình yêu đầy kịch tính giữa hai nhân vật chính..." />
<meta name="keywords" content="Tình Yêu Đỉnh Cao, đọc truyện online, truyện ngôn tình, tiểu thuyết, truyện edit, truyện dịch, đọc truyện miễn phí, web novel, truyện web, truyện yêu, truyện lãng mạn, truyện xuyên không, đam mỹ, lighten, truyện nhà mèo" />

<meta property="og:title" content="Tình Yêu Đỉnh Cao | Truyện Nhà Mèo" />
<meta property="og:description" content="Một câu chuyện tình yêu đầy kịch tính giữa hai nhân vật chính..." />
<meta property="og:url" content="https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid" />
<meta property="og:site_name" content="Truyện Nhà Mèo" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://ljmoqseafxhncpwzuwex.supabase.co/storage/v1/object/public/manga-covers/story-cover.jpg" />
<meta property="og:image:width" content="600" />
<meta property="og:image:height" content="800" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Tình Yêu Đỉnh Cao" />
<meta name="twitter:description" content="Một câu chuyện tình yêu đầy kịch tính..." />
<meta name="twitter:creator" content="@truyennhameo" />

<link rel="canonical" href="https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid" />

<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Tình Yêu Đỉnh Cao",
  "description": "Một câu chuyện tình yêu đầy kịch tính...",
  "image": "https://ljmoqseafxhncpwzuwex.supabase.co/storage/v1/object/public/manga-covers/story-cover.jpg",
  "url": "https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Truyện Nhà Mèo",
    "url": "https://truyennhameo.vercel.app"
  },
  "author": {
    "@type": "Person",
    "name": "Tác giả"
  }
}
</script>
```

---

## 3. CHAPTER PAGE METADATA

**Example URL**: https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid/chuong/chapter-uuid

### HTML Head Tags (Dynamic)
```html
<title>Tình Yêu Đỉnh Cao - Chương 5: Cuộc Gặp Định Mệnh | Truyện Nhà Mèo</title>
<meta name="description" content="Đọc Tình Yêu Đỉnh Cao - Chương 5: Cuộc Gặp Định Mệnh online miễn phí. Cập nhật chương mới hàng ngày trên Truyện Nhà Mèo." />
<meta name="keywords" content="Chương 5: Cuộc Gặp Định Mệnh, Tình Yêu Đỉnh Cao, đọc truyện online, truyện ngôn tình, tiểu thuyết, truyện edit, truyện dịch, đọc truyện miễn phí, web novel, truyện web, truyện yêu, truyện lãng mạn, truyện xuyên không" />

<meta property="og:title" content="Tình Yêu Đỉnh Cao - Chương 5: Cuộc Gặp Định Mệnh" />
<meta property="og:description" content="Đọc chương này online miễn phí. Cập nhật chương mới hàng ngày trên Truyện Nhà Mèo." />
<meta property="og:url" content="https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid/chuong/chapter-uuid" />
<meta property="og:site_name" content="Truyện Nhà Mèo" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://truyennhameo.vercel.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Tình Yêu Đỉnh Cao - Chương 5: Cuộc Gặp Định Mệnh" />
<meta name="twitter:description" content="Đọc chương này online miễn phí. Cập nhật chương mới hàng ngày trên Truyện Nhà Mèo." />
<meta name="twitter:creator" content="@truyennhameo" />

<link rel="canonical" href="https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid/chuong/chapter-uuid" />

<meta name="robots" content="index, follow" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tình Yêu Đỉnh Cao - Chương 5: Cuộc Gặp Định Mệnh",
  "description": "Đọc chương này online miễn phí",
  "url": "https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid/chuong/chapter-uuid",
  "isPartOf": {
    "@type": "CreativeWork",
    "name": "Tình Yêu Đỉnh Cao",
    "url": "https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao-uuid"
  }
}
</script>
```

---

## 4. CATEGORY PAGE METADATA

**Example URL**: https://truyennhameo.vercel.app/the-loai/trayem-tac

### Handled by TagPage Component
- Uses `Seo` component for dynamic metadata
- Builds ItemList schema with manga listings
- Shows count of available stories

---

## 5. LOGIN PAGE METADATA

**URL**: https://truyennhameo.vercel.app/dang-nhap

### HTML Head Tags
```html
<title>Đăng Nhập | Truyện Nhà Mèo</title>
<meta name="description" content="Đăng nhập để theo dõi truyện yêu thích, bình luận và lưu bookmark" />

<meta property="og:title" content="Đăng Nhập | Truyện Nhà Mèo" />
<meta property="og:description" content="Đăng nhập để theo dõi truyện yêu thích, bình luận và lưu bookmark" />

<!-- NOTE: Login page has index: false to prevent search engine indexing -->
<meta name="robots" content="noindex, follow" />
```

---

## Metadata Variables Reference

### Common Site Variables
```typescript
SITE_NAME = "Truyện Nhà Mèo"
SITE_URL = "https://truyennhameo.vercel.app"
SITE_DESCRIPTION = "Nền tảng đọc truyện ngôn tình, tiểu thuyết, truyện edit và truyện dịch online miễn phí"
```

### Common Keywords Array
```typescript
COMMON_KEYWORDS = [
  "đọc truyện online",
  "truyện ngôn tình",
  "tiểu thuyết",
  "truyện edit",
  "truyện dịch",
  "đọc truyện miễn phí",
  "web novel",
  "truyện web",
  "truyện yêu",
  "truyện lãng mạn",
  "truyện xuyên không",
  "đam mỹ",
  "lighten",
  "truyện nhà mèo",
]
```

---

## Social Media Preview

### Facebook Share Preview
- **Title**: Story/Page title
- **Description**: First 160 characters
- **Image**: OG image (story cover or og-image.png)
- **URL**: Full canonical URL

### Twitter Share Preview
- **Card Type**: summary_large_image for stories, summary for chapters
- **Title**: Same as OG title
- **Description**: First 280 characters
- **Image**: OG image
- **Creator**: @truyennhameo

### WhatsApp/Telegram Share
- Shows title + first line of description
- Uses OG image if available

---

## SEO Impact

### What Search Engines See
1. **Title**: Used for search result heading
2. **Meta Description**: Shown below title in search results
3. **Schema Data**: Enables rich snippets, knowledge panels, featured snippets
4. **Canonical URL**: Consolidates page authority
5. **Robots Meta**: Tells crawlers whether to index/follow

### Expected Search Result Display
```
┌─────────────────────────────────────────────────────────┐
│ Tình Yêu Đỉnh Cao - Đọc Online Miễn Phí | Truyện Nhà Mèo  │
│ https://truyennhameo.vercel.app/truyen/tinh-yeu-dinh-cao  │
│                                                             │
│ Đọc truyện "Tình Yêu Đỉnh Cao" online miễn phí trên       │
│ Truyện Nhà Mèo. Một câu chuyện tình yêu đầy kịch tính...  │
│                                                             │
│ [Story Cover Image] ← OG Image                             │
└─────────────────────────────────────────────────────────┘
```

---

## Character Limits

### Title
- **Ideal**: 50-60 characters
- **Max Displayed**: ~55-65 chars on desktop, ~30-40 on mobile
- **Format**: `Story Title - Tag | Site Name`

### Meta Description
- **Ideal**: 155-160 characters
- **Max Displayed**: ~155-160 chars on desktop, ~120 on mobile
- **Format**: Compelling snippet of content

### Social Title
- **Max**: 200 characters (but keep under 65 for display)

### Social Description
- **Max**: 300 characters (but keep under 160 for display)

---

## Testing the Metadata

### Using Browser DevTools
1. Right-click → Inspect → Head section
2. Look for:
   - `<title>`
   - `<meta name="description">`
   - `<meta property="og:*">`
   - `<script type="application/ld+json">`

### Using Online Tools
1. Google Search Console: https://search.google.com/search-console
2. Google Rich Results: https://search.google.com/test/rich-results
3. Schema.org Validator: https://schema.org/validator
4. Facebook Debugger: https://developers.facebook.com/tools/debug/
5. Twitter Card Validator: https://cards-dev.twitter.com/validator

### Commands to Check Local
```bash
# View page source in terminal
curl https://truyennhameo.vercel.app | grep -A 5 "<meta"

# Extract just meta tags
curl -s https://truyennhameo.vercel.app | grep "<meta\|<title"
```

---

## Maintenance

### Regular Updates Needed
- [ ] Update OG images as site evolves
- [ ] Review keyword strategy quarterly
- [ ] Check for broken canonical URLs
- [ ] Monitor Search Console for errors
- [ ] Update site description if needed
- [ ] Add new structured data types as needed

### When Adding New Content
- [ ] Verify metadata auto-generates correctly
- [ ] Test with social sharing
- [ ] Check mobile preview
- [ ] Validate schema markup
- [ ] Monitor search performance
