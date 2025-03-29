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
  adminName: string
  adminId: string
  createdAt: string
  totalPosts: number
  totalMembers: number
  settings: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }
}
