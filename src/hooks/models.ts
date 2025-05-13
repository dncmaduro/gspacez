import {
  IChatMessage,
  IComment,
  IDiscussion,
  IDiscussionComment,
  IExplore,
  IMember,
  INotification,
  IPost,
  ISettings,
  ISquad
} from './interface'
import { FeedSettingsTimeline } from './types'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  message?: string
  result: {
    token: string
    refreshToken: string
  }
}

export interface SignUpRequest {
  email: string
  password: string
  profileTag: string
  firstName: string
  lastName: string
}

export interface SignUpResponse {
  message: string
}

export interface IntrospectRequest {
  token: string
}

export interface IntrospectResponse {
  message?: string
  result: {
    valid: boolean
  }
}

export interface RefreshTokenRequest {
  accessTokenExpired: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  message?: string
  result: {
    token: string
    refreshToken: string
  }
}

export interface LoginByGoogleResponse {
  message?: string
  result: {
    token: string
    refreshToken: string
  }
}

export interface GetNewsfeedRequest {
  pageNum: number
  pageSize: number
}

export interface GetNewsfeedResponse {
  message?: string
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    content: IPost[]
    size: number
    number: number
  }
}

export interface GetPostsByProfileRequest {
  pageNum: number
  pageSize: number
}

export interface GetPostsByProfileResponse {
  message?: string
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    content: IPost[]
    size: number
    number: number
  }
}

export interface GetLikedPostsByProfileRequest {
  size: number
  page: number
}

export interface GetLikedPostsByProfileResponse {
  message?: string
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    content: IPost[]
    size: number
    number: number
  }
}

export interface GetPostRequest {
  id: string
}

export interface GetPostResponse {
  message?: string
  result: IPost
}

export interface CreatePostRequest {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
  previewImage: string
  squadTagName: string
}

export interface CreatePostReponse {
  message?: string
  result: IPost
}

export interface UpdatePostRequest {
  title: string
  text: string
  hashTags?: string[]
  privacy: string
  previewImage: string
  squadTagName: string
}

export interface UpdatePostResponse {
  message?: string
  result: IPost
}

export interface CreateCommentRequest {
  comment: {
    parentId: string
    content: {
      text: string
    }
  }
}

export interface CreateCommentResponse {
  message?: string
}

export interface GetMeResponse {
  message?: string
  result: {
    id: string
    profileTag: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
    socialMediaRequests: {
      platform: string
      url: string
    }[]
  }
}

export interface GetCommentsReponse {
  message?: string
  result: IComment[]
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message?: string
  result: {
    message: string
  }
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  newPassword: string
}

export interface GetProfileResponse {
  message?: string
  result: {
    id: string
    profileTag: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
    socialMediaRequests: {
      platform: string
      url: string
    }[]
  }
}

export interface GenerateTextRequest {
  prompt: string
}

export interface GetCountriesResponse {
  error: boolean
  msg: string
  data: {
    name: string
    flag: string
    iso2: string
    iso3: string
  }[]
}

export interface UpdateMeRequest {
  profileTag: string
  avatarUrl?: string
  country?: string
  description?: string
  firstName: string
  lastName: string
  dob: string
  socialMediaRequests: {
    platform: string
    url: string
  }[]
}

export interface UpdateMeResponse {
  message?: string
  result: {
    id: string
    profileTag: string
    avatarUrl?: string
    country?: string
    description?: string
    firstName: string
    lastName: string
    dob: string
    socialMediaRequests: {
      platform: string
      url: string
    }[]
  }
}

export interface ReactPostRequest {
  reactType: string | undefined
}

export interface ReactPostResponse {
  result: {
    currentReact: string
    totalLikes: number
    totalDislikes: number
  }
}

export interface CreateSquadRequest {
  name: string
  tagName: string
  privacy: string
  description: string
  avatarUrl: string
  setting: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }
}

export interface CreateSquadResponse {
  result: ISquad
}

export interface GetHistoryRequest {
  page: number
  size: number
}

export interface GetHistoryResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    content: IPost[]
  }
}

export interface BaseSearchRequest {
  searchText: string
  size: number
  page: number
}

export interface SearchUsersResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: {
      id: string
      email: string
      firstName: string
      lastName: string
      profileTag: string
      avatarUrl: string
      roles: {
        name: string
        description: string
        permisssions: string[]
      }
    }[]
  }
}

export interface SearchPostsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IPost[]
  }
}

export interface SearchTagsRequest {
  searchText: string
}

export interface SearchTagsResponse {
  result: string[]
}

export interface SearchPostByTagRequest {
  hashTag: string
  size: number
  page: number
}

export interface GetSquadResponse {
  result: ISquad
}

export interface UpdateSquadRequest {
  name: string
  tagName: string
  avatarUrl: string
  privacy: string
  description: string
  setting: {
    allowPostModeration: boolean
    allowChangeProfileAccessibility: boolean
    allowPostInteraction: boolean
  }
}

export interface UpdateSquadResponse {
  result: ISquad
}

export interface JoinedSquadsResponse {
  result: {
    name: string
    tagName: string
    avatarUrl: string
  }[]
}

export interface JoinSquadRequest {
  tagName: string
}

export interface LeaveSquadRequest {
  tagName: string
}

export interface CancelJoinRequest {
  tagName: string
}

export interface LastAccessResponse {
  result: {
    squadId: string
    name: string
    tagName: string
    avatarUrl: string
    accessedAt: string
  }[]
}

export interface SearchSquadsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: ISquad[]
  }
}

export interface GetPendingRequestsRequest {
  tagName: string
}

export interface GetPendingRequestsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IMember[]
  }
}

export interface RejectRequestsRequest {
  profileIds: string[]
}

export interface ApproveRequestsRequest {
  profileIds: string[]
}

export interface GetMembersRequest {
  tagName: string
}

export interface GetMembersResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IMember[]
  }
}

export interface UpdateRoleRequest {
  profileId: string
  role: string
}

export interface SignOutRequest {
  token: string
}

export interface GetSquadPostsRequest {
  size: number
  page: number
}

export interface GetSquadPostsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IPost[]
  }
}

export interface GetArticlesRequest {
  size: number
  page: number
}

export interface GetArticlesResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IExplore[]
  }
}

export interface GetNotificationsResponse {
  size: number
  result: INotification[]
}

export interface GetStreakResponse {
  result: {
    currentStreak: number
  }
}

export interface GetLatestPostedSquads {
  result: ISquad[]
}

export interface SendFeedbackRequest {
  content: string
  rate: number
}

export interface SendFeedbackResponse {
  code: number
  result: {
    id: string
    profileId: string
    content: string
    rate: number
    createdAt: string
  }
}

export interface GetSettingsResponse {
  code: number
  result: ISettings
}

export interface ChangeSettingsRequest {
  displayMode: string
  feedSettings: {
    hashtags: string[]
    squads: string[]
    ignoreSquads: string[]
    timeline: FeedSettingsTimeline
    likes: number
  }
}

export interface GetFeedbacksRequest {
  page: number
  size: number
}

export interface GetFeedbacksResponse {
  code: number
  result: {
    id: string
    profileId: string
    content: string
    rate: number
    createdAt: string
  }[]
}

export interface GetOwnFeedbackResponse {
  code: number
  result: {
    id: string
    profileId: string
    content: string
    rate: number
    createdAt: string
  }[]
}

export interface SendChatMessageRequest {
  content: string
  sessionId: string
}

export interface SearchProfilesResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: {
      id: string
      profileTag: string
      firstName: string
      lastName: string
      avatarUrl: string
    }[]
  }
}

export interface SendChatMessageResponse {
  result: {
    content: string
    sessionId: string
    nameChatSession: string
  }
}

export interface GetAllChatResponse {
  result: {
    sessionId: string
    nameChatSession: string
  }[]
}

export interface GetChatHistoryResponse {
  result: {
    messages: IChatMessage[]
  }
}

export interface PushSearchHistoryRequest {
  content: string
  type?: string
}

export interface GetSearchHistoryResponse {
  result: {
    content: string
  }[]
}

export interface GetPopularTagsResponse {
  result: string[]
}

export interface GetSearchTagsHistoryResponse {
  result: {
    id: string
    content: string
  }[]
}

export interface CreateDiscussionRequest {
  title: string
  content: string
  voteRequest?: {
    title: string
    options: string[]
  }
  hashTags?: string[]
}

export interface CreateDiscussionResponse {
  result: IDiscussion
}

export interface UpdateDiscussionRequest {
  title: string
  content: string
  voteRequest?: {
    title: string
    options: string[]
  }
  hashTags?: string[]
}

export interface ChangeDiscussionStatusRequest {
  isOpen: boolean
}

export interface SearchDiscussionsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IDiscussion[]
  }
}

export interface VotePollRequest {
  optionId: string
}

export interface GetDetailDiscussionResponse {
  result: IDiscussion
}

export interface CreateDiscussionCommentRequest {
  commentContent: string
}

export interface GetDiscussionCommentsRequest {
  page: number
  size: number
}

export interface GetDiscussionCommentsResponse {
  result: {
    totalPages: number
    totalElements: number
    pageable: {
      pageNumber: number
      pageSize: number
      offset: number
    }
    size: number
    number: number
    content: IDiscussionComment[]
  }
}

export interface UpvoteCommentResponse {
  result: IDiscussionComment
}

export interface SummarizePostRequest {
  content: string
}

export interface SummarizePostResponse {
  result: {
    content: string
  }
}
