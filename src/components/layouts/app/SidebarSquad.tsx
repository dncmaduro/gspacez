import { Avatar, NavLink } from '@mantine/core'
import { Link } from '@tanstack/react-router'

interface Props {
  squad: {
    squadId: string
    name: string
    tagName: string
    avatarUrl: string
    accessedAt?: string
  }
}

export const SidebarSquad = ({ squad }: Props) => {
  return (
    <Link to={`/squad/${squad.tagName}`} className="w-full">
      <NavLink
        leftSection={
          <Avatar
            size={'xs'}
            src={squad.avatarUrl}
            className="border border-gray-300"
          />
        }
        label={squad.name}
        h={32}
        pl={8}
      />
    </Link>
  )
}
