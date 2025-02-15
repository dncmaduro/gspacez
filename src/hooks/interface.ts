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
  comments: string[]
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
