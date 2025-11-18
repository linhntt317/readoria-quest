const fs = require("fs");
const path = require("path");

const directories = [
  "app/truyen/[mangaId]",
  "app/truyen/[mangaId]/chuong/[chapterId]",
  "app/the-loai/[tagName]",
  "app/admin/dashboard",
  "app/admin/login",
  "app/admin/post-truyen",
  "app/admin/add-chapter/[mangaId]",
  "app/admin/manga-detail/[mangaId]",
  "app/admin/edit-manga/[mangaId]",
  "app/admin/edit-chapter/[chapterId]",
  "app/admin/view-chapter/[chapterId]",
  "app/admin/tags",
];

directories.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created: ${dir}`);
});

console.log("\nAll directories created successfully!");
