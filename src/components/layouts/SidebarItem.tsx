import { NavLink, NavLinkProps, Tooltip } from '@mantine/core'
import { GIcon } from '../common/GIcon'
import { Link, useLocation } from '@tanstack/react-router'

interface Props extends NavLinkProps {
  icon: string
  href?: string
  onClick?: () => void
  opened: boolean
}

export const SidebarItem = ({ icon, label, href, onClick, opened }: Props) => {
  const location = useLocation()

  if (!opened) {
    return (
      <Tooltip label={label} withArrow>
        <NavLink
          leftSection={<GIcon name={icon} size={16} />}
          h={32}
          pl={8}
          active={location.pathname === href}
        />
      </Tooltip>
    )
  }

  return (
    <Link to={onClick ? '.' : href} className="w-full" onClick={onClick}>
      <NavLink
        leftSection={<GIcon name={icon} size={16} />}
        label={label}
        h={32}
        pl={8}
        active={location.pathname === href}
      />
    </Link>
  )
}
