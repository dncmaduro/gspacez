import { Box, Flex, Group, Skeleton, Stack } from '@mantine/core'

export const GExploreSkeleton = () => {
  return (
    <Box
      className="rounded-lg border border-gray-300"
      px={16}
      py={12}
      w={'100%'}
    >
      <Flex align={'center'} justify={'space-between'}>
        <Skeleton height={24} width="60%" radius="sm" />
        <Skeleton height={20} width={24} radius="xl" />
      </Flex>

      <Skeleton height={16} mt={8} width="80%" radius="sm" />

      <Skeleton height={250} width={500} mt={16} mx="auto" radius="md" />

      <Stack mt={32} gap="xs">
        <Skeleton height={12} width="100%" />
        <Skeleton height={12} width="95%" />
        <Skeleton height={12} width="90%" />
        <Skeleton height={12} width="85%" />
      </Stack>

      <Group mt={48} align="flex-end" justify="space-between">
        <Stack gap={4}>
          <Skeleton height={12} width={140} />
          <Skeleton height={12} width={100} />
        </Stack>
        <Skeleton height={12} width={80} />
      </Group>
    </Box>
  )
}
