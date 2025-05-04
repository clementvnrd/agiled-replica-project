/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Ajoute d'autres variables si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
