/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BACKEND_URL: string
  readonly GOOGLE_CLIENT_ID: string
  readonly CLOUDINARY_UPLOAD_PRESET: string
  readonly CLOUDINARY_API_KEY: string
  readonly CLOUDINARY_CLOUD_NAME: string
  readonly ENVIRONMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
