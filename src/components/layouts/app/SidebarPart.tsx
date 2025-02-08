import { ActionIcon, Button, Collapse, Stack } from '@mantine/core'
import { ChildProps } from '../../../utils/props'
import { GIcon } from '../../common/GIcon'
import { useDisclosure } from '@mantine/hooks'

interface Props extends ChildProps {
  title?: string
  icon?: string
  opened: boolean
}

export const SidebarPart = ({
  children,
  title,
  icon,
  opened: sidebarOpened
}: Props) => {
  if (!title) {
    return children
  }

  const [opened, { toggle }] = useDisclosure(true)

  return (
    <Stack gap={8}>
      {sidebarOpened ? (
        <Button
          variant="light"
          rightSection={
            <GIcon name={opened ? 'ChevronUp' : 'ChevronDown'} size={16} />
          }
          size="xs"
          color="gray"
          styles={{
            inner: {
              justifyContent: 'flex-start'
            },
            section: {
              marginLeft: 'auto'
            }
          }}
          onClick={toggle}
          pl={8}
        >
          {title}
        </Button>
      ) : (
        <ActionIcon onClick={toggle} variant="light" color="gray" mx="auto">
          {icon && <GIcon name={icon} size={16} />}
        </ActionIcon>
      )}

      <Collapse in={opened}>{children}</Collapse>
    </Stack>
  )
}
