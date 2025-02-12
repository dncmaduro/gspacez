/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BACKEND_URL: string
  readonly GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
