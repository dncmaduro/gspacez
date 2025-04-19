import {
  Avatar,
  Box,
  Group,
  Text,
  Tooltip,
  Button,
  Stack,
  Divider
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { GIcon } from './GIcon'

interface Squad {
  name: string
  tagName: string
  avatarUrl: string
}

interface Props {
  squads: Squad[]
}

export const GProfileSquads = ({ squads }: Props) => {
  const hasSquads = squads && squads.length > 0

  return (
    <Box
      className="rounded-lg border border-indigo-200 shadow-sm transition-shadow duration-300 hover:shadow-md"
      bg="white"
      p={24}
    >
      <Stack gap={16}>
        <Group gap={12}>
          <GIcon name="ChartCohort" size={20} color="#4F46E5" />
          <Text size="lg" fw={600} className="text-indigo-900">
            Involved Squads
          </Text>
        </Group>

        <Divider color="gray.2" />

        {!hasSquads ? (
          <Stack align="center" py={16} gap={12}>
            <Box className="rounded-full bg-indigo-50 p-4">
              <GIcon name="Users" size={32} color="#818CF8" />
            </Box>
            <Text c="dimmed" size="sm" ta="center" maw={280}>
              You haven't joined any squads yet. Join one to start your journey!
            </Text>
            <Button
              variant="light"
              color="indigo"
              size="sm"
              radius="md"
              leftSection={<GIcon name="Search" size={16} />}
              component={Link}
              to="/search"
              className="mt-2 transition-transform duration-200 hover:scale-105"
            >
              Explore Squads
            </Button>
          </Stack>
        ) : (
          <Stack gap={16}>
            <Tooltip.Group openDelay={300} closeDelay={100}>
              <Box className="flex flex-wrap gap-3">
                {squads.map((squad) => (
                  <Tooltip
                    key={squad.tagName}
                    label={squad.name}
                    withArrow
                    position="top"
                    color="indigo"
                  >
                    <Link to={`/squad/${squad.tagName}`}>
                      <Avatar
                        src={squad.avatarUrl}
                        radius="xl"
                        size="md"
                        className="cursor-pointer border-2 border-indigo-100 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
                      />
                    </Link>
                  </Tooltip>
                ))}
              </Box>
            </Tooltip.Group>

            <Button
              variant="subtle"
              color="indigo"
              size="sm"
              radius="md"
              rightSection={<GIcon name="ArrowRight" size={16} />}
              component={Link}
              to="/search"
              className="self-end transition-transform duration-200 hover:translate-x-1"
            >
              Find more squads
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
