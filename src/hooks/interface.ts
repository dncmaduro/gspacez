export interface IPost {
  id: string
  title: string
  content: {
    text: string
    imageUrls: string[]
    videoUrls: string[]
    location: string
    feeling: string
    tag: string[]
  }
  commentIds: string[]
  reacts: string[]
  shares: string[]
  privacy: string
  location: string
  type: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  profileName: string
  avatarUrl: string
  trendingPoint: number
  hidden: boolean
  hashTags: string[]
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
