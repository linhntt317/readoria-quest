import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Known Supabase config for this project (fallback values)
const KNOWN_SUPABASE_URL = "https://ljmoqseafxhncpwzuwex.supabase.co";
const KNOWN_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbW9xc2VhZnhobmNwd3p1d2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTIzODksImV4cCI6MjA3NzA2ODM4OX0.y0s_VRhxIrq23q5nBkjm6v3rlenqf6OeQGGdah981n4";
const KNOWN_SUPABASE_PROJECT_ID = "ljmoqseafxhncpwzuwex";

export default defineConfig(({ mode }) => {
  // Load VITE_* vars from env files, then fall back to runtime env or known values
  const fileEnv = loadEnv(mode, process.cwd(), "VITE_");

  const supabaseUrl =
    fileEnv.VITE_SUPABASE_URL || 
    process.env.VITE_SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    KNOWN_SUPABASE_URL;

  const supabasePublishableKey =
    fileEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    KNOWN_SUPABASE_ANON_KEY;

  const supabaseProjectId =
    fileEnv.VITE_SUPABASE_PROJECT_ID || 
    process.env.VITE_SUPABASE_PROJECT_ID || 
    KNOWN_SUPABASE_PROJECT_ID;

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Ensure these are always available in the client bundle.
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        supabasePublishableKey
      ),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(supabaseProjectId),
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },
  };
});

