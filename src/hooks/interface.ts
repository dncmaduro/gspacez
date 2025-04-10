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
