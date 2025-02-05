import * as TablerIcons from '@tabler/icons-react'

interface Props {
  name: string
}

export const GIcon: React.FC<Props & TablerIcons.IconProps> = ({
  name,
  ...props
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (TablerIcons as any)[`Icon${name}`]

  if (!Icon) {
    console.error(`Icon "${name}" does not exist in Tabler Icons.`)
    return null
  }

  return <Icon {...props} />
}
