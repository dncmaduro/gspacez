import { Avatar, Box, Group, Text, Tooltip } from '@mantine/core'
import { Link } from '@tanstack/react-router'

interface Squad {
  name: string
  tagName: string
  avatarUrl: string
}

interface Props {
  squads: Squad[]
}

export const GProfileSquads = ({ squads }: Props) => {
  return (
    <Box className="rounded-lg border border-indigo-200" bg="white" p={16}>
      <Text size="md">Involved Squads</Text>
      {!squads || squads.length === 0 ? (
        <Text c="dimmed" size="sm">
          You haven't joined any squads yet. Join one to start your journey!
        </Text>
      ) : (
        <Group pt={10}>
          <Tooltip.Group openDelay={300} closeDelay={100}>
            <Box
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              {squads.map((squad) => (
                <Tooltip key={squad.tagName} label={squad.name} withArrow>
                  <Link to={`/squad/${squad.tagName}`}>
                    <Avatar
                      src={squad.avatarUrl}
                      radius="xl"
                      size="md"
                      style={{
                        cursor: 'pointer',
                        border: '2px solid #ccc'
                      }}
                    />
                  </Link>
                </Tooltip>
              ))}
            </Box>
          </Tooltip.Group>
        </Group>
      )}
    </Box>
  )
}
