type Profile = {
  id: string
  profileTag: string
  avatarUrl?: string
  description?: string
  firstName: string
  lastName: string
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
