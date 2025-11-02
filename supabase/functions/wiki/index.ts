import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

serve(async (req) => {
  const { u } = await req.json();
  if (!u) return new Response(JSON.stringify({ error: 'Thiếu link truyện' }), { status: 400 });

  const encodedUrl = encodeURIComponent(u);
  const response = await fetch(`https://truyenwikidich.net/info?u=${encodedUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `u=${encodedUrl}`,
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
});
