-- Xóa tất cả tags hiện tại
DELETE FROM public.tags;

-- Thêm các thể loại mới cho truyện tiểu thuyết/ngôn tình
INSERT INTO public.tags (name) VALUES
  ('Ngôn tình'),
  ('Đam mỹ'),
  ('Huyền huyễn'),
  ('Tiên hiệp'),
  ('Xuyên không'),
  ('Học đường'),
  ('Hành động'),
  ('Kinh dị'),
  ('Trinh thám'),
  ('Hài hước'),
  ('Cung đấu'),
  ('Nữ cường'),
  ('Trọng sinh'),
  ('Điền văn'),
  ('Đô thị'),
  ('Võng du'),
  ('Khoa huyễn'),
  ('Linh dị'),
  ('Quân sự'),
  ('Lịch sử');