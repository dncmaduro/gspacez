import { Avatar, NavLink, Tooltip } from '@mantine/core'
import { Link } from '@tanstack/react-router'

interface Props {
  squad: {
    squadId: string
    name: string
    tagName: string
    avatarUrl: string
    accessedAt?: string
  }
  opened: boolean
}

export const SidebarSquad = ({ squad, opened }: Props) => {
  if (!opened) {
    return (
      <Tooltip label={squad.name} withArrow>
        <NavLink
          leftSection={
            <Avatar
              size={'xs'}
              src={squad.avatarUrl}
              className="border border-gray-300"
            />
          }
          h={32}
          pl={8}
        />
      </Tooltip>
    )
  }

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
