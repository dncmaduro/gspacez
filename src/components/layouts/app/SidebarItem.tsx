import { NavLink, NavLinkProps } from '@mantine/core'
import { GIcon } from '../../common/GIcon'
import { Link, useLocation } from '@tanstack/react-router'

interface Props extends NavLinkProps {
  icon: string
  href?: string
  onClick?: () => void
}

export const SidebarItem = ({ icon, label, href, onClick }: Props) => {
  const location = useLocation()

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
