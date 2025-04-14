import {
  Box,
  Flex,
  Group,
  Image,
  Text,
  Badge,
  Divider,
  Tooltip
} from '@mantine/core'
import { IExplore } from '../../hooks/interface'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { GIcon } from './GIcon'

interface Props {
  article: IExplore
}

export const GExplore = ({ article }: Props) => {
  return (
    <Box
      className="rounded-lg border border-gray-300 transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
      px={24}
      py={16}
      w={1000}
      component={Link}
      to={article.url}
      target="blank"
    >
      <Flex align={'center'} justify={'space-between'} mb={12}>
        <Text className="!text-xl !font-bold text-indigo-800">
          {article.title}
        </Text>
        <Tooltip label={article.source.name} openDelay={300}>
          <Badge color="indigo" radius="sm" variant="light">
            {article.source.name}
          </Badge>
        </Tooltip>
      </Flex>

      <Text c={'dimmed'} size="sm" mb={20} className="leading-relaxed">
        {article.description}
      </Text>

      <Image
        src={article.urlToImage}
        w={600}
        className="rounded-md border border-gray-300 shadow-sm"
        mt={16}
        mx={'auto'}
      />

      <Box mt={32} className="leading-relaxed text-gray-700">
        {article.content}
      </Box>

      <Divider my={24} />

      <Group justify="apart" align="center">
        <Group gap={8}>
          <GIcon name="User" size={16} color="#4F46E5" />
          <Text className="font-medium">
            By {article.author || 'Anonymous'}
          </Text>
        </Group>

        <Group gap={8}>
          <GIcon name="Calendar" size={16} color="#6B7280" />
          <Text c={'dimmed'} size="sm">
            {format(new Date(article.publishedAt), 'PP')}
          </Text>
        </Group>
      </Group>
    </Box>
  )
}
