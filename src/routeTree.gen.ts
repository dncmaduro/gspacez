/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RecoveryImport } from './routes/recovery'
import { Route as IndexImport } from './routes/index'
import { Route as AppIndexImport } from './routes/app/index'
import { Route as PostNewImport } from './routes/post/new'
import { Route as PostPostIdImport } from './routes/post/$postId'
import { Route as IntegrationCallbackImport } from './routes/integration/callback'
import { Route as PostEditPostIdImport } from './routes/post/edit.$postId'

// Create/Update Routes

const RecoveryRoute = RecoveryImport.update({
  id: '/recovery',
  path: '/recovery',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/app/',
  path: '/app/',
  getParentRoute: () => rootRoute,
} as any)

const PostNewRoute = PostNewImport.update({
  id: '/post/new',
  path: '/post/new',
  getParentRoute: () => rootRoute,
} as any)

const PostPostIdRoute = PostPostIdImport.update({
  id: '/post/$postId',
  path: '/post/$postId',
  getParentRoute: () => rootRoute,
} as any)

const IntegrationCallbackRoute = IntegrationCallbackImport.update({
  id: '/integration/callback',
  path: '/integration/callback',
  getParentRoute: () => rootRoute,
} as any)

const PostEditPostIdRoute = PostEditPostIdImport.update({
  id: '/post/edit/$postId',
  path: '/post/edit/$postId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/recovery': {
      id: '/recovery'
      path: '/recovery'
      fullPath: '/recovery'
      preLoaderRoute: typeof RecoveryImport
      parentRoute: typeof rootRoute
    }
    '/integration/callback': {
      id: '/integration/callback'
      path: '/integration/callback'
      fullPath: '/integration/callback'
      preLoaderRoute: typeof IntegrationCallbackImport
      parentRoute: typeof rootRoute
    }
    '/post/$postId': {
      id: '/post/$postId'
      path: '/post/$postId'
      fullPath: '/post/$postId'
      preLoaderRoute: typeof PostPostIdImport
      parentRoute: typeof rootRoute
    }
    '/post/new': {
      id: '/post/new'
      path: '/post/new'
      fullPath: '/post/new'
      preLoaderRoute: typeof PostNewImport
      parentRoute: typeof rootRoute
    }
    '/app/': {
      id: '/app/'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof rootRoute
    }
    '/post/edit/$postId': {
      id: '/post/edit/$postId'
      path: '/post/edit/$postId'
      fullPath: '/post/edit/$postId'
      preLoaderRoute: typeof PostEditPostIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/recovery': typeof RecoveryRoute
  '/integration/callback': typeof IntegrationCallbackRoute
  '/post/$postId': typeof PostPostIdRoute
  '/post/new': typeof PostNewRoute
  '/app': typeof AppIndexRoute
  '/post/edit/$postId': typeof PostEditPostIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/recovery': typeof RecoveryRoute
  '/integration/callback': typeof IntegrationCallbackRoute
  '/post/$postId': typeof PostPostIdRoute
  '/post/new': typeof PostNewRoute
  '/app': typeof AppIndexRoute
  '/post/edit/$postId': typeof PostEditPostIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/recovery': typeof RecoveryRoute
  '/integration/callback': typeof IntegrationCallbackRoute
  '/post/$postId': typeof PostPostIdRoute
  '/post/new': typeof PostNewRoute
  '/app/': typeof AppIndexRoute
  '/post/edit/$postId': typeof PostEditPostIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/recovery'
    | '/integration/callback'
    | '/post/$postId'
    | '/post/new'
    | '/app'
    | '/post/edit/$postId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/recovery'
    | '/integration/callback'
    | '/post/$postId'
    | '/post/new'
    | '/app'
    | '/post/edit/$postId'
  id:
    | '__root__'
    | '/'
    | '/recovery'
    | '/integration/callback'
    | '/post/$postId'
    | '/post/new'
    | '/app/'
    | '/post/edit/$postId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  RecoveryRoute: typeof RecoveryRoute
  IntegrationCallbackRoute: typeof IntegrationCallbackRoute
  PostPostIdRoute: typeof PostPostIdRoute
  PostNewRoute: typeof PostNewRoute
  AppIndexRoute: typeof AppIndexRoute
  PostEditPostIdRoute: typeof PostEditPostIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  RecoveryRoute: RecoveryRoute,
  IntegrationCallbackRoute: IntegrationCallbackRoute,
  PostPostIdRoute: PostPostIdRoute,
  PostNewRoute: PostNewRoute,
  AppIndexRoute: AppIndexRoute,
  PostEditPostIdRoute: PostEditPostIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/recovery",
        "/integration/callback",
        "/post/$postId",
        "/post/new",
        "/app/",
        "/post/edit/$postId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/recovery": {
      "filePath": "recovery.tsx"
    },
    "/integration/callback": {
      "filePath": "integration/callback.tsx"
    },
    "/post/$postId": {
      "filePath": "post/$postId.tsx"
    },
    "/post/new": {
      "filePath": "post/new.tsx"
    },
    "/app/": {
      "filePath": "app/index.tsx"
    },
    "/post/edit/$postId": {
      "filePath": "post/edit.$postId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
