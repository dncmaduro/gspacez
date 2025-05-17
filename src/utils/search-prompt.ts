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
  return `Return ONLY a pure JSON array of user ids that match the following prompt: "${prompt}".
The users are: ${users
    .map(
      (user) =>
        `{id: "${user.id}", profileTag: "${user.profileTag}", firstName: "${user.firstName}", lastName: "${user.lastName}"${user.description ? `, description: "${user.description}"` : ''}}`
    )
    .join(', ')}.
IMPORTANT: Do NOT include any explanations, text, comments, markdown code block, or any prefix/suffix. The output must be a valid JSON array, nothing else. Only output the array.`
}

export const squadsPrompt = (squads: Squad[], prompt: string) => {
  return `Return ONLY a pure JSON array of squad ids that match the following prompt: "${prompt}".
The squads are: ${squads
    .map(
      (squad) =>
        `{id: "${squad.id}", tagName: "${squad.tagName}", name: "${squad.name}", privacy: "${squad.privacy}"${squad.description ? `, description: "${squad.description}"` : ''}}`
    )
    .join(', ')}.
IMPORTANT: Do NOT include any explanations, text, comments, markdown code block, or any prefix/suffix. The output must be a valid JSON array, nothing else. Only output the array.`
}

export const postsPrompt = (posts: IPost[], prompt: string) => {
  return `Return ONLY a pure JSON array of post ids that match the following prompt: "${prompt}".
The posts are: ${posts
    .map(
      (post) =>
        `{id: "${post.id}",${post.title ? ` title: "${post.title}",` : ''} content: "${post.content.text.substring(0, 200)}...", author: "${post.profileName} (@${post.profileTag})"}`
    )
    .join(', ')}.
IMPORTANT: Do NOT include any explanations, text, comments, markdown code block, or any prefix/suffix. The output must be a valid JSON array, nothing else. Only output the array.`
}
