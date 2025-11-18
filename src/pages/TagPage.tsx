"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Seo from "@/components/Seo";
import { MangaCard } from "@/components/MangaCard";
import { supabase } from "@/integrations/supabase/client";

const TagPage = ({ tagName }: { tagName?: string }) => {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tagName) return;

    const run = async () => {
      setIsLoading(true);
      try {
        // Find tag id
        const { data: tagRows } = await supabase
          .from("tags")
          .select("id,name")
          .ilike("name", tagName.replace(/-/g, " "))
          .limit(1);

        const tagId = tagRows?.[0]?.id;
        if (!tagId) {
          setMangaList([]);
          setIsLoading(false);
          return;
        }

        // Find manga ids mapped to the tag
        const { data: mappings } = await supabase
          .from("manga_tags")
          .select("manga_id")
          .eq("tag_id", tagId);

        const mangaIds = (mappings || []).map((m: any) => m.manga_id);
        if (!mangaIds.length) {
          setMangaList([]);
          setIsLoading(false);
          return;
        }

        const { data: mangas } = await supabase
          .from("manga")
          .select(
            "id,title,author,description,image_url,views,created_at,updated_at"
          )
          .in("id", mangaIds)
          .order("created_at", { ascending: false });

        setMangaList(mangas || []);
      } catch (err) {
        console.error(err);
        setMangaList([]);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [tagName]);

  const prettyTag = (tagName || "").replace(/-/g, " ");
  const title = `${prettyTag} - Truyện Nhà Mèo`;
  const description = `Tổng hợp truyện ${prettyTag} hay nhất, cập nhật liên tục trên Truyện Nhà Mèo.`;
  const url = `${
    process.env.SITE_ORIGIN || "https://truyennhameo.vercel.app"
  }/the-loai/${tagName}`;

  // Build simple JSON-LD ItemList for SEO
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url,
    itemListElement: mangaList.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${url}/truyen/${m.id}`,
      name: m.title,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={title}
        description={description}
        url={url}
        image={mangaList[0]?.image_url}
        jsonLd={itemList}
        keywords={[prettyTag, "truyện ngôn tình", "đọc truyện"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Thể loại: {prettyTag}</h1>

        {isLoading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mangaList.map((m) => (
              <MangaCard
                key={m.id}
                id={m.id}
                image={m.image_url}
                title={m.title}
                chapter={""}
                views={(m.views || 0).toString()}
                rating={m.rating || 0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TagPage;
