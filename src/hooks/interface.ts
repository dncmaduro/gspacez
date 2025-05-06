import { FeedSettingsTimeline } from './types'

export interface IPost {
  id: string
  title: string
  content: {
    text: string
  }
  privacy: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  profileName: string
  profileTag: string
  avatarUrl: string
  hashTags: string[]
  comments: IComment[]
  liked: boolean
  disliked: boolean
  totalLike: number
  totalDislike: number
  previewImage: string
  squad: {
    id: string
    name: string
    tagName: string
    avatarUrl: string
    privacy: string
    setting: {
      allowPostModeration: boolean
      allowChangeProfileAccessibility: boolean
      allowPostInteraction: boolean
    }
  }
}

export interface IComment {
  id: string
  postId: string
  profileId: string
  content: {
    text: string
  }
  parentId: string | null
  profileName: string
  profileImageUrl: string
  createdAt: string
  updatedAt: string | null
}

export interface ISquad {
  id: string
  name: string
  tagName: string
  avatarUrl: string
  privacy: string
  description: string
  adminList: {
    id: string
    profileName: string
    profileId: string
    role: string
    joinedAt: string
  }[]
  createdAt: string
  totalPosts: number
  totalMembers: number
  settings: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }

  // side map props
  canBeEdited: boolean
  joinStatus: string
  updatedAt: string
}

export interface IMember {
  id: string
  profileId: string
  profileName: string
  squadId: string
  joinStatus: string
  role: string
  joinedAt: string
}

export interface IExplore {
  source: {
    id: string | null
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
  active: boolean
}

export interface INotification {
  id: string
  profileId: string
  content: string
  type: 'COMMENT' | 'LIKE' | 'DISLIKE' | 'REQUEST_JOIN' | 'ACCEPT'
  entity: INotificationComment | INotificationReact | INotificationSquad
  createdAt: string
  read: boolean
}

export interface INotificationComment {
  id: string
  postId: string
  commentId: string
  commentRequest: {
    content: {
      text: string
    }
    parentId: string | null
  }
  receiver: {
    id: string
    profileId: string
    profileName: string
    email: string | null
    profileImageUrl: string
  }
  sender: {
    id: string
    profileId: string
    profileName: string
    email: string | null
    profileImageUrl: string | null
  }
  createdAt: string
}

export interface INotificationReact {
  id: string
  postId: string
  receiver: {
    id: string
    profileId: string
    profileName: string
    email: string | null
    profileImageUrl: string
  }
  sender: {
    id: string
    profileId: string
    profileName: string
    email: string | null
    profileImageUrl: string | null
  }
}

export interface INotificationSquad {
  squadName: string | null
  tagName: string | null
  sender: {
    id: string
    profileId: string
    profileName: string
    email: string | null
    profileImageUrl: string | null
  }
}

export interface ISettings {
  displayMode: string
  feedSettings: {
    hashtags: string[]
    squads: string[]
    ignoreSquads: string[]
    timeline: FeedSettingsTimeline
    likes: number
  }
}

export interface IChatMessage {
  id: string
  sessionId: string
  message: string
  role: 'user' | 'model'
  createdAt: string
}
