import { NavLink, NavLinkProps } from '@mantine/core'
import { GIcon } from '../../common/GIcon'

interface Props extends NavLinkProps {
  icon: string
}

export const SidebarItem = ({ icon, label }: Props) => {
  return (
    <NavLink
      leftSection={<GIcon name={icon} size={16} />}
      label={label}
      h={32}
      pl={8}
    />
  )
}
