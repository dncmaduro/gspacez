import { IPost } from '../hooks/interface'

type Profile = {
  id: string
  profileTag: string
  avatarUrl?: string
  description?: string
  firstName: string
  lastName: string
}

type Squad = {
  id: string
  tagName: string
  name: string
  avatarUrl?: string
  description?: string
  privacy: string
}

export const usersPrompt = (users: Profile[], prompt: string) => {
  return `Return an array of ids of users that match the following prompt: ${prompt}. The users are: ${users
    .map(
      (user) =>
        `{id: "${user.id}", profileTag: "${user.profileTag}", firstName: "${user.firstName}", lastName: "${user.lastName}"${user.description ? `, description: "${user.description}"` : ''}}`
    )
    .join(
      ', '
    )}. Only return array, do not include any preceeding or succeeding text.`
}

export const squadsPrompt = (squads: Squad[], prompt: string) => {
  return `Return an array of ids of squads that match the following prompt: ${prompt}. The squads are: ${squads
    .map(
      (squad) =>
        `{id: "${squad.id}", tagName: "${squad.tagName}", name: "${squad.name}", privacy: "${squad.privacy}"${squad.description ? `, description: "${squad.description}"` : ''}}`
    )
    .join(
      ', '
    )}. Only return array, do not include any preceeding or succeeding text.`
}

export const postsPrompt = (posts: IPost[], prompt: string) => {
  return `Return an array of ids of posts that match the following prompt: ${prompt}. The posts are: ${posts
    .map(
      (post) =>
        `{id: "${post.id}", ${post.title ? `title: "${post.title}",` : ''} content: "${post.content.text.substring(0, 200)}...", author: "${post.profileName} (@${post.profileTag})"}`
    )
    .join(
      ', '
    )}. Only return array, do not include any preceeding or succeeding text.`
}
