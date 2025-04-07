# GspaceZ - Tech Community Platform

GspaceZ is a modern web application built for tech enthusiasts to connect, share knowledge, and collaborate. This platform allows users to create posts, join squads (communities), and interact with AI-powered features.

## Features

### User Management

- **Authentication**: Sign up, sign in, and Google OAuth integration
- **Profile Management**: Edit personal information, view activity history
- **Password Recovery**: Forgot password flow with OTP verification

### Content Creation

- **Posts**: Create, edit, and view posts with markdown support
- **Privacy Controls**: Set visibility options for your content
- **Reactions**: Like/dislike posts and comments
- **Hashtags**: Categorize content with relevant tags

### Community Features

- **Squads**: Create and join topic-based communities
- **Newsfeed**: Personalized content feed
- **Search**: Find users, posts, and squads

### AI Integration

- **Chat with AI**: Integrated Gemini AI for conversations
- **Content Generation**: AI assistance for creating posts

## Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: React Query, Zustand
- **UI Components**: Mantine UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form

### Features

- **Markdown**: React Markdown for content rendering
- **Date Handling**: date-fns
- **Image Manipulation**: react-easy-crop

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
yarn install

# Start development server
yarn start
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GEMINI_KEY=your_gemini_api_key
```

### Build for Production

```bash
yarn build
```

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/hooks`: Custom React hooks for API calls and state management
  - `/routes`: Page components and routing configuration
  - `/utils`: Utility functions and constants

## Deployment

The application is configured for deployment on Vercel with client-side routing support.
