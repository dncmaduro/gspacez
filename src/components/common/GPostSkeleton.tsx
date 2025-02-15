import { Avatar, Box, Flex, Skeleton, Stack } from '@mantine/core'

export const GPostSkeleton = () => {
  return (
    <Box
      className="w-full rounded-lg border border-gray-200 shadow-md"
      px={24}
      py={16}
    >
      <Stack gap={4}>
        <Avatar />
        <Skeleton h={20} my={4} w="50%" />
        <Box h={40} mt={12}>
          <Flex gap={8}>
            {[0, 1, 2].map((index) => (
              <Skeleton h={16} w={50} radius="xl" key={index} />
            ))}
          </Flex>
        </Box>
        <Skeleton mt={14} h={200} radius="md" />
        <Flex justify="space-between" mt={12}>
          <Skeleton h={32} w={32} radius="md" />
          <Skeleton h={32} w={32} radius="md" />
          <Skeleton h={32} w={32} radius="md" />
          <Skeleton h={32} w={32} radius="md" />
        </Flex>
      </Stack>
    </Box>
  )
}
