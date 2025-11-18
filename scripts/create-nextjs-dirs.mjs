import { mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

for (const dir of directories) {
  const fullPath = join(__dirname, "..", dir);
  await mkdir(fullPath, { recursive: true });
  console.log(`Created: ${dir}`);
}

console.log("\nAll directories created successfully!");
