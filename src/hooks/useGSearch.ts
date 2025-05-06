import { useAuthStore } from '../store/authStore'
import { callApi } from '../utils/axios'
import {
  BaseSearchRequest,
  SearchPostsResponse,
  SearchSquadsResponse,
  SearchUsersResponse,
  SearchTagsResponse,
  SearchTagsRequest,
  SearchPostByTagRequest,
  SearchProfilesResponse,
  PushSearchHistoryRequest,
  GetSearchHistoryResponse,
  GetPopularTagsResponse,
  GetSearchTagsHistoryResponse
} from './models'

export const useGSearch = () => {
  const { accessToken, clearAuth } = useAuthStore()

  const searchUsers = async (req: BaseSearchRequest) => {
    return callApi<never, SearchUsersResponse>({
      method: 'GET',
      path: `/v1/identity/users/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchPosts = async (req: BaseSearchRequest) => {
    return callApi<never, SearchPostsResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchSquads = async (req: BaseSearchRequest) => {
    return callApi<never, SearchSquadsResponse>({
      method: 'GET',
      path: `/v1/profile-service/squads/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchTags = async (req: SearchTagsRequest) => {
    return callApi<never, SearchTagsResponse>({
      method: 'GET',
      path: `/v1/post-service/tags/search?searchText=${req.searchText}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchPostsByTag = async (req: SearchPostByTagRequest) => {
    return callApi<never, SearchPostsResponse>({
      method: 'GET',
      path: `/v1/post-service/posts/posts-by-hashtag?hashTag=${req.hashTag}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const searchProfiles = async (req: BaseSearchRequest) => {
    return callApi<never, SearchProfilesResponse>({
      method: 'GET',
      path: `/v1/profile-service/info/search?searchText=${req.searchText}&size=${req.size}&page=${req.page}`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const pushSearchHistory = async (req: PushSearchHistoryRequest) => {
    return callApi<PushSearchHistoryRequest, never>({
      method: 'POST',
      path: `/v1/profile-service/search/history/create`,
      data: req,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getSearchHistory = async () => {
    return callApi<never, GetSearchHistoryResponse>({
      method: 'GET',
      path: `/v1/profile-service/search/history`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getPopularTags = async () => {
    return callApi<never, GetPopularTagsResponse>({
      method: 'GET',
      path: `/v1/post-service/tags/populars`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  const getSearchTagsHistory = async () => {
    return callApi<never, GetSearchTagsHistoryResponse>({
      method: 'GET',
      path: `/v1/profile-service/search/history/tags`,
      accessToken,
      onClearAuth: clearAuth
    })
  }

  return {
    searchUsers,
    searchPosts,
    searchSquads,
    searchTags,
    searchPostsByTag,
    searchProfiles,
    pushSearchHistory,
    getSearchHistory,
    getPopularTags,
    getSearchTagsHistory
  }
}
