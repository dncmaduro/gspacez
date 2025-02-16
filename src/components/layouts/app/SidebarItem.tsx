import { NavLink, NavLinkProps } from '@mantine/core'
import { GIcon } from '../../common/GIcon'
import { Link, useLocation } from '@tanstack/react-router'

interface Props extends NavLinkProps {
  icon: string
  href?: string
}

export const SidebarItem = ({ icon, label, href }: Props) => {
  const location = useLocation()

  return (
    <Link to={href} className="w-full">
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
