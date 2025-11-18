# 📚 Documentation Index

Chào mừng đến với Readoria Quest! Project đang trong quá trình migration từ Vite sang Next.js.

## 🎯 Bắt đầu nhanh

**Muốn chạy ngay?** → Đọc [`QUICKREF.md`](./QUICKREF.md)

```bash
npm run setup:nextjs && npm run dev
```

## 📖 Tài liệu chính

### 1. [`README.md`](./README.md) 
**Tổng quan dự án**
- Giới thiệu project
- Technologies sử dụng
- Getting started
- Project structure
- Deployment guide

### 2. [`QUICKREF.md`](./QUICKREF.md) ⭐ **BẮT ĐẦU TẠI ĐÂY**
**Tham khảo nhanh**
- Commands thường dùng
- File structure
- Templates
- Troubleshooting
- Pro tips

### 3. [`SETUP.md`](./SETUP.md)
**Hướng dẫn setup chi tiết**
- Step-by-step setup
- Scripts explanation
- Configuration details
- Troubleshooting advanced
- Next steps guide

### 4. [`SUMMARY.md`](./SUMMARY.md)
**Tổng kết những gì đã làm**
- Những gì đã hoàn thành
- Cấu trúc đã tạo
- Features có sẵn
- Migration progress
- Next actions

## 🔄 Migration Documentation

### 5. [`NEXTJS_MIGRATION.md`](./NEXTJS_MIGRATION.md)
**Chi tiết migration**
- Tình trạng hiện tại
- Cấu trúc Next.js
- Các bước migration
- Lợi ích của Next.js
- Roadmap

### 6. [`MIGRATION_CHECKLIST.md`](./MIGRATION_CHECKLIST.md)
**Theo dõi tiến trình**
- 12 phases migration
- Detailed checklist
- Current status
- Blockers & notes
- Timeline

### 7. [`VITE_VS_NEXTJS.md`](./VITE_VS_NEXTJS.md)
**So sánh & Hướng dẫn**
- Routing comparison
- Data fetching
- Navigation
- Environment variables
- Performance comparison
- When to use what

## 🎓 Học Next.js

### Nếu bạn chưa biết Next.js:
1. Đọc [`VITE_VS_NEXTJS.md`](./VITE_VS_NEXTJS.md) - Hiểu sự khác biệt
2. Đọc [`NEXTJS_MIGRATION.md`](./NEXTJS_MIGRATION.md) - Hiểu cấu trúc
3. Chạy project và explore code

### Nếu bạn đã biết Next.js:
1. Đọc [`QUICKREF.md`](./QUICKREF.md) - Commands
2. Chạy `npm run setup:nextjs`
3. Check [`MIGRATION_CHECKLIST.md`](./MIGRATION_CHECKLIST.md) - What needs to be done

## 🛠️ Developer Workflow

### Lần đầu setup:
```
README.md → QUICKREF.md → npm run setup:nextjs → npm run dev
```

### Daily development:
```
QUICKREF.md → npm run dev → Code → Check MIGRATION_CHECKLIST.md
```

### Khi gặp vấn đề:
```
QUICKREF.md (Troubleshooting) → SETUP.md (Advanced) → Documentation
```

### Planning work:
```
MIGRATION_CHECKLIST.md → Pick task → VITE_VS_NEXTJS.md (reference) → Code
```

## 📊 Progress Tracking

**Current Status:** 🟡 Phase 3 - Route Structure (35% complete)

**Next Priority:**
1. Run setup script
2. Test all routes
3. Start component migration

Check [`MIGRATION_CHECKLIST.md`](./MIGRATION_CHECKLIST.md) for detailed progress.

## 🎯 Quick Navigation

### Muốn làm gì?

| Mục đích | Đọc file |
|---------|----------|
| Chạy project lần đầu | [`QUICKREF.md`](./QUICKREF.md) |
| Hiểu project structure | [`README.md`](./README.md) |
| Setup chi tiết | [`SETUP.md`](./SETUP.md) |
| Xem đã làm gì | [`SUMMARY.md`](./SUMMARY.md) |
| Học Next.js migration | [`NEXTJS_MIGRATION.md`](./NEXTJS_MIGRATION.md) |
| Track progress | [`MIGRATION_CHECKLIST.md`](./MIGRATION_CHECKLIST.md) |
| So sánh Vite vs Next | [`VITE_VS_NEXTJS.md`](./VITE_VS_NEXTJS.md) |
| Fix lỗi | [`QUICKREF.md`](./QUICKREF.md) → [`SETUP.md`](./SETUP.md) |

## 📝 File Types

### Config Files
- `package.json` - Dependencies & scripts
- `next.config.cjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

### Code Files
- `app/` - Next.js App Router pages
- `src/` - Legacy Vite app (giữ lại)
- `middleware.ts` - Next.js middleware
- `scripts/` - Build & setup scripts

### Documentation Files (You are here!)
- `*.md` - All documentation files

## 💡 Tips

1. **Bắt đầu từ đâu?**
   - New to project? → [`README.md`](./README.md)
   - Want quick start? → [`QUICKREF.md`](./QUICKREF.md)
   - Need details? → [`SETUP.md`](./SETUP.md)

2. **Đọc theo thứ tự:**
   ```
   QUICKREF → SUMMARY → SETUP → NEXTJS_MIGRATION → VITE_VS_NEXTJS
   ```

3. **Khi code:**
   - Keep [`QUICKREF.md`](./QUICKREF.md) open
   - Reference [`VITE_VS_NEXTJS.md`](./VITE_VS_NEXTJS.md) when needed
   - Update [`MIGRATION_CHECKLIST.md`](./MIGRATION_CHECKLIST.md) progress

4. **Documentation mới:**
   - Cập nhật file này khi thêm docs mới
   - Giữ format nhất quán
   - Add links to new files

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 📞 Support

Nếu cần help:
1. Check documentation files
2. Check troubleshooting sections
3. Review error logs
4. Check GitHub issues

---

**Last Updated:** 2025-11-17
**Project Status:** 🟡 In Progress
**Next Action:** Run `npm run setup:nextjs`

Happy coding! 🚀
