import { Box, Group, Skeleton, Stack } from '@mantine/core'
import { useDark } from '../../hooks/useDark'

export const GSimplePostSkeleton = () => {
  const { isDark } = useDark()

  return (
    <Box
      className={`rounded-lg border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } animate-pulse`}
      p={16}
      bg={isDark ? 'gray.9' : 'white'}
      w={'100%'}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Group>
        <Skeleton height={40} circle />
        <Stack gap={8} style={{ flex: 1 }}>
          <Group gap={8} align="center">
            <Skeleton height={16} width={120} radius="sm" />
            <Skeleton height={16} width={60} radius="xl" />
          </Group>
          <Skeleton height={12} width={150} radius="sm" />
        </Stack>
      </Group>

      <Skeleton height={24} width="70%" mt={16} radius="sm" />

      <Stack gap={8} mt={12}>
        <Skeleton height={12} radius="sm" />
        <Skeleton height={12} radius="sm" />
        <Skeleton height={12} width="80%" radius="sm" />
      </Stack>

      <Group mt={24} gap={32} className="border-t border-gray-100 pt-3">
        <Skeleton height={24} width={60} radius="sm" />
        <Skeleton height={24} width={60} radius="sm" />
        <Skeleton height={24} width={80} radius="sm" ml="auto" />
      </Group>
    </Box>
  )
}
